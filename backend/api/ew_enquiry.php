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

    $name  = trim($data['name']  ?? '');
    $phone = trim($data['phone'] ?? '');

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

    $email           = trim($data['email']           ?? '');
    $city            = trim($data['city']            ?? '');
    $vehicle_model   = trim($data['vehicle_model']   ?? '');
    $registration_no = trim($data['registration_no'] ?? '');
    $message         = trim($data['message']         ?? '');
    $plan_name       = trim($data['plan_name']       ?? '');

    $allowed = ['general', 'plan_quote'];
    $enquiry_type = trim($data['enquiry_type'] ?? 'general');
    if (!in_array($enquiry_type, $allowed)) $enquiry_type = 'general';

    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Invalid email address']);
        exit;
    }

    $sql  = "INSERT INTO ew_enquiries
                (name, phone, email, city, vehicle_model, registration_no, message, plan_name, enquiry_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssss', $name, $phone, $email, $city, $vehicle_model, $registration_no, $message, $plan_name, $enquiry_type);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Thank you! Our team will contact you shortly.', 'id' => $conn->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to save. Please try again.']);
    }
    $stmt->close();

} elseif ($method === 'GET') {
    $where = []; $params = []; $types = '';

    if (!empty($_GET['enquiry_type'])) { $where[] = 'enquiry_type = ?'; $params[] = $_GET['enquiry_type']; $types .= 's'; }
    if (!empty($_GET['status']))       { $where[] = 'status = ?';       $params[] = $_GET['status'];       $types .= 's'; }

    $sql = 'SELECT * FROM ew_enquiries';
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