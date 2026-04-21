<?php
// Shared DB connection + CORS headers for PHP APIs.

$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://www.manickbag.in',
    'https://manickbag.in',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = getenv('MANICKBAG_DB_HOST') ?: 'localhost';
$db   = getenv('MANICKBAG_DB_NAME') ?: 'manickbag_db';
$user = getenv('MANICKBAG_DB_USER') ?: 'root';
$pass = getenv('MANICKBAG_DB_PASSWORD') ?: '';
$port = (int) (getenv('MANICKBAG_DB_PORT') ?: 3306);

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed.',
    ]);
    exit();
}

$conn = @new mysqli($host, $user, $pass, $db, $port);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed.',
    ]);
    exit();
}

$conn->set_charset('utf8mb4');

function respond(int $code, string $status, string $message, array $data = []): void {
    http_response_code($code);
    $body = ['status' => $status, 'message' => $message];
    if (!empty($data)) {
        $body['data'] = $data;
    }
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

function validMobile(string $mobile): bool {
    return (bool) preg_match('/^[6-9]\d{9}$/', $mobile);
}

function validEmail(string $email): bool {
    return $email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}
