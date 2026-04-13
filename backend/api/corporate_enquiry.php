<?php
// backend/api/corporate_enquiry.php

require_once '../config/db.php';

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// ─── POST — Submit Enquiry ────────────────────────────────────────
if ($method === 'POST') {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);

    // Required field validation
    $company    = trim($data['company']    ?? '');
    $name       = trim($data['name']       ?? '');
    $phone      = trim($data['phone']      ?? '');
    $fleet_size = trim($data['fleetSize']  ?? '');

    if (empty($company)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Company name is required']);
        exit;
    }
    if (empty($name)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Contact person name is required']);
        exit;
    }
    if (!preg_match('/^\+?[\d\s\-]{10,15}$/', $phone)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Enter a valid phone number']);
        exit;
    }

    $allowed_fleet = ['1-4', '5-9', '10-24', '25+'];
    if (!in_array($fleet_size, $allowed_fleet)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Please select a valid fleet size']);
        exit;
    }

    // Optional fields
    $email  = trim($data['email'] ?? '');
    $gst    = trim($data['gst']   ?? '');
    $city   = trim($data['city']  ?? '');

    // selected_models comes as array from React → store as comma-separated string
    $models_raw      = $data['selectedModels'] ?? [];
    $selected_models = is_array($models_raw) ? implode(', ', $models_raw) : trim($models_raw);

    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Invalid email address']);
        exit;
    }

    $sql  = "INSERT INTO corporate_enquiries
                (company, name, phone, email, gst, fleet_size, city, selected_models)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'ssssssss',
        $company, $name, $phone, $email,
        $gst, $fleet_size, $city, $selected_models
    );

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Enquiry submitted! Our corporate desk will contact you within 4 business hours.',
            'id'      => $conn->insert_id,
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save enquiry. Please try again.']);
    }
    $stmt->close();

// ─── GET — Fetch Enquiries (admin) ────────────────────────────────
} elseif ($method === 'GET') {
    $where = []; $params = []; $types = '';

    if (!empty($_GET['fleet_size'])) { $where[] = 'fleet_size = ?'; $params[] = $_GET['fleet_size']; $types .= 's'; }
    if (!empty($_GET['status']))     { $where[] = 'status = ?';     $params[] = $_GET['status'];     $types .= 's'; }
    if (!empty($_GET['city']))       { $where[] = 'city = ?';       $params[] = $_GET['city'];       $types .= 's'; }

    $sql = 'SELECT * FROM corporate_enquiries';
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY created_at DESC';

    $stmt = $conn->prepare($sql);
    if ($params) $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    echo json_encode(['success' => true, 'data' => $rows, 'count' => count($rows)]);
    $stmt->close();

} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}

$conn->close();
?>