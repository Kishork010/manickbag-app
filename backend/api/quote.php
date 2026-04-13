<?php
// ============================================================
//  public_html/backend/api/quote.php
//
//  GET    /api/quote.php          → list all quotes (admin)
//  GET    /api/quote.php?id=1     → single quote
//  POST   /api/quote.php          → submit new quote request
//  PUT    /api/quote.php?id=1     → update status (admin)
//  DELETE /api/quote.php?id=1     → delete quote (admin)
// ============================================================

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;

// ── Read body for POST / PUT ────────────────────────────────
$body = [];
if (in_array($method, ['POST', 'PUT'])) {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw, true) ?? [];
    // Fallback to $_POST for multipart / form-data
    if (empty($body) && !empty($_POST)) {
        $body = $_POST;
    }
}

// ────────────────────────────────────────────────────────────
switch ($method) {

    // ── GET ─────────────────────────────────────────────────
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM quote_requests WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) {
                respond(404, 'error', 'Quote request not found.');
            }
            respond(200, 'success', 'Quote request fetched.', $row);
        }

        // List with optional filters
        $where  = [];
        $params = [];

        if (!empty($_GET['status'])) {
            $where[]  = "status = ?";
            $params[] = clean($_GET['status']);
        }
        if (!empty($_GET['vehicle'])) {
            $where[]  = "vehicle_name LIKE ?";
            $params[] = '%' . clean($_GET['vehicle']) . '%';
        }

        $sql = "SELECT * FROM quote_requests";
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
        // ── Validate required fields ──
        $vehicle_name = clean($body['vehicle_name'] ?? '');
        $full_name    = clean($body['full_name']    ?? '');
        $mobile       = clean($body['mobile']       ?? '');

        if (!$vehicle_name) {
            respond(422, 'error', 'Vehicle name is required.');
        }
        if (!$full_name) {
            respond(422, 'error', 'Full name is required.');
        }
        if (!$mobile || !validMobile($mobile)) {
            respond(422, 'error', 'A valid 10-digit Indian mobile number is required.');
        }

        // ── Optional fields ──
        $email     = clean($body['email']     ?? '');
        $city      = clean($body['city']      ?? '');
        $fuel_type = clean($body['fuel_type'] ?? '');
        $message   = clean($body['message']   ?? '');

        if (!validEmail($email)) {
            respond(422, 'error', 'Invalid email address.');
        }

        // ── Duplicate check (same mobile + vehicle in last 24 hrs) ──
        $dup = $pdo->prepare(
            "SELECT id FROM quote_requests
             WHERE mobile = ? AND vehicle_name = ?
               AND created_at > NOW() - INTERVAL 24 HOUR
             LIMIT 1"
        );
        $dup->execute([$mobile, $vehicle_name]);
        if ($dup->fetch()) {
            respond(409, 'error', 'A quote request for this vehicle was already submitted from this number. Our team will contact you shortly.');
        }

        // ── Insert ──
        $stmt = $pdo->prepare(
            "INSERT INTO quote_requests
               (vehicle_name, full_name, mobile, email, city, fuel_type, message)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $vehicle_name,
            $full_name,
            $mobile,
            $email     ?: null,
            $city      ?: null,
            $fuel_type ?: null,
            $message   ?: null,
        ]);

        $newId = $pdo->lastInsertId();
        respond(201, 'success', 'Quote request submitted successfully! Our team will contact you within 24 hours.', ['id' => $newId]);
        break;

    // ── PUT (update status — admin use) ─────────────────────
    case 'PUT':
        if (!$id) {
            respond(400, 'error', 'ID is required for update.');
        }

        $allowed_statuses = ['new', 'contacted', 'converted', 'closed'];
        $status = clean($body['status'] ?? '');

        if (!in_array($status, $allowed_statuses)) {
            respond(422, 'error', 'Invalid status. Allowed: ' . implode(', ', $allowed_statuses));
        }

        $stmt = $pdo->prepare("UPDATE quote_requests SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        if ($stmt->rowCount() === 0) {
            respond(404, 'error', 'Quote request not found.');
        }
        respond(200, 'success', 'Status updated successfully.');
        break;

    // ── DELETE ──────────────────────────────────────────────
    case 'DELETE':
        if (!$id) {
            respond(400, 'error', 'ID is required for delete.');
        }
        $stmt = $pdo->prepare("DELETE FROM quote_requests WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            respond(404, 'error', 'Quote request not found.');
        }
        respond(200, 'success', 'Quote request deleted.');
        break;

    default:
        respond(405, 'error', 'Method not allowed.');
}