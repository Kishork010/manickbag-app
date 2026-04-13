<?php
// ============================================================
//  public_html/backend/api/fastag.php
//
//  GET    /api/fastag.php          → list all enquiries (admin)
//  GET    /api/fastag.php?id=1     → single enquiry
//  POST   /api/fastag.php          → submit new enquiry  ← used by React form
//  PUT    /api/fastag.php?id=1     → update status (admin)
//  DELETE /api/fastag.php?id=1     → delete (admin)
// ============================================================

require_once __DIR__ . '/../config/db.php';   // shared PDO + helpers

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

switch ($method) {

    // ── GET ─────────────────────────────────────────────────
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM fastag_enquiries WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) {
                respond(404, 'error', 'Enquiry not found.');
            }
            respond(200, 'success', 'Enquiry fetched.', $row);
        }

        // List with optional status filter
        $where  = [];
        $params = [];
        if (!empty($_GET['status'])) {
            $where[]  = "status = ?";
            $params[] = clean($_GET['status']);
        }

        $sql = "SELECT * FROM fastag_enquiries";
        if ($where) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }
        $sql .= " ORDER BY created_at DESC LIMIT 500";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        respond(200, 'success', count($rows) . ' record(s) found.', $rows);
        break;

    // ── POST ────────────────────────────────────────────────
    case 'POST':

        // ── Required fields ──
        $full_name = clean($body['name']   ?? $body['full_name'] ?? '');
        $mobile    = clean($body['phone']  ?? $body['mobile']    ?? '');
        $reg_no    = clean($body['regNo']  ?? $body['reg_no']    ?? '');
        $vehicle   = clean($body['vehicle'] ?? '');

        // ── Validate ──
        if (!$full_name) {
            respond(422, 'error', 'Full name is required.');
        }
        if (!$mobile || !validMobile($mobile)) {
            respond(422, 'error', 'A valid 10-digit Indian mobile number is required.');
        }
        if (!$reg_no) {
            respond(422, 'error', 'Vehicle registration number is required.');
        }
        // Basic reg no format: letters, digits, hyphens — min 5 chars
        if (!preg_match('/^[A-Z0-9\-]{4,15}$/i', str_replace(' ', '', $reg_no))) {
            respond(422, 'error', 'Please enter a valid vehicle registration number.');
        }

        // ── Duplicate: same mobile + reg_no in last 48 hrs ──
        $dup = $pdo->prepare(
            "SELECT id FROM fastag_enquiries
             WHERE (mobile = ? OR reg_no = ?)
               AND created_at > NOW() - INTERVAL 48 HOUR
             LIMIT 1"
        );
        $dup->execute([$mobile, strtoupper(str_replace(' ', '', $reg_no))]);
        if ($dup->fetch()) {
            respond(409, 'error', 'A FASTag enquiry for this vehicle/number was already submitted recently. Our team will contact you shortly.');
        }

        // ── Insert ──
        $stmt = $pdo->prepare(
            "INSERT INTO fastag_enquiries (full_name, mobile, reg_no, vehicle)
             VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([
            $full_name,
            $mobile,
            strtoupper(str_replace(' ', '', $reg_no)),
            $vehicle ?: null,
        ]);

        $newId = $pdo->lastInsertId();
        respond(201, 'success',
            'Your FASTag enquiry has been submitted! Our team will contact you within 2 hours to schedule your appointment.',
            ['id' => $newId]
        );
        break;

    // ── PUT (admin: update status) ───────────────────────────
    case 'PUT':
        if (!$id) {
            respond(400, 'error', 'ID is required for update.');
        }
        $allowed = ['new', 'contacted', 'completed', 'cancelled'];
        $status  = clean($body['status'] ?? '');
        if (!in_array($status, $allowed)) {
            respond(422, 'error', 'Invalid status. Allowed: ' . implode(', ', $allowed));
        }

        $stmt = $pdo->prepare("UPDATE fastag_enquiries SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        if ($stmt->rowCount() === 0) {
            respond(404, 'error', 'Enquiry not found.');
        }
        respond(200, 'success', 'Status updated to "' . $status . '".');
        break;

    // ── DELETE ──────────────────────────────────────────────
    case 'DELETE':
        if (!$id) {
            respond(400, 'error', 'ID is required.');
        }
        $stmt = $pdo->prepare("DELETE FROM fastag_enquiries WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            respond(404, 'error', 'Enquiry not found.');
        }
        respond(200, 'success', 'Enquiry deleted.');
        break;

    default:
        respond(405, 'error', 'Method not allowed.');
}