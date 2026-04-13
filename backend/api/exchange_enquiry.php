<?php
require_once '../config/db.php';

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);

    $name      = trim($data['name']      ?? '');
    $phone     = trim($data['phone']     ?? '');
    $old_brand = trim($data['old_brand'] ?? '');
    $old_model = trim($data['old_model'] ?? '');

    // Required field validation
    if (empty($name)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Name is required']);
        exit;
    }
    if (!preg_match('/^\d{10}$/', $phone)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Enter a valid 10-digit phone number']);
        exit;
    }
    if (empty($old_brand)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Vehicle brand is required']);
        exit;
    }
    if (empty($old_model)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Vehicle model is required']);
        exit;
    }

    $old_year  = trim($data['old_year']  ?? '');
    $old_km    = trim($data['old_km']    ?? '');
    $new_model = trim($data['new_model'] ?? '');
    $city      = trim($data['city']      ?? '');

    $sql  = "INSERT INTO exchange_enquiries
                (name, phone, old_brand, old_model, old_year, old_km, new_model, city)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssss', $name, $phone, $old_brand, $old_model, $old_year, $old_km, $new_model, $city);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Quote request received! Our exchange specialist will call you within 2 hours.',
            'id'      => $conn->insert_id,
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save. Please try again.']);
    }
    $stmt->close();

} elseif ($method === 'GET') {
    $where = []; $params = []; $types = '';

    if (!empty($_GET['status']))    { $where[] = 'status = ?';    $params[] = $_GET['status'];    $types .= 's'; }
    if (!empty($_GET['new_model'])) { $where[] = 'new_model = ?'; $params[] = $_GET['new_model']; $types .= 's'; }
    if (!empty($_GET['city']))      { $where[] = 'city = ?';      $params[] = $_GET['city'];      $types .= 's'; }

    $sql = 'SELECT * FROM exchange_enquiries';
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