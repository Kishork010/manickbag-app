<?php
// ============================================================
//  public_html/backend/config/db.php
//  Shared DB connection + CORS headers
// ============================================================

// ── CORS ────────────────────────────────────────────────────
// Change the origin to your actual frontend domain in production
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://www.manickbag.in',
    'https://manickbag.in',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://www.manickbag.in");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── DB CONFIG ───────────────────────────────────────────────
$host = 'localhost';
$db   = 'YOUR_DB_NAME';      // ← replace
$user = 'YOUR_DB_USER';      // ← replace
$pass = 'YOUR_DB_PASSWORD';  // ← replace
$port = 3306;

// ── PDO CONNECTION ──────────────────────────────────────────
try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Database connection failed.',
        // Uncomment below for local debug only — remove in production!
        // 'debug'  => $e->getMessage(),
    ]);
    exit();
}

// ── HELPER FUNCTIONS ────────────────────────────────────────

/**
 * Send a JSON response and exit.
 */
function respond(int $code, string $status, string $message, array $data = []): void {
    http_response_code($code);
    $body = ['status' => $status, 'message' => $message];
    if (!empty($data)) {
        $body['data'] = $data;
    }
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

/**
 * Sanitize a plain string field.
 */
function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate Indian mobile number (10 digits, starts with 6-9).
 */
function validMobile(string $mobile): bool {
    return (bool) preg_match('/^[6-9]\d{9}$/', $mobile);
}

/**
 * Validate email (optional field — allow empty).
 */
function validEmail(string $email): bool {
    return $email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}