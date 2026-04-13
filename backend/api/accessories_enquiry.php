<?php
// ============================================================
//  Tata Accessories Enquiry API
//  Place at: public_html/backend/api/accessories_enquiry.php
// ============================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db   = 'YOUR_DB_NAME';
$user = 'YOUR_DB_USER';
$pass = 'YOUR_DB_PASSWORD';

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]);
    exit();
}

mysqli_set_charset($conn, "utf8mb4");

function sendResponse($statusCode, $status, $message, $data = null) {
    http_response_code($statusCode);
    $response = ["status" => $status, "message" => $message];
    if ($data !== null) $response["data"] = $data;
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

function sanitize($value) {
    return htmlspecialchars(strip_tags(trim($value)));
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) sendResponse(400, "error", "Invalid JSON body.");

        $name  = sanitize($input['name']  ?? '');
        $phone = sanitize($input['phone'] ?? '');
        $email = sanitize($input['email'] ?? '');
        $items = $input['items'] ?? [];

        if (empty($name))  sendResponse(422, "error", "Name is required.");
        if (empty($phone)) sendResponse(422, "error", "Phone number is required.");
        if (!preg_match('/^[6-9]\d{9}$/', $phone)) sendResponse(422, "error", "Enter a valid 10-digit Indian mobile number.");
        if (empty($email)) sendResponse(422, "error", "Email address is required.");
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) sendResponse(422, "error", "Enter a valid email address.");
        if (empty($items) || !is_array($items)) sendResponse(422, "error", "At least one accessory must be selected.");
        if (count($items) > 100) sendResponse(422, "error", "Too many items (max 100).");

        mysqli_begin_transaction($conn);

        try {
            $total_items = count($items);
            $stmt = mysqli_prepare($conn,
                "INSERT INTO accessories_enquiries (name, phone, email, total_items) VALUES (?, ?, ?, ?)"
            );
            mysqli_stmt_bind_param($stmt, "sssi", $name, $phone, $email, $total_items);
            mysqli_stmt_execute($stmt);
            $enquiry_id = mysqli_insert_id($conn);
            mysqli_stmt_close($stmt);

            if (!$enquiry_id) throw new Exception("Failed to create enquiry.");

            $stmt2 = mysqli_prepare($conn,
                "INSERT INTO accessories_enquiry_items (enquiry_id, model_id, model_name, acc_name, acc_category, acc_tag, is_ev) VALUES (?, ?, ?, ?, ?, ?, ?)"
            );

            foreach ($items as $item) {
                $model_id   = sanitize($item['model_id']     ?? '');
                $model_name = sanitize($item['model_name']   ?? '');
                $acc_name   = sanitize($item['acc_name']     ?? '');
                $acc_cat    = sanitize($item['acc_category'] ?? '');
                $acc_tag    = sanitize($item['acc_tag']      ?? '');
                $is_ev      = (isset($item['is_ev']) && $item['is_ev']) ? 1 : 0;

                if (empty($model_id) || empty($acc_name)) throw new Exception("Each item needs a model and accessory name.");

                mysqli_stmt_bind_param($stmt2, "isssssi", $enquiry_id, $model_id, $model_name, $acc_name, $acc_cat, $acc_tag, $is_ev);
                mysqli_stmt_execute($stmt2);
            }

            mysqli_stmt_close($stmt2);
            mysqli_commit($conn);

            sendResponse(201, "success", "Enquiry submitted! Our team will contact you within 24 hours.", [
                "enquiry_id"  => $enquiry_id,
                "total_items" => $total_items
            ]);

        } catch (Exception $e) {
            mysqli_rollback($conn);
            sendResponse(500, "error", "Failed to submit: " . $e->getMessage());
        }
        break;

    case 'GET':
        $id = intval($_GET['id'] ?? 0);

        if ($id > 0) {
            $stmt = mysqli_prepare($conn, "SELECT * FROM accessories_enquiries WHERE id = ?");
            mysqli_stmt_bind_param($stmt, "i", $id);
            mysqli_stmt_execute($stmt);
            $result  = mysqli_stmt_get_result($stmt);
            $enquiry = mysqli_fetch_assoc($result);
            mysqli_stmt_close($stmt);

            if (!$enquiry) sendResponse(404, "error", "Enquiry not found.");

            $stmt2 = mysqli_prepare($conn, "SELECT * FROM accessories_enquiry_items WHERE enquiry_id = ? ORDER BY id ASC");
            mysqli_stmt_bind_param($stmt2, "i", $id);
            mysqli_stmt_execute($stmt2);
            $result2 = mysqli_stmt_get_result($stmt2);
            $enquiry['items'] = [];
            while ($row = mysqli_fetch_assoc($result2)) {
                $enquiry['items'][] = $row;
            }
            mysqli_stmt_close($stmt2);

            sendResponse(200, "success", "Enquiry found.", $enquiry);

        } else {
            $page   = max(1, intval($_GET['page']  ?? 1));
            $limit  = min(50, intval($_GET['limit'] ?? 20));
            $offset = ($page - 1) * $limit;

            $countStmt = mysqli_prepare($conn, "SELECT COUNT(*) as total FROM accessories_enquiries");
            mysqli_stmt_execute($countStmt);
            $total = mysqli_fetch_assoc(mysqli_stmt_get_result($countStmt))['total'];
            mysqli_stmt_close($countStmt);

            $listStmt = mysqli_prepare($conn, "SELECT * FROM accessories_enquiries ORDER BY created_at DESC LIMIT ? OFFSET ?");
            mysqli_stmt_bind_param($listStmt, "ii", $limit, $offset);
            mysqli_stmt_execute($listStmt);
            $result    = mysqli_stmt_get_result($listStmt);
            $enquiries = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $enquiries[] = $row;
            }
            mysqli_stmt_close($listStmt);

            sendResponse(200, "success", "Enquiries fetched.", [
                "enquiries"   => $enquiries,
                "total"       => intval($total),
                "page"        => $page,
                "limit"       => $limit,
                "total_pages" => ceil($total / $limit),
            ]);
        }
        break;

    case 'PUT':
        $id    = intval($_GET['id'] ?? 0);
        $input = json_decode(file_get_contents("php://input"), true);
        if ($id <= 0) sendResponse(400, "error", "Enquiry ID is required.");

        $new_status = sanitize($input['status'] ?? '');
        if (!in_array($new_status, ['new', 'contacted', 'closed'])) {
            sendResponse(422, "error", "Status must be: new, contacted, or closed.");
        }

        $stmt = mysqli_prepare($conn, "UPDATE accessories_enquiries SET status = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "si", $new_status, $id);
        mysqli_stmt_execute($stmt);
        $affected = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);

        if ($affected === 0) sendResponse(404, "error", "Enquiry not found or status unchanged.");
        sendResponse(200, "success", "Status updated to '{$new_status}'.", ["enquiry_id" => $id, "status" => $new_status]);
        break;

    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id <= 0) sendResponse(400, "error", "Enquiry ID is required.");

        $stmt = mysqli_prepare($conn, "DELETE FROM accessories_enquiries WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $affected = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);

        if ($affected === 0) sendResponse(404, "error", "Enquiry not found.");
        sendResponse(200, "success", "Enquiry #{$id} deleted.");
        break;

    default:
        sendResponse(405, "error", "Method not allowed.");
        break;
}

mysqli_close($conn);