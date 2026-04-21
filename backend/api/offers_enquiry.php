<?php
// ============================================================
//  Tata Current Offers Enquiry API
//  Place at: public_html/backend/api/offers_enquiry.php
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
require_once __DIR__ . '/../config/db.php';

// ── Helpers ───────────────────────────────────────────────────
function sendResponse($code, $status, $message, $data = null) {
    http_response_code($code);
    $r = ["status" => $status, "message" => $message];
    if ($data !== null) $r["data"] = $data;
    echo json_encode($r, JSON_UNESCAPED_UNICODE);
    exit();
}

function sanitize($v) {
    return htmlspecialchars(strip_tags(trim($v)));
}

// ── Route ─────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ── POST: Submit enquiry ───────────────────────────────────
    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) sendResponse(400, "error", "Invalid JSON body.");

        $name           = sanitize($input['name']           ?? '');
        $phone          = sanitize($input['phone']          ?? '');
        $email          = sanitize($input['email']          ?? '');
        $offer_id       = intval($input['offer_id']         ?? 0);
        $offer_model    = sanitize($input['offer_model']    ?? '');
        $offer_headline = sanitize($input['offer_headline'] ?? '');
        $enquiry_type   = sanitize($input['enquiry_type']   ?? 'claim');

        // Validation
        if (empty($name))  sendResponse(422, "error", "Name is required.");
        if (empty($phone)) sendResponse(422, "error", "Phone number is required.");
        if (!preg_match('/^[6-9]\d{9}$/', $phone))
            sendResponse(422, "error", "Enter a valid 10-digit Indian mobile number.");
        if (empty($email)) sendResponse(422, "error", "Email address is required.");
        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
            sendResponse(422, "error", "Enter a valid email address.");
        if ($offer_id <= 0) sendResponse(422, "error", "Offer ID is required.");
        if (empty($offer_model)) sendResponse(422, "error", "Offer model is required.");
        if (!in_array($enquiry_type, ['claim', 'know_more']))
            sendResponse(422, "error", "enquiry_type must be 'claim' or 'know_more'.");

        $stmt = mysqli_prepare($conn,
            "INSERT INTO offers_enquiries
             (name, phone, email, offer_id, offer_model, offer_headline, enquiry_type)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        mysqli_stmt_bind_param($stmt, "sssiss s",
            $name, $phone, $email,
            $offer_id, $offer_model, $offer_headline, $enquiry_type
        );

        // Fix bind_param — retype correctly
        mysqli_stmt_close($stmt);
        $stmt = mysqli_prepare($conn,
            "INSERT INTO offers_enquiries
             (name, phone, email, offer_id, offer_model, offer_headline, enquiry_type)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        mysqli_stmt_bind_param($stmt, "sssisss",
            $name, $phone, $email,
            $offer_id, $offer_model, $offer_headline, $enquiry_type
        );

        if (!mysqli_stmt_execute($stmt)) {
            sendResponse(500, "error", "Failed to save enquiry: " . mysqli_stmt_error($stmt));
        }
        $new_id = mysqli_insert_id($conn);
        mysqli_stmt_close($stmt);

        $label = $enquiry_type === 'claim' ? 'Claim' : 'Know More';
        sendResponse(201, "success",
            "{$label} enquiry submitted! Our team will contact you within 24 hours.",
            ["enquiry_id" => $new_id, "type" => $enquiry_type]
        );
        break;

    // ── GET: Fetch enquiries ───────────────────────────────────
    case 'GET':
        $id = intval($_GET['id'] ?? 0);

        if ($id > 0) {
            $stmt = mysqli_prepare($conn,
                "SELECT * FROM offers_enquiries WHERE id = ?"
            );
            mysqli_stmt_bind_param($stmt, "i", $id);
            mysqli_stmt_execute($stmt);
            $row = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
            mysqli_stmt_close($stmt);
            if (!$row) sendResponse(404, "error", "Enquiry not found.");
            sendResponse(200, "success", "Enquiry found.", $row);
        } else {
            $page   = max(1, intval($_GET['page']  ?? 1));
            $limit  = min(50, intval($_GET['limit'] ?? 20));
            $offset = ($page - 1) * $limit;

            // Optional filters
            $type   = sanitize($_GET['type']   ?? '');
            $status = sanitize($_GET['status'] ?? '');

            $where  = [];
            $params = [];
            $types  = "";

            if (in_array($type, ['claim','know_more']))  { $where[] = "enquiry_type = ?"; $params[] = $type;   $types .= "s"; }
            if (in_array($status, ['new','contacted','closed'])) { $where[] = "status = ?"; $params[] = $status; $types .= "s"; }

            $whereClause = count($where) ? " WHERE " . implode(" AND ", $where) : "";

            // Count
            $cStmt = mysqli_prepare($conn, "SELECT COUNT(*) as total FROM offers_enquiries" . $whereClause);
            if ($types) mysqli_stmt_bind_param($cStmt, $types, ...$params);
            mysqli_stmt_execute($cStmt);
            $total = mysqli_fetch_assoc(mysqli_stmt_get_result($cStmt))['total'];
            mysqli_stmt_close($cStmt);

            // Data
            $lStmt = mysqli_prepare($conn,
                "SELECT * FROM offers_enquiries" . $whereClause .
                " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            );
            $lParams = array_merge($params, [$limit, $offset]);
            $lTypes  = $types . "ii";
            mysqli_stmt_bind_param($lStmt, $lTypes, ...$lParams);
            mysqli_stmt_execute($lStmt);
            $result = mysqli_stmt_get_result($lStmt);
            $rows   = [];
            while ($r = mysqli_fetch_assoc($result)) $rows[] = $r;
            mysqli_stmt_close($lStmt);

            sendResponse(200, "success", "Enquiries fetched.", [
                "enquiries"   => $rows,
                "total"       => intval($total),
                "page"        => $page,
                "limit"       => $limit,
                "total_pages" => ceil($total / $limit),
            ]);
        }
        break;

    // ── PUT: Update status ─────────────────────────────────────
    case 'PUT':
        $id    = intval($_GET['id'] ?? 0);
        $input = json_decode(file_get_contents("php://input"), true);
        if ($id <= 0) sendResponse(400, "error", "Enquiry ID is required.");

        $new_status = sanitize($input['status'] ?? '');
        if (!in_array($new_status, ['new','contacted','closed']))
            sendResponse(422, "error", "Status must be: new, contacted, or closed.");

        $stmt = mysqli_prepare($conn,
            "UPDATE offers_enquiries SET status = ? WHERE id = ?"
        );
        mysqli_stmt_bind_param($stmt, "si", $new_status, $id);
        mysqli_stmt_execute($stmt);
        $affected = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);

        if ($affected === 0) sendResponse(404, "error", "Enquiry not found or status unchanged.");
        sendResponse(200, "success", "Status updated to '{$new_status}'.", ["id" => $id, "status" => $new_status]);
        break;

    // ── DELETE ─────────────────────────────────────────────────
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id <= 0) sendResponse(400, "error", "Enquiry ID is required.");

        $stmt = mysqli_prepare($conn, "DELETE FROM offers_enquiries WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $affected = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);

        if ($affected === 0) sendResponse(404, "error", "Enquiry not found.");
        sendResponse(200, "success", "Enquiry #{$id} deleted.");
        break;

    default:
        sendResponse(405, "error", "Method not allowed.");
}

mysqli_close($conn);
