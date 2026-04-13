<?php
// ============================================================
//  Tata Insurance Enquiry API
//  Place at: public_html/backend/api/insurance_enquiry.php
// ============================================================

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── DB Config ─────────────────────────────────────────────────
$host = 'localhost';
$db   = 'YOUR_DB_NAME';
$user = 'YOUR_DB_USER';
$pass = 'YOUR_DB_PASSWORD';

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "DB connection failed: " . mysqli_connect_error()]);
    exit();
}
mysqli_set_charset($conn, "utf8mb4");

// ── Helpers ───────────────────────────────────────────────────
function respond($code, $status, $message, $data = null) {
    http_response_code($code);
    $r = ["status" => $status, "message" => $message];
    if ($data !== null) $r["data"] = $data;
    echo json_encode($r, JSON_UNESCAPED_UNICODE);
    exit();
}

function clean($v) {
    return htmlspecialchars(strip_tags(trim($v ?? '')));
}

// ── Route ─────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ── POST: Submit insurance enquiry ────────────────────────
    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) respond(400, "error", "Invalid JSON body.");

        // Core fields
        $name          = clean($input['name']          ?? '');
        $phone         = clean($input['phone']         ?? '');
        $email         = clean($input['email']         ?? '');
        $enquiry_type  = clean($input['enquiry_type']  ?? '');
        $plan_selected = clean($input['plan_selected'] ?? '');
        $vehicle_model = clean($input['vehicle_model'] ?? '');
        $vehicle_number= clean($input['vehicle_number']?? '');
        $message       = clean($input['message']       ?? '');

        // Type-specific fields
        $chassis_no    = clean($input['chassis_no']    ?? '');
        $old_policy_no = clean($input['old_policy_no'] ?? '');

        // ── Validation ────────────────────────────────────────
        if (empty($name))
            respond(422, "error", "Name is required.");
        if (empty($phone))
            respond(422, "error", "Phone number is required.");
        if (!preg_match('/^[6-9]\d{9}$/', $phone))
            respond(422, "error", "Enter a valid 10-digit Indian mobile number.");
        if (empty($email))
            respond(422, "error", "Email address is required.");
        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
            respond(422, "error", "Enter a valid email address.");
        if (!in_array($enquiry_type, ['new', 'renew']))
            respond(422, "error", "enquiry_type must be 'new' or 'renew'.");
        if (empty($vehicle_model))
            respond(422, "error", "Vehicle model is required.");
        if ($enquiry_type === 'new' && empty($chassis_no))
            respond(422, "error", "Chassis number is required for new insurance.");
        if ($enquiry_type === 'renew' && empty($old_policy_no))
            respond(422, "error", "Old policy number is required for renewal.");
        if ($enquiry_type === 'renew' && empty($vehicle_number))
            respond(422, "error", "Vehicle registration number is required for renewal.");

        // ── Insert ────────────────────────────────────────────
        $stmt = mysqli_prepare($conn,
            "INSERT INTO insurance_enquiries
             (name, phone, email, enquiry_type, plan_selected, chassis_no,
              old_policy_no, vehicle_number, vehicle_model, message)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        mysqli_stmt_bind_param($stmt, "ssssssssss",
            $name, $phone, $email, $enquiry_type, $plan_selected,
            $chassis_no, $old_policy_no, $vehicle_number, $vehicle_model, $message
        );

        if (!mysqli_stmt_execute($stmt)) {
            respond(500, "error", "Failed to save enquiry: " . mysqli_stmt_error($stmt));
        }
        $new_id = mysqli_insert_id($conn);
        mysqli_stmt_close($stmt);

        $label = $enquiry_type === 'new' ? 'New Insurance' : 'Renewal';
        respond(201, "success",
            "{$label} enquiry submitted! Our team will contact you within 24 hours.",
            ["enquiry_id" => $new_id, "type" => $enquiry_type]
        );
        break;

    // ── GET ───────────────────────────────────────────────────
    case 'GET':
        $id = intval($_GET['id'] ?? 0);

        if ($id > 0) {
            $stmt = mysqli_prepare($conn,
                "SELECT * FROM insurance_enquiries WHERE id = ?"
            );
            mysqli_stmt_bind_param($stmt, "i", $id);
            mysqli_stmt_execute($stmt);
            $row = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
            mysqli_stmt_close($stmt);
            if (!$row) respond(404, "error", "Enquiry not found.");
            respond(200, "success", "Enquiry found.", $row);

        } else {
            $page   = max(1, intval($_GET['page']  ?? 1));
            $limit  = min(50, intval($_GET['limit'] ?? 20));
            $offset = ($page - 1) * $limit;

            $wheres = []; $params = []; $types = "";

            $type   = clean($_GET['type']   ?? '');
            $status = clean($_GET['status'] ?? '');
            if (in_array($type, ['new','renew']))              { $wheres[] = "enquiry_type = ?"; $params[] = $type;   $types .= "s"; }
            if (in_array($status, ['new','contacted','closed'])){ $wheres[] = "status = ?";       $params[] = $status; $types .= "s"; }

            $wc = count($wheres) ? " WHERE " . implode(" AND ", $wheres) : "";

            $cStmt = mysqli_prepare($conn, "SELECT COUNT(*) as total FROM insurance_enquiries" . $wc);
            if ($types) mysqli_stmt_bind_param($cStmt, $types, ...$params);
            mysqli_stmt_execute($cStmt);
            $total = mysqli_fetch_assoc(mysqli_stmt_get_result($cStmt))['total'];
            mysqli_stmt_close($cStmt);

            $lStmt = mysqli_prepare($conn,
                "SELECT * FROM insurance_enquiries" . $wc . " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            );
            $lP = array_merge($params, [$limit, $offset]);
            $lT = $types . "ii";
            mysqli_stmt_bind_param($lStmt, $lT, ...$lP);
            mysqli_stmt_execute($lStmt);
            $result = mysqli_stmt_get_result($lStmt);
            $rows   = [];
            while ($r = mysqli_fetch_assoc($result)) $rows[] = $r;
            mysqli_stmt_close($lStmt);

            respond(200, "success", "Enquiries fetched.", [
                "enquiries"   => $rows,
                "total"       => intval($total),
                "page"        => $page,
                "limit"       => $limit,
                "total_pages" => ceil($total / $limit),
            ]);
        }
        break;

    // ── PUT: Update status ────────────────────────────────────
    case 'PUT':
        $id    = intval($_GET['id'] ?? 0);
        $input = json_decode(file_get_contents("php://input"), true);
        if ($id <= 0) respond(400, "error", "Enquiry ID required.");

        $s = clean($input['status'] ?? '');
        if (!in_array($s, ['new','contacted','closed']))
            respond(422, "error", "Status must be: new, contacted, or closed.");

        $stmt = mysqli_prepare($conn,
            "UPDATE insurance_enquiries SET status = ? WHERE id = ?"
        );
        mysqli_stmt_bind_param($stmt, "si", $s, $id);
        mysqli_stmt_execute($stmt);
        $aff = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);

        if ($aff === 0) respond(404, "error", "Enquiry not found or status unchanged.");
        respond(200, "success", "Status updated to '{$s}'.", ["id" => $id, "status" => $s]);
        break;

    // ── DELETE ────────────────────────────────────────────────
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id <= 0) respond(400, "error", "Enquiry ID required.");

        $stmt = mysqli_prepare($conn, "DELETE FROM insurance_enquiries WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $aff = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);

        if ($aff === 0) respond(404, "error", "Enquiry not found.");
        respond(200, "success", "Enquiry #{$id} deleted.");
        break;

    default:
        respond(405, "error", "Method not allowed.");
}

mysqli_close($conn);