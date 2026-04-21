<?php
// ============================================================
//  Tata Service Booking API
//  Place at: public_html/backend/api/service_booking.php
//
//  Handles two booking types via ?type= param:
//    POST ?type=appointment  → service_bookings table
//    POST ?type=package      → package_bookings table
//  GET  ?type=appointment    → list/single appointment bookings
//  GET  ?type=package        → list/single package bookings
//  PUT  ?type=...&id=N       → update status
//  DELETE ?type=...&id=N     → delete record
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

// ── Determine booking type ─────────────────────────────────────
// type can come from query string OR from POST body
$method      = $_SERVER['REQUEST_METHOD'];
$input       = ($method !== 'GET') ? (json_decode(file_get_contents("php://input"), true) ?? []) : [];
$booking_type = clean($_GET['type'] ?? $input['booking_type'] ?? 'appointment');

if (!in_array($booking_type, ['appointment', 'package'])) {
    respond(400, "error", "Invalid type. Use 'appointment' or 'package'.");
}

$table = ($booking_type === 'package') ? 'package_bookings' : 'service_bookings';

// ══════════════════════════════════════════════════════════════
switch ($method) {

    // ── POST ──────────────────────────────────────────────────
    case 'POST':
        if (!$input) respond(400, "error", "Invalid JSON body.");

        if ($booking_type === 'appointment') {
            // ── APPOINTMENT BOOKING ──────────────────────────
            $name          = clean($input['name']           ?? '');
            $phone         = clean($input['phone']          ?? '');
            $email         = clean($input['email']          ?? '');
            $reg_no        = clean($input['regNo']          ?? $input['reg_no'] ?? '');
            $vehicle_model = clean($input['model']          ?? $input['vehicle_model'] ?? '');
            $service_type  = clean($input['service_type']   ?? $input['serviceType'] ?? '');
            $showroom      = clean($input['showroom']       ?? '');
            $pref_date     = clean($input['date']           ?? $input['preferred_date'] ?? '');
            $pref_time     = clean($input['time']           ?? $input['preferred_time'] ?? '');
            $issues        = clean($input['issues']         ?? '');

            // Validation
            if (empty($name))         respond(422, "error", "Name is required.");
            if (empty($phone))        respond(422, "error", "Phone number is required.");
            if (!preg_match('/^[6-9]\d{9}$/', $phone))
                respond(422, "error", "Enter a valid 10-digit Indian mobile number.");
            if (empty($reg_no))       respond(422, "error", "Vehicle registration number is required.");
            if (empty($vehicle_model))respond(422, "error", "Vehicle model is required.");
            if (empty($service_type)) respond(422, "error", "Service type is required.");
            if (empty($showroom))     respond(422, "error", "Showroom selection is required.");
            if (empty($pref_date))    respond(422, "error", "Preferred date is required.");
            if (empty($pref_time))    respond(422, "error", "Preferred time is required.");

            // Validate date is not in the past
            if (strtotime($pref_date) < strtotime(date('Y-m-d')))
                respond(422, "error", "Preferred date cannot be in the past.");

            // Email validation if provided
            if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL))
                respond(422, "error", "Invalid email address.");

            $stmt = mysqli_prepare($conn,
                "INSERT INTO service_bookings
                 (name, phone, email, reg_no, vehicle_model, service_type,
                  showroom, preferred_date, preferred_time, issues, booking_source)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'appointment')"
            );
            mysqli_stmt_bind_param($stmt, "ssssssssss",
                $name, $phone, $email, $reg_no, $vehicle_model,
                $service_type, $showroom, $pref_date, $pref_time, $issues
            );

            if (!mysqli_stmt_execute($stmt)) {
                respond(500, "error", "Failed to save booking: " . mysqli_stmt_error($stmt));
            }
            $new_id = mysqli_insert_id($conn);
            mysqli_stmt_close($stmt);

            respond(201, "success",
                "Service appointment booked! Our advisor will call you within 30 minutes to confirm.",
                ["booking_id" => $new_id, "type" => "appointment"]
            );

        } else {
            // ── PACKAGE BOOKING ──────────────────────────────
            $name           = clean($input['name']          ?? $input['fullName']      ?? '');
            $phone          = clean($input['phone']         ?? '');
            $email          = clean($input['email']         ?? '');
            $address        = clean($input['address']       ?? '');
            $vehicle_model  = clean($input['model']         ?? $input['vehicle_model'] ?? '');
            $variant        = clean($input['variant']       ?? '');
            $mfg_year       = intval($input['mfgYear']      ?? $input['mfg_year']      ?? 0);
            $vehicle_number = clean($input['vehicleNumber'] ?? $input['vehicle_number']?? '');
            $current_kms    = clean($input['kms']           ?? $input['current_kms']   ?? '');
            $package_km     = clean($input['package_km']    ?? '');
            $package_label  = clean($input['package_label'] ?? '');
            $package_price  = clean($input['package_price'] ?? '');

            // Validation
            if (empty($name))           respond(422, "error", "Name is required.");
            if (empty($phone))          respond(422, "error", "Phone number is required.");
            if (!preg_match('/^[6-9]\d{9}$/', $phone))
                respond(422, "error", "Enter a valid 10-digit Indian mobile number.");
            if (empty($vehicle_model))  respond(422, "error", "Vehicle model is required.");
            if (empty($vehicle_number)) respond(422, "error", "Vehicle registration number is required.");
            if (empty($current_kms))    respond(422, "error", "Current KM reading is required.");
            if (empty($package_km))     respond(422, "error", "Package details are required.");

            if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL))
                respond(422, "error", "Invalid email address.");

            // mfg_year: NULL if not provided
            $mfg_year_val = ($mfg_year > 2000 && $mfg_year <= date('Y')) ? $mfg_year : null;

            $stmt = mysqli_prepare($conn,
                "INSERT INTO package_bookings
                 (name, phone, email, address, vehicle_model, variant,
                  mfg_year, vehicle_number, current_kms,
                  package_km, package_label, package_price)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            );
            mysqli_stmt_bind_param($stmt, "ssssssississs",
                $name, $phone, $email, $address,
                $vehicle_model, $variant, $mfg_year_val,
                $vehicle_number, $current_kms,
                $package_km, $package_label, $package_price
            );

            if (!mysqli_stmt_execute($stmt)) {
                respond(500, "error", "Failed to save package booking: " . mysqli_stmt_error($stmt));
            }
            $new_id = mysqli_insert_id($conn);
            mysqli_stmt_close($stmt);

            respond(201, "success",
                "Package booking received! Our service advisor will call you within 30 minutes to confirm.",
                ["booking_id" => $new_id, "type" => "package"]
            );
        }
        break;

    // ── GET ───────────────────────────────────────────────────
    case 'GET':
        $id = intval($_GET['id'] ?? 0);

        if ($id > 0) {
            $stmt = mysqli_prepare($conn, "SELECT * FROM {$table} WHERE id = ?");
            mysqli_stmt_bind_param($stmt, "i", $id);
            mysqli_stmt_execute($stmt);
            $row = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
            mysqli_stmt_close($stmt);
            if (!$row) respond(404, "error", "Booking not found.");
            respond(200, "success", "Booking found.", $row);

        } else {
            $page   = max(1, intval($_GET['page']  ?? 1));
            $limit  = min(50, intval($_GET['limit'] ?? 20));
            $offset = ($page - 1) * $limit;

            $wheres = []; $params = []; $types = "";

            $status = clean($_GET['status'] ?? '');
            if ($booking_type === 'appointment') {
                $valid_statuses = ['new','confirmed','in_progress','completed','cancelled'];
            } else {
                $valid_statuses = ['new','confirmed','completed','cancelled'];
            }
            if (in_array($status, $valid_statuses)) {
                $wheres[] = "status = ?"; $params[] = $status; $types .= "s";
            }

            // Filter by date for appointments
            if ($booking_type === 'appointment') {
                $date = clean($_GET['date'] ?? '');
                if ($date) { $wheres[] = "preferred_date = ?"; $params[] = $date; $types .= "s"; }
            }

            $wc = count($wheres) ? " WHERE " . implode(" AND ", $wheres) : "";

            $cStmt = mysqli_prepare($conn, "SELECT COUNT(*) as total FROM {$table}" . $wc);
            if ($types) mysqli_stmt_bind_param($cStmt, $types, ...$params);
            mysqli_stmt_execute($cStmt);
            $total = mysqli_fetch_assoc(mysqli_stmt_get_result($cStmt))['total'];
            mysqli_stmt_close($cStmt);

            $lStmt = mysqli_prepare($conn,
                "SELECT * FROM {$table}" . $wc . " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            );
            $lP = array_merge($params, [$limit, $offset]);
            $lT = $types . "ii";
            mysqli_stmt_bind_param($lStmt, $lT, ...$lP);
            mysqli_stmt_execute($lStmt);
            $result = mysqli_stmt_get_result($lStmt);
            $rows   = [];
            while ($r = mysqli_fetch_assoc($result)) $rows[] = $r;
            mysqli_stmt_close($lStmt);

            respond(200, "success", "Bookings fetched.", [
                "bookings"    => $rows,
                "total"       => intval($total),
                "page"        => $page,
                "limit"       => $limit,
                "total_pages" => ceil($total / $limit),
                "type"        => $booking_type,
            ]);
        }
        break;

    // ── PUT: Update status ────────────────────────────────────
    case 'PUT':
        $id    = intval($_GET['id'] ?? 0);
        if ($id <= 0) respond(400, "error", "Booking ID required.");

        $new_status = clean($input['status'] ?? '');
        if ($booking_type === 'appointment') {
            $valid = ['new','confirmed','in_progress','completed','cancelled'];
        } else {
            $valid = ['new','confirmed','completed','cancelled'];
        }
        if (!in_array($new_status, $valid))
            respond(422, "error", "Invalid status value.");

        $stmt = mysqli_prepare($conn, "UPDATE {$table} SET status = ? WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "si", $new_status, $id);
        mysqli_stmt_execute($stmt);
        $aff = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);

        if ($aff === 0) respond(404, "error", "Booking not found or status unchanged.");
        respond(200, "success", "Status updated to '{$new_status}'.", ["id" => $id, "status" => $new_status]);
        break;

    // ── DELETE ────────────────────────────────────────────────
    case 'DELETE':
        $id = intval($_GET['id'] ?? 0);
        if ($id <= 0) respond(400, "error", "Booking ID required.");

        $stmt = mysqli_prepare($conn, "DELETE FROM {$table} WHERE id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $aff = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);

        if ($aff === 0) respond(404, "error", "Booking not found.");
        respond(200, "success", "Booking #{$id} deleted.");
        break;

    default:
        respond(405, "error", "Method not allowed.");
}

mysqli_close($conn);
