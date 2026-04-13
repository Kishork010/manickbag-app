<?php
// ============================================================
//  public_html/backend/api/test-drive.php
//
//  GET    /api/test-drive.php          → list all bookings
//  GET    /api/test-drive.php?id=1     → single booking
//  POST   /api/test-drive.php          → create booking
//  PUT    /api/test-drive.php?id=1     → update status
//  DELETE /api/test-drive.php?id=1     → delete
// ============================================================

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;

$body = [];
if (in_array($method, ['POST', 'PUT'])) {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw, true) ?? [];
    if (empty($body) && !empty($_POST)) {
        $body = $_POST;
    }
}

// Valid showroom cities from frontend showroomMenuItems
$valid_cities = ['Belgaum', 'Hubli', 'Dharwad', 'Karwar', 'Bijapur', 'Gulbarga'];

// Valid vehicles from frontend vehicles array
$valid_vehicles = [
    'Tiago','Tiago EV','Altroz','Tigor','Tigor EV',
    'Punch','Punch EV','Nexon','Nexon EV',
    'Harrier','Harrier EV','Safari','Curvv','Curvv EV',
    'Sierra','Xpress T','Xpress T EV',
];

$valid_fuel = ['Petrol', 'Diesel', 'iCNG', 'Electric'];

$preferred_times = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

switch ($method) {

    // ── GET ─────────────────────────────────────────────────
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM test_drive_bookings WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) {
                respond(404, 'error', 'Booking not found.');
            }
            respond(200, 'success', 'Booking fetched.', $row);
        }

        $where  = [];
        $params = [];

        if (!empty($_GET['status'])) {
            $where[]  = "status = ?";
            $params[] = clean($_GET['status']);
        }
        if (!empty($_GET['city'])) {
            $where[]  = "showroom_city = ?";
            $params[] = clean($_GET['city']);
        }
        if (!empty($_GET['date'])) {
            $where[]  = "preferred_date = ?";
            $params[] = clean($_GET['date']);
        }
        if (!empty($_GET['vehicle'])) {
            $where[]  = "vehicle_name LIKE ?";
            $params[] = '%' . clean($_GET['vehicle']) . '%';
        }

        $sql = "SELECT * FROM test_drive_bookings";
        if ($where) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }
        $sql .= " ORDER BY preferred_date ASC, created_at DESC LIMIT 500";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        respond(200, 'success', count($rows) . ' booking(s) found.', $rows);
        break;

    // ── POST ────────────────────────────────────────────────
    case 'POST':
        // ── Required fields ──
        $full_name      = clean($body['full_name']      ?? '');
        $mobile         = clean($body['mobile']         ?? '');
        $vehicle_name   = clean($body['vehicle_name']   ?? '');
        $preferred_date = clean($body['preferred_date'] ?? '');
        $showroom_city  = clean($body['showroom_city']  ?? '');

        // ── Optional fields ──
        $email           = clean($body['email']           ?? '');
        $fuel_type       = clean($body['fuel_type']       ?? '');
        $preferred_time  = clean($body['preferred_time']  ?? '');
        $showroom_branch = clean($body['showroom_branch'] ?? '');
        $message         = clean($body['message']         ?? '');

        // ── Validate required ──
        if (!$full_name) {
            respond(422, 'error', 'Full name is required.');
        }
        if (!$mobile || !validMobile($mobile)) {
            respond(422, 'error', 'A valid 10-digit Indian mobile number is required.');
        }
        if (!$vehicle_name) {
            respond(422, 'error', 'Please select a vehicle.');
        }
        if (!$preferred_date) {
            respond(422, 'error', 'Preferred date is required.');
        }
        if (!$showroom_city) {
            respond(422, 'error', 'Please select a showroom city.');
        }

        // ── Validate optional ──
        if (!validEmail($email)) {
            respond(422, 'error', 'Invalid email address.');
        }

        // ── Date validation ──
        $dateObj = DateTime::createFromFormat('Y-m-d', $preferred_date);
        if (!$dateObj) {
            respond(422, 'error', 'Invalid date format. Use YYYY-MM-DD.');
        }
        $today    = new DateTime('today');
        $maxDate  = (new DateTime('today'))->modify('+60 days');
        if ($dateObj < $today) {
            respond(422, 'error', 'Preferred date cannot be in the past.');
        }
        if ($dateObj > $maxDate) {
            respond(422, 'error', 'Preferred date cannot be more than 60 days in the future.');
        }
        // Block Sundays
        if ($dateObj->format('N') == 7) {
            respond(422, 'error', 'Test drives are not available on Sundays. Please choose another date.');
        }

        // ── Validate vehicle name (whitelist) ──
        if (!in_array($vehicle_name, $valid_vehicles)) {
            respond(422, 'error', 'Invalid vehicle selection.');
        }

        // ── Validate city ──
        if (!in_array($showroom_city, $valid_cities)) {
            respond(422, 'error', 'Invalid showroom city.');
        }

        // ── Validate fuel type ──
        if ($fuel_type && !in_array($fuel_type, $valid_fuel)) {
            respond(422, 'error', 'Invalid fuel type.');
        }

        // ── Validate time slot ──
        if ($preferred_time && !in_array($preferred_time, $preferred_times)) {
            respond(422, 'error', 'Invalid time slot selected.');
        }

        // ── Duplicate check: same mobile + date + vehicle ──
        $dup = $pdo->prepare(
            "SELECT id FROM test_drive_bookings
             WHERE mobile = ? AND preferred_date = ? AND vehicle_name = ?
               AND status NOT IN ('cancelled')
             LIMIT 1"
        );
        $dup->execute([$mobile, $preferred_date, $vehicle_name]);
        if ($dup->fetch()) {
            respond(409, 'error', 'A test drive for this vehicle on the same date is already booked from this number.');
        }

        // ── Insert ──
        $stmt = $pdo->prepare(
            "INSERT INTO test_drive_bookings
               (full_name, mobile, email, vehicle_name, fuel_type,
                preferred_date, preferred_time, showroom_city, showroom_branch, message)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $full_name,
            $mobile,
            $email           ?: null,
            $vehicle_name,
            $fuel_type       ?: null,
            $preferred_date,
            $preferred_time  ?: null,
            $showroom_city,
            $showroom_branch ?: null,
            $message         ?: null,
        ]);

        $newId = $pdo->lastInsertId();
        respond(201, 'success',
            "Test drive booked successfully! Your booking ID is #$newId. " .
            "We will confirm your appointment via SMS/call within 2 hours.",
            ['id' => $newId, 'booking_ref' => 'MB-TD-' . str_pad($newId, 5, '0', STR_PAD_LEFT)]
        );
        break;

    // ── PUT (admin: update status) ───────────────────────────
    case 'PUT':
        if (!$id) {
            respond(400, 'error', 'ID is required for update.');
        }

        $allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
        $status  = clean($body['status'] ?? '');

        if (!in_array($status, $allowed)) {
            respond(422, 'error', 'Invalid status. Allowed: ' . implode(', ', $allowed));
        }

        $stmt = $pdo->prepare("UPDATE test_drive_bookings SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        if ($stmt->rowCount() === 0) {
            respond(404, 'error', 'Booking not found.');
        }
        respond(200, 'success', 'Booking status updated to "' . $status . '".');
        break;

    // ── DELETE ──────────────────────────────────────────────
    case 'DELETE':
        if (!$id) {
            respond(400, 'error', 'ID is required.');
        }
        $stmt = $pdo->prepare("DELETE FROM test_drive_bookings WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            respond(404, 'error', 'Booking not found.');
        }
        respond(200, 'success', 'Booking deleted.');
        break;

    default:
        respond(405, 'error', 'Method not allowed.');
}