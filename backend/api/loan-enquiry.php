<?php
// ============================================================
//  public_html/backend/api/loan-enquiry.php
//
//  GET    /api/loan-enquiry.php          → list all (admin)
//  GET    /api/loan-enquiry.php?id=1     → single record
//  POST   /api/loan-enquiry.php          → submit enquiry  ← React form
//  PUT    /api/loan-enquiry.php?id=1     → update status (admin)
//  DELETE /api/loan-enquiry.php?id=1     → delete (admin)
// ============================================================

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;

$body = [];
if (in_array($method, ['POST', 'PUT'])) {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw, true) ?? [];
    if (empty($body) && !empty($_POST)) $body = $_POST;
}

$valid_statuses    = ['new','called','in_process','approved','rejected','closed'];
$valid_emp_types   = [
    'Salaried — Private', 'Salaried — Government',
    'Self-Employed / Business', 'Farmer / Agriculture', 'Other', '',
];
$valid_loan_ranges = [
    'Up to ₹3 Lakh','₹3–5 Lakh','₹5–8 Lakh',
    '₹8–12 Lakh','₹12–18 Lakh','₹18–25 Lakh','Above ₹25 Lakh',
];
$valid_vehicles = [
    'Tiago','Tiago EV','Altroz','Tigor','Tigor EV',
    'Punch','Punch EV','Nexon','Nexon EV',
    'Harrier','Harrier EV','Safari','Curvv','Curvv EV','Sierra',
];

switch ($method) {

    // ── GET ─────────────────────────────────────────────────
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM loan_enquiries WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) respond(404, 'error', 'Enquiry not found.');
            respond(200, 'success', 'Record fetched.', $row);
        }

        $where = []; $params = [];
        if (!empty($_GET['status'])) {
            $where[] = "status = ?"; $params[] = clean($_GET['status']);
        }
        if (!empty($_GET['vehicle'])) {
            $where[] = "vehicle LIKE ?"; $params[] = '%'.clean($_GET['vehicle']).'%';
        }
        $sql = "SELECT * FROM loan_enquiries";
        if ($where) $sql .= " WHERE ".implode(' AND ',$where);
        $sql .= " ORDER BY created_at DESC LIMIT 500";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        respond(200, 'success', $stmt->rowCount().' record(s) found.', $stmt->fetchAll());
        break;

    // ── POST ────────────────────────────────────────────────
    case 'POST':
        // Read fields — match React form keys exactly
        $full_name       = clean($body['name']           ?? $body['full_name']       ?? '');
        $mobile          = clean($body['phone']          ?? $body['mobile']          ?? '');
        $email           = clean($body['email']          ?? '');
        $city            = clean($body['city']           ?? '');
        $vehicle         = clean($body['vehicle']        ?? '');
        $loan_amount     = clean($body['loanAmount']     ?? $body['loan_amount']     ?? '');
        $employment_type = clean($body['employmentType'] ?? $body['employment_type'] ?? '');
        $message         = clean($body['message']        ?? '');

        // ── Required field validation ──
        if (!$full_name)
            respond(422, 'error', 'Full name is required.');

        if (!$mobile || !validMobile($mobile))
            respond(422, 'error', 'A valid 10-digit Indian mobile number is required.');

        if (!$vehicle)
            respond(422, 'error', 'Please select a vehicle model.');

        if (!in_array($vehicle, $valid_vehicles))
            respond(422, 'error', 'Invalid vehicle selection.');

        if (!$loan_amount)
            respond(422, 'error', 'Please select a loan amount range.');

        if (!in_array($loan_amount, $valid_loan_ranges))
            respond(422, 'error', 'Invalid loan amount selection.');

        // ── Optional field validation ──
        if (!validEmail($email))
            respond(422, 'error', 'Invalid email address.');

        if ($employment_type && !in_array($employment_type, $valid_emp_types))
            respond(422, 'error', 'Invalid employment type.');

        if (strlen($message) > 2000)
            respond(422, 'error', 'Message cannot exceed 2000 characters.');

        // ── Duplicate check: same mobile in last 24 hrs ──
        $dup = $pdo->prepare(
            "SELECT id FROM loan_enquiries
             WHERE mobile = ? AND created_at > NOW() - INTERVAL 24 HOUR
             LIMIT 1"
        );
        $dup->execute([$mobile]);
        if ($dup->fetch())
            respond(409, 'error', 'A loan enquiry from this number was already submitted today. Our finance team will contact you shortly.');

        // ── Insert ──
        $stmt = $pdo->prepare(
            "INSERT INTO loan_enquiries
               (full_name, mobile, email, city, vehicle, loan_amount, employment_type, message)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $full_name,
            $mobile,
            $email           ?: null,
            $city            ?: null,
            $vehicle,
            $loan_amount,
            $employment_type ?: null,
            $message         ?: null,
        ]);

        $newId = $pdo->lastInsertId();
        respond(201, 'success',
            'Thank you, '.$full_name.'! Our finance team will call you at '.$mobile.' within 24 hours with a personalised offer.',
            ['id' => $newId]
        );
        break;

    // ── PUT (admin: update status) ───────────────────────────
    case 'PUT':
        if (!$id) respond(400, 'error', 'ID is required for update.');

        $status = clean($body['status'] ?? '');
        if (!in_array($status, $valid_statuses))
            respond(422, 'error', 'Invalid status. Allowed: '.implode(', ', $valid_statuses));

        $stmt = $pdo->prepare("UPDATE loan_enquiries SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        if ($stmt->rowCount() === 0) respond(404, 'error', 'Enquiry not found.');
        respond(200, 'success', 'Status updated to "'.$status.'".');
        break;

    // ── DELETE ──────────────────────────────────────────────
    case 'DELETE':
        if (!$id) respond(400, 'error', 'ID is required.');
        $stmt = $pdo->prepare("DELETE FROM loan_enquiries WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) respond(404, 'error', 'Enquiry not found.');
        respond(200, 'success', 'Enquiry deleted.');
        break;

    default:
        respond(405, 'error', 'Method not allowed.');
}

