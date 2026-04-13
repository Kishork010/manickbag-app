<?php
// ============================================================
//  public_html/backend/api/contact.php
//
//  GET    /api/contact.php        → list all inquiries (admin)
//  GET    /api/contact.php?id=1   → single inquiry
//  POST   /api/contact.php        → submit contact inquiry
//  PUT    /api/contact.php?id=1   → update status (admin)
//  DELETE /api/contact.php?id=1   → delete (admin)
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

switch ($method) {

    // ── GET ─────────────────────────────────────────────────
    case 'GET':
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM contact_inquiries WHERE id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) {
                respond(404, 'error', 'Inquiry not found.');
            }
            respond(200, 'success', 'Inquiry fetched.', $row);
        }

        $where  = [];
        $params = [];
        if (!empty($_GET['status'])) {
            $where[]  = "status = ?";
            $params[] = clean($_GET['status']);
        }

        $sql = "SELECT * FROM contact_inquiries";
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
        $full_name   = clean($body['full_name']   ?? '');
        $mobile      = clean($body['mobile']      ?? '');
        $email       = clean($body['email']       ?? '');
        $subject     = clean($body['subject']     ?? '');
        $message     = clean($body['message']     ?? '');
        $source_page = clean($body['source_page'] ?? 'home');

        // ── Validate ──
        if (!$full_name) {
            respond(422, 'error', 'Full name is required.');
        }
        if (!$mobile || !validMobile($mobile)) {
            respond(422, 'error', 'A valid 10-digit Indian mobile number is required.');
        }
        if (!$message) {
            respond(422, 'error', 'Message is required.');
        }
        if (!validEmail($email)) {
            respond(422, 'error', 'Invalid email address.');
        }
        if (strlen($message) < 10) {
            respond(422, 'error', 'Message must be at least 10 characters.');
        }
        if (strlen($message) > 2000) {
            respond(422, 'error', 'Message cannot exceed 2000 characters.');
        }

        // ── Spam / flood check (same mobile, last 1 hour) ──
        $dup = $pdo->prepare(
            "SELECT id FROM contact_inquiries
             WHERE mobile = ? AND created_at > NOW() - INTERVAL 1 HOUR
             LIMIT 1"
        );
        $dup->execute([$mobile]);
        if ($dup->fetch()) {
            respond(429, 'error', 'You have already sent an inquiry recently. Please wait before submitting again.');
        }

        $stmt = $pdo->prepare(
            "INSERT INTO contact_inquiries
               (full_name, mobile, email, subject, message, source_page)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $full_name,
            $mobile,
            $email   ?: null,
            $subject ?: null,
            $message,
            $source_page ?: 'home',
        ]);

        $newId = $pdo->lastInsertId();
        respond(201, 'success', 'Thank you for reaching out! We will get back to you within 24 hours.', ['id' => $newId]);
        break;

    // ── PUT ─────────────────────────────────────────────────
    case 'PUT':
        if (!$id) {
            respond(400, 'error', 'ID is required for update.');
        }

        $allowed = ['new', 'read', 'replied', 'closed'];
        $status  = clean($body['status'] ?? '');

        if (!in_array($status, $allowed)) {
            respond(422, 'error', 'Invalid status. Allowed: ' . implode(', ', $allowed));
        }

        $stmt = $pdo->prepare("UPDATE contact_inquiries SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);

        if ($stmt->rowCount() === 0) {
            respond(404, 'error', 'Inquiry not found.');
        }
        respond(200, 'success', 'Status updated successfully.');
        break;

    // ── DELETE ──────────────────────────────────────────────
    case 'DELETE':
        if (!$id) {
            respond(400, 'error', 'ID is required.');
        }
        $stmt = $pdo->prepare("DELETE FROM contact_inquiries WHERE id = ?");
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            respond(404, 'error', 'Inquiry not found.');
        }
        respond(200, 'success', 'Inquiry deleted.');
        break;

    default:
        respond(405, 'error', 'Method not allowed.');
}