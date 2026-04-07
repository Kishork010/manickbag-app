<?php
// ============================================================
//  MANICKBAG AUTOMOBILES — PHP Backend API
//  File    : server/api.php
//  Server  : Apache / Nginx with PHP 7.4+
//  Usage   : Point all form POSTs to this file with ?action=
//            e.g.  POST /api.php?action=finance
// ============================================================

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");   // change to your domain
header("Access-Control-Allow-Methods: POST, GET, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Token");

// Handle CORS preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// ─────────────────────────────────────────────
//  CONFIG  —  edit these values
// ─────────────────────────────────────────────
define("DB_HOST",     "localhost");
define("DB_USER",     "root");
define("DB_PASS",     "");                  // your MySQL password
define("DB_NAME",     "manickbag_db");
define("DB_PORT",     3306);
define("ADMIN_TOKEN", "CHANGE_THIS_SECRET_TOKEN_123");

// ─────────────────────────────────────────────
//  DB CONNECTION
// ─────────────────────────────────────────────
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    sendError(500, "Database connection failed: " . $conn->connect_error);
    exit;
}

// ─────────────────────────────────────────────
//  ROUTING
// ─────────────────────────────────────────────
$action = $_GET["action"] ?? "";
$method = $_SERVER["REQUEST_METHOD"];

// Parse JSON body
$input = [];
$raw   = file_get_contents("php://input");
if ($raw) {
    $input = json_decode($raw, true) ?? [];
}

switch ($action) {
    case "health":       handleHealth();               break;
    case "finance":      handleFinanceEnquiry($input); break;
    case "ew":           handleEWEnquiry($input);      break;
    case "amc":          handleAMCEnquiry($input);     break;
    case "rsa":          handleRSAEnquiry($input);     break;
    case "vas":          handleVASEnquiry($input);     break;
    case "testdrive":    handleTestDrive($input);      break;
    case "admin_list":   handleAdminList();            break;
    case "admin_update": handleAdminUpdate($input);    break;
    case "admin_summary":handleAdminSummary();         break;
    default:             sendError(404, "Unknown action: $action");
}

$conn->close();


// ════════════════════════════════════════════════
//  HANDLERS
// ════════════════════════════════════════════════

function handleHealth() {
    global $conn;
    $conn->query("SELECT 1");
    sendSuccess("Server is running", ["db" => "connected", "time" => date("c")], 200);
}


// ────────────────────────────────────────────────
//  1. FINANCE ENQUIRY
//  POST /api.php?action=finance
// ────────────────────────────────────────────────
function handleFinanceEnquiry($d) {
    global $conn;

    $name            = sanitize($d["name"]            ?? "");
    $phone           = sanitize($d["phone"]           ?? "");
    $email           = sanitize($d["email"]           ?? "");
    $city            = sanitize($d["city"]            ?? "");
    $vehicle_model   = sanitize($d["vehicle_model"]   ?? "");
    $loan_amount     = sanitize($d["loan_amount"]     ?? "");
    $employment_type = sanitize($d["employment_type"] ?? "");
    $message         = sanitize($d["message"]         ?? "");
    $ip              = getClientIP();

    if (!$name)              sendError(400, "Name is required");
    if (!isValidPhone($phone)) sendError(400, "Invalid phone — must be 10 digits");
    if (!$vehicle_model)     sendError(400, "Vehicle model is required");
    if (!$loan_amount)       sendError(400, "Loan amount is required");

    $stmt = $conn->prepare("
        INSERT INTO finance_enquiries
          (name, phone, email, city, vehicle_model, loan_amount, employment_type, message, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssssssss",
        $name, $phone, $email, $city,
        $vehicle_model, $loan_amount,
        $employment_type, $message, $ip
    );

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        logEnquiry("Finance", $id, $name, $phone);
        sendSuccess("Finance enquiry submitted! Our team will contact you within 24 hours.", ["id" => $id]);
    } else {
        sendError(500, "DB error: " . $stmt->error);
    }
    $stmt->close();
}


// ────────────────────────────────────────────────
//  2. EXTENDED WARRANTY ENQUIRY
//  POST /api.php?action=ew
// ────────────────────────────────────────────────
function handleEWEnquiry($d) {
    global $conn;

    $name             = sanitize($d["name"]             ?? "");
    $phone            = sanitize($d["phone"]            ?? "");
    $email            = sanitize($d["email"]            ?? "");
    $city             = sanitize($d["city"]             ?? "");
    $vehicle_model    = sanitize($d["vehicle_model"]    ?? "");
    $registration_no  = sanitize($d["registration_no"]  ?? "");
    $purchase_year    = intval($d["purchase_year"]      ?? 0) ?: null;
    $plan_selected    = sanitize($d["plan_selected"]    ?? "not_sure");
    $warranty_expiry  = sanitize($d["current_warranty_expiry"] ?? "");
    $message          = sanitize($d["message"]          ?? "");
    $ip               = getClientIP();

    if (!$name)              sendError(400, "Name is required");
    if (!isValidPhone($phone)) sendError(400, "Invalid phone number");

    $valid_plans = ["1_year", "2_year", "not_sure"];
    if (!in_array($plan_selected, $valid_plans)) $plan_selected = "not_sure";

    $stmt = $conn->prepare("
        INSERT INTO ew_enquiries
          (name, phone, email, city, vehicle_model, registration_no,
           purchase_year, plan_selected, current_warranty_expiry, message, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssssssisss",
        $name, $phone, $email, $city,
        $vehicle_model, $registration_no,
        $purchase_year, $plan_selected,
        $warranty_expiry ?: null, $message, $ip
    );

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        logEnquiry("EW", $id, $name, $phone);
        sendSuccess("Extended Warranty enquiry received! We'll get back to you shortly.", ["id" => $id]);
    } else {
        sendError(500, "DB error: " . $stmt->error);
    }
    $stmt->close();
}


// ────────────────────────────────────────────────
//  3. AMC ENQUIRY
//  POST /api.php?action=amc
// ────────────────────────────────────────────────
function handleAMCEnquiry($d) {
    global $conn;

    $name            = sanitize($d["name"]           ?? "");
    $phone           = sanitize($d["phone"]          ?? "");
    $email           = sanitize($d["email"]          ?? "");
    $city            = sanitize($d["city"]           ?? "");
    $vehicle_model   = sanitize($d["vehicle_model"]  ?? "");
    $registration_no = sanitize($d["registration_no"]?? "");
    $current_kms     = intval($d["current_kms"]      ?? 0) ?: null;
    $plan_type       = sanitize($d["plan_type"]      ?? "not_sure");
    $duration_years  = intval($d["duration_years"]   ?? 0) ?: null;
    $message         = sanitize($d["message"]        ?? "");
    $ip              = getClientIP();

    if (!$name)              sendError(400, "Name is required");
    if (!isValidPhone($phone)) sendError(400, "Invalid phone number");

    $valid_plans = ["gold", "silver", "protect_plus", "p2p", "not_sure"];
    if (!in_array($plan_type, $valid_plans)) $plan_type = "not_sure";

    $stmt = $conn->prepare("
        INSERT INTO amc_enquiries
          (name, phone, email, city, vehicle_model, registration_no,
           current_kms, plan_type, duration_years, message, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssssssiisis",
        $name, $phone, $email, $city,
        $vehicle_model, $registration_no,
        $current_kms, $plan_type,
        $duration_years, $message, $ip
    );

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        logEnquiry("AMC", $id, $name, $phone);
        sendSuccess("AMC enquiry submitted! Our team will call you to discuss the best plan.", ["id" => $id]);
    } else {
        sendError(500, "DB error: " . $stmt->error);
    }
    $stmt->close();
}


// ────────────────────────────────────────────────
//  4. RSA ENQUIRY
//  POST /api.php?action=rsa
// ────────────────────────────────────────────────
function handleRSAEnquiry($d) {
    global $conn;

    $name            = sanitize($d["name"]            ?? "");
    $phone           = sanitize($d["phone"]           ?? "");
    $email           = sanitize($d["email"]           ?? "");
    $city            = sanitize($d["city"]            ?? "");
    $vehicle_model   = sanitize($d["vehicle_model"]   ?? "");
    $registration_no = sanitize($d["registration_no"] ?? "");
    $plan_type       = sanitize($d["plan_type"]       ?? "not_sure");
    $message         = sanitize($d["message"]         ?? "");
    $ip              = getClientIP();

    if (!$name)              sendError(400, "Name is required");
    if (!isValidPhone($phone)) sendError(400, "Invalid phone number");

    $valid_plans = ["within_warranty", "premium", "standard", "not_sure"];
    if (!in_array($plan_type, $valid_plans)) $plan_type = "not_sure";

    $stmt = $conn->prepare("
        INSERT INTO rsa_enquiries
          (name, phone, email, city, vehicle_model, registration_no,
           plan_type, message, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssssssss",
        $name, $phone, $email, $city,
        $vehicle_model, $registration_no,
        $plan_type, $message, $ip
    );

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        logEnquiry("RSA", $id, $name, $phone);
        sendSuccess("RSA enquiry received! Our team will activate your plan shortly.", ["id" => $id]);
    } else {
        sendError(500, "DB error: " . $stmt->error);
    }
    $stmt->close();
}


// ────────────────────────────────────────────────
//  5. VAS ENQUIRY
//  POST /api.php?action=vas
// ────────────────────────────────────────────────
function handleVASEnquiry($d) {
    global $conn;

    $name             = sanitize($d["name"]             ?? "");
    $phone            = sanitize($d["phone"]            ?? "");
    $email            = sanitize($d["email"]            ?? "");
    $city             = sanitize($d["city"]             ?? "");
    $vehicle_model    = sanitize($d["vehicle_model"]    ?? "");
    $registration_no  = sanitize($d["registration_no"]  ?? "");
    $service_category = sanitize($d["service_category"] ?? "");
    $service_name     = sanitize($d["service_name"]     ?? "");
    $preferred_date   = sanitize($d["preferred_date"]   ?? "");
    $message          = sanitize($d["message"]          ?? "");
    $ip               = getClientIP();

    if (!$name)              sendError(400, "Name is required");
    if (!isValidPhone($phone)) sendError(400, "Invalid phone number");

    $stmt = $conn->prepare("
        INSERT INTO vas_enquiries
          (name, phone, email, city, vehicle_model, registration_no,
           service_category, service_name, preferred_date, message, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssssssssss",
        $name, $phone, $email, $city,
        $vehicle_model, $registration_no,
        $service_category, $service_name,
        $preferred_date ?: null, $message, $ip
    );

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        logEnquiry("VAS", $id, $name, $phone);
        sendSuccess("VAS booking request submitted! We'll confirm your appointment shortly.", ["id" => $id]);
    } else {
        sendError(500, "DB error: " . $stmt->error);
    }
    $stmt->close();
}


// ────────────────────────────────────────────────
//  6. TEST DRIVE BOOKING
//  POST /api.php?action=testdrive
// ────────────────────────────────────────────────
function handleTestDrive($d) {
    global $conn;

    $name           = sanitize($d["name"]           ?? "");
    $phone          = sanitize($d["phone"]          ?? "");
    $email          = sanitize($d["email"]          ?? "");
    $city           = sanitize($d["city"]           ?? "");
    $vehicle_model  = sanitize($d["vehicle_model"]  ?? "");
    $preferred_date = sanitize($d["preferred_date"] ?? "");
    $preferred_time = sanitize($d["preferred_time"] ?? "");
    $showroom       = sanitize($d["showroom"]       ?? "");
    $message        = sanitize($d["message"]        ?? "");
    $ip             = getClientIP();

    if (!$name)              sendError(400, "Name is required");
    if (!isValidPhone($phone)) sendError(400, "Invalid phone number");

    $stmt = $conn->prepare("
        INSERT INTO test_drive_bookings
          (name, phone, email, city, vehicle_model,
           preferred_date, preferred_time, showroom, message, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssssssssss",
        $name, $phone, $email, $city,
        $vehicle_model, $preferred_date ?: null,
        $preferred_time, $showroom, $message, $ip
    );

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        logEnquiry("TestDrive", $id, $name, $phone);
        sendSuccess("Test drive booked! Our showroom will confirm your slot shortly.", ["id" => $id]);
    } else {
        sendError(500, "DB error: " . $stmt->error);
    }
    $stmt->close();
}


// ────────────────────────────────────────────────
//  7. ADMIN — LIST ENQUIRIES
//  GET /api.php?action=admin_list&type=finance&status=new
// ────────────────────────────────────────────────
function handleAdminList() {
    global $conn;
    requireAdmin();

    $table_map = [
        "finance"   => "finance_enquiries",
        "ew"        => "ew_enquiries",
        "amc"       => "amc_enquiries",
        "rsa"       => "rsa_enquiries",
        "vas"       => "vas_enquiries",
        "testdrive" => "test_drive_bookings",
    ];

    $type   = $_GET["type"]   ?? "finance";
    $status = $_GET["status"] ?? "";
    $limit  = min(100, intval($_GET["limit"]  ?? 50));
    $page   = max(1,   intval($_GET["page"]   ?? 1));
    $offset = ($page - 1) * $limit;

    if (!isset($table_map[$type])) sendError(400, "Invalid type");
    $table = $table_map[$type];

    $where  = $status ? "WHERE status = '" . $conn->real_escape_string($status) . "'" : "";
    $result = $conn->query("SELECT * FROM $table $where ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
    $countR = $conn->query("SELECT COUNT(*) AS total FROM $table $where");
    $total  = $countR->fetch_assoc()["total"];

    $rows = [];
    while ($row = $result->fetch_assoc()) $rows[] = $row;

    echo json_encode(["success" => true, "total" => intval($total), "page" => $page, "data" => $rows]);
    exit;
}


// ────────────────────────────────────────────────
//  8. ADMIN — UPDATE STATUS
//  POST /api.php?action=admin_update&type=finance&id=5
// ────────────────────────────────────────────────
function handleAdminUpdate($d) {
    global $conn;
    requireAdmin();

    $table_map = [
        "finance"=>"finance_enquiries","ew"=>"ew_enquiries","amc"=>"amc_enquiries",
        "rsa"=>"rsa_enquiries","vas"=>"vas_enquiries","testdrive"=>"test_drive_bookings",
    ];

    $type = $_GET["type"] ?? "";
    $id   = intval($_GET["id"] ?? 0);
    if (!isset($table_map[$type])) sendError(400, "Invalid type");
    if (!$id) sendError(400, "Invalid ID");
    $table = $table_map[$type];

    $sets = []; $params = []; $types = "";
    if (!empty($d["status"]))      { $sets[] = "status = ?";      $params[] = $d["status"];      $types .= "s"; }
    if (!empty($d["assigned_to"])) { $sets[] = "assigned_to = ?"; $params[] = $d["assigned_to"]; $types .= "s"; }
    if (!empty($d["remarks"]))     { $sets[] = "remarks = ?";     $params[] = $d["remarks"];     $types .= "s"; }

    if (!$sets) sendError(400, "Nothing to update");

    $params[] = $id; $types .= "i";
    $stmt = $conn->prepare("UPDATE $table SET " . implode(", ", $sets) . " WHERE id = ?");
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        sendSuccess("Updated successfully");
    } else {
        sendError(500, "Update failed: " . $stmt->error);
    }
    $stmt->close();
}


// ────────────────────────────────────────────────
//  9. ADMIN SUMMARY DASHBOARD
//  GET /api.php?action=admin_summary
// ────────────────────────────────────────────────
function handleAdminSummary() {
    global $conn;
    requireAdmin();
    $result = $conn->query("SELECT * FROM v_enquiry_summary");
    $rows = [];
    while ($r = $result->fetch_assoc()) $rows[] = $r;
    echo json_encode(["success" => true, "data" => $rows]);
    exit;
}


// ════════════════════════════════════════════════
//  UTILITY FUNCTIONS
// ════════════════════════════════════════════════

function sanitize($str) {
    return htmlspecialchars(strip_tags(trim((string)$str)), ENT_QUOTES, "UTF-8");
}

function isValidPhone($phone) {
    return preg_match('/^\d{10}$/', trim($phone));
}

function getClientIP() {
    return $_SERVER["HTTP_X_FORWARDED_FOR"]
        ?? $_SERVER["HTTP_X_REAL_IP"]
        ?? $_SERVER["REMOTE_ADDR"]
        ?? null;
}

function requireAdmin() {
    $token = $_SERVER["HTTP_X_ADMIN_TOKEN"] ?? "";
    if ($token !== ADMIN_TOKEN) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Unauthorised"]);
        exit;
    }
}

function sendSuccess($message, $extra = [], $code = 201) {
    http_response_code($code);
    echo json_encode(array_merge(["success" => true, "message" => $message], $extra));
    exit;
}

function sendError($code, $message) {
    http_response_code($code);
    echo json_encode(["success" => false, "error" => $message]);
    exit;
}

function logEnquiry($type, $id, $name, $phone) {
    $line = "[" . date("Y-m-d H:i:s") . "] [$type] #$id — $name ($phone)\n";
    file_put_contents(__DIR__ . "/enquiry.log", $line, FILE_APPEND | LOCK_EX);
}
?>

<?php
// ================================================================
// MANICKBAG — PHP API ADDITIONS
// Paste this into your existing api.php (or include it separately)
// Adds all 9 new endpoints matching server_additions.js
// ================================================================

// Assumes your api.php already has:
//   $pdo = new PDO(...) as $conn or $pdo
//   getBody() helper or json_decode(file_get_contents('php://input'), true)
//   respond($data, $code) helper

$method = $_SERVER['REQUEST_METHOD'];
$path   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path   = rtrim(str_replace('/api', '', $path), '/');
$parts  = explode('/', trim($path, '/'));

// ── Helper ────────────────────────────────────────────────────────
function getInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
function respond($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
function validatePhone($phone) {
    return preg_match('/^[+\d\s\-]{7,20}$/', $phone);
}

// ================================================================
//  1. OFFER ENQUIRIES
// ================================================================
if ($path === '/offer-enquiries') {
    if ($method === 'POST') {
        $d = getInput();
        if (empty($d['model_name']) || empty($d['offer_headline'])) {
            respond(['success'=>false,'message'=>'model_name and offer_headline are required.'], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO offer_enquiries
            (offer_id, model_name, offer_headline, offer_category, valid_till, name, phone)
            VALUES (?,?,?,?,?,?,?)");
        $stmt->execute([
            $d['offer_id'] ?? null,
            $d['model_name'],
            $d['offer_headline'],
            $d['offer_category'] ?? 'general',
            $d['valid_till'] ?? null,
            $d['name'] ?? null,
            $d['phone'] ?? null,
        ]);
        respond(['success'=>true,'message'=>'Offer enquiry submitted.','id'=>$pdo->lastInsertId()], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM offer_enquiries ORDER BY created_at DESC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}


// ================================================================
//  2. CORPORATE ENQUIRIES
// ================================================================
if ($path === '/corporate-enquiries') {
    if ($method === 'POST') {
        $d = getInput();
        if (empty($d['company_name']) || empty($d['contact_name']) || empty($d['phone']) || empty($d['fleet_size'])) {
            respond(['success'=>false,'message'=>'company_name, contact_name, phone, fleet_size are required.'], 400);
        }
        $modelsJson = isset($d['models_interested']) ? json_encode($d['models_interested']) : null;
        $stmt = $pdo->prepare("INSERT INTO corporate_enquiries
            (company_name, contact_name, phone, email, gst_number, fleet_size, models_interested, city)
            VALUES (?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $d['company_name'], $d['contact_name'], $d['phone'],
            $d['email'] ?? null, $d['gst_number'] ?? null, $d['fleet_size'],
            $modelsJson, $d['city'] ?? null,
        ]);
        respond(['success'=>true,'message'=>'Fleet enquiry submitted. Our team will contact you within 4 hours.','id'=>$pdo->lastInsertId()], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM corporate_enquiries ORDER BY created_at DESC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}


// ================================================================
//  3. EXCHANGE ENQUIRIES
// ================================================================
if ($path === '/exchange-enquiries') {
    if ($method === 'POST') {
        $d = getInput();
        if (empty($d['name']) || empty($d['phone']) || empty($d['old_brand']) || empty($d['old_model'])) {
            respond(['success'=>false,'message'=>'name, phone, old_brand, old_model are required.'], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO exchange_enquiries
            (name, phone, old_brand, old_model, old_year, old_km, new_model, city, exchange_bonus)
            VALUES (?,?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $d['name'], $d['phone'], $d['old_brand'], $d['old_model'],
            $d['old_year'] ?? null, $d['old_km'] ?? null,
            $d['new_model'] ?? null, $d['city'] ?? null, $d['exchange_bonus'] ?? null,
        ]);
        respond(['success'=>true,'message'=>'Exchange enquiry submitted. Specialist will call within 2 hours.','id'=>$pdo->lastInsertId()], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM exchange_enquiries ORDER BY created_at DESC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}


// ================================================================
//  4. FINANCE APPLICATIONS
// ================================================================
if ($path === '/finance-applications') {
    if ($method === 'POST') {
        $d = getInput();
        if (empty($d['name']) || empty($d['phone']) || empty($d['employment_type'])) {
            respond(['success'=>false,'message'=>'name, phone, employment_type are required.'], 400);
        }
        $validEmp = ['salaried','govt','selfemployed','professional','farmer'];
        if (!in_array($d['employment_type'], $validEmp)) {
            respond(['success'=>false,'message'=>'Invalid employment_type.'], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO finance_applications
            (name, phone, employment_type, income_range, vehicle_interest, scheme_interest, city, loan_amount, tenure_months)
            VALUES (?,?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $d['name'], $d['phone'], $d['employment_type'],
            $d['income_range'] ?? null, $d['vehicle_interest'] ?? null,
            $d['scheme_interest'] ?? null, $d['city'] ?? null,
            $d['loan_amount'] ?? null, $d['tenure_months'] ?? null,
        ]);
        respond(['success'=>true,'message'=>'Application submitted. Team will call within 4 hours.','id'=>$pdo->lastInsertId()], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM finance_applications ORDER BY created_at DESC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}


// ================================================================
//  5. SERVICE BOOKINGS
// ================================================================
if ($path === '/service-bookings') {
    if ($method === 'POST') {
        $d = getInput();
        $required = ['name','phone','reg_number','vehicle_model','service_type','showroom','appointment_date','appointment_time'];
        foreach ($required as $field) {
            if (empty($d[$field])) respond(['success'=>false,'message'=>"$field is required."], 400);
        }
        $validTypes = ['periodic','repair','bodyshop','wheel','electrical','doorstep'];
        if (!in_array($d['service_type'], $validTypes)) {
            respond(['success'=>false,'message'=>'Invalid service_type.'], 400);
        }
        // Check slot capacity
        $check = $pdo->prepare("SELECT COUNT(*) FROM service_bookings WHERE showroom=? AND appointment_date=? AND appointment_time=? AND status!='cancelled'");
        $check->execute([$d['showroom'], $d['appointment_date'], $d['appointment_time']]);
        if ($check->fetchColumn() >= 3) {
            respond(['success'=>false,'message'=>'This slot is full. Please choose another.'], 409);
        }
        $stmt = $pdo->prepare("INSERT INTO service_bookings
            (name, phone, reg_number, vehicle_model, service_type, showroom, appointment_date, appointment_time, issues_desc)
            VALUES (?,?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $d['name'], $d['phone'], $d['reg_number'], $d['vehicle_model'],
            $d['service_type'], $d['showroom'], $d['appointment_date'],
            $d['appointment_time'], $d['issues_desc'] ?? null,
        ]);
        $id = $pdo->lastInsertId();
        respond([
            'success'     => true,
            'message'     => "Booking confirmed for {$d['appointment_date']} at {$d['appointment_time']}.",
            'id'          => $id,
            'booking_ref' => 'MB-SVC-' . str_pad($id, 5, '0', STR_PAD_LEFT),
        ], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM service_bookings ORDER BY appointment_date ASC, appointment_time ASC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}

// Slot availability check
if ($path === '/service-bookings/slots' && $method === 'GET') {
    if (empty($_GET['showroom']) || empty($_GET['date'])) {
        respond(['success'=>false,'message'=>'showroom and date are required.'], 400);
    }
    $allSlots = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM'];
    $stmt = $pdo->prepare("SELECT appointment_time, COUNT(*) as cnt FROM service_bookings WHERE showroom=? AND appointment_date=? AND status!='cancelled' GROUP BY appointment_time");
    $stmt->execute([$_GET['showroom'], $_GET['date']]);
    $bookedMap = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $bookedMap[$row['appointment_time']] = $row['cnt'];
    }
    $slots = array_map(fn($s) => [
        'time'      => $s,
        'available' => ($bookedMap[$s] ?? 0) < 3,
        'remaining' => max(0, 3 - ($bookedMap[$s] ?? 0)),
    ], $allSlots);
    respond(['success'=>true,'data'=>$slots]);
}


// ================================================================
//  6. FASTAG ENQUIRIES
// ================================================================
if ($path === '/fastag-enquiries') {
    if ($method === 'POST') {
        $d = getInput();
        if (empty($d['name']) || empty($d['phone']) || empty($d['reg_number'])) {
            respond(['success'=>false,'message'=>'name, phone, reg_number are required.'], 400);
        }
        $check = $pdo->prepare("SELECT id FROM fastag_enquiries WHERE reg_number=? AND status IN ('new','appointment_scheduled')");
        $check->execute([$d['reg_number']]);
        if ($check->fetch()) {
            respond(['success'=>false,'message'=>'A FASTag enquiry for this vehicle is already in progress.'], 409);
        }
        $stmt = $pdo->prepare("INSERT INTO fastag_enquiries (name, phone, reg_number, vehicle_model, showroom_city, is_new_vehicle) VALUES (?,?,?,?,?,?)");
        $stmt->execute([
            $d['name'], $d['phone'], $d['reg_number'],
            $d['vehicle_model'] ?? null, $d['showroom_city'] ?? null,
            isset($d['is_new_vehicle']) && $d['is_new_vehicle'] ? 1 : 0,
        ]);
        respond(['success'=>true,'message'=>'FASTag enquiry submitted. We will call within 2 hours.','id'=>$pdo->lastInsertId()], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM fastag_enquiries ORDER BY created_at DESC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}


// ================================================================
//  7. INSURANCE ENQUIRIES
// ================================================================
if ($path === '/insurance-enquiries') {
    if ($method === 'POST') {
        $d = getInput();
        if (empty($d['phone']) || empty($d['enquiry_type'])) {
            respond(['success'=>false,'message'=>'phone and enquiry_type are required.'], 400);
        }
        if (!in_array($d['enquiry_type'], ['new','renewal'])) {
            respond(['success'=>false,'message'=>'enquiry_type must be new or renewal.'], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO insurance_enquiries (name, phone, vehicle_model, reg_number, enquiry_type, plan_type, insurer_pref) VALUES (?,?,?,?,?,?,?)");
        $stmt->execute([
            $d['name'] ?? null, $d['phone'],
            $d['vehicle_model'] ?? null, $d['reg_number'] ?? null,
            $d['enquiry_type'], $d['plan_type'] ?? 'comprehensive',
            $d['insurer_pref'] ?? null,
        ]);
        respond(['success'=>true,'message'=>'Insurance enquiry submitted. Quotes within 30 minutes.','id'=>$pdo->lastInsertId()], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM insurance_enquiries ORDER BY created_at DESC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}


// ================================================================
//  8. ACCESSORY ENQUIRIES
// ================================================================
if ($path === '/accessory-enquiries') {
    if ($method === 'POST') {
        $d = getInput();
        if (empty($d['items_selected']) || !is_array($d['items_selected'])) {
            respond(['success'=>false,'message'=>'items_selected array is required.'], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO accessory_enquiries (name, phone, vehicle_model, items_selected, total_items, showroom_city) VALUES (?,?,?,?,?,?)");
        $stmt->execute([
            $d['name'] ?? null, $d['phone'] ?? null, $d['vehicle_model'] ?? null,
            json_encode($d['items_selected']), count($d['items_selected']),
            $d['showroom_city'] ?? null,
        ]);
        respond(['success'=>true,'message'=>'Accessory enquiry submitted. Quote will be sent shortly.','id'=>$pdo->lastInsertId(),'total_items'=>count($d['items_selected'])], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM accessory_enquiries ORDER BY created_at DESC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}


// ================================================================
//  9. VAS BOOKINGS
// ================================================================
if ($path === '/vas-bookings') {
    if ($method === 'POST') {
        $d = getInput();
        if (empty($d['services']) || !is_array($d['services'])) {
            respond(['success'=>false,'message'=>'services array is required.'], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO vas_bookings (name, phone, vehicle_model, reg_number, services, showroom_city, preferred_date) VALUES (?,?,?,?,?,?,?)");
        $stmt->execute([
            $d['name'] ?? null, $d['phone'] ?? null,
            $d['vehicle_model'] ?? null, $d['reg_number'] ?? null,
            json_encode($d['services']), $d['showroom_city'] ?? null,
            $d['preferred_date'] ?? null,
        ]);
        respond(['success'=>true,'message'=>'VAS booking submitted. Appointment confirmed within 2 hours.','id'=>$pdo->lastInsertId()], 201);
    }
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM vas_bookings ORDER BY created_at DESC LIMIT 100");
        respond(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}


// ================================================================
//  ADMIN STATS
// ================================================================
if ($path === '/admin/stats' && $method === 'GET') {
    $stmt  = $pdo->query("SELECT * FROM v_daily_stats");
    $rows  = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $today = $pdo->query("SELECT COUNT(*) FROM v_enquiry_summary WHERE DATE(created_at) = CURDATE()")->fetchColumn();
    $pend  = $pdo->query("SELECT COUNT(*) FROM v_enquiry_summary WHERE status = 'new'")->fetchColumn();
    respond(['success'=>true,'data'=>['by_source'=>$rows,'today_total'=>(int)$today,'pending_total'=>(int)$pend]]);
}


// ================================================================
//  UNIVERSAL STATUS UPDATE  PATCH /:table/:id/status
// ================================================================
if ($method === 'PATCH' && isset($parts[0]) && isset($parts[1]) && isset($parts[2]) && $parts[2] === 'status') {
    $validTables = [
        'offer_enquiries','corporate_enquiries','exchange_enquiries',
        'finance_applications','service_bookings','fastag_enquiries',
        'insurance_enquiries','accessory_enquiries','vas_bookings',
        'finance_enquiries','ew_enquiries','amc_enquiries',
        'rsa_enquiries','vas_enquiries','test_drive_bookings',
    ];
    $table = $parts[0];
    $id    = (int)$parts[1];
    if (!in_array($table, $validTables)) {
        respond(['success'=>false,'message'=>'Invalid table.'], 400);
    }
    $d = getInput();
    if (empty($d['status'])) respond(['success'=>false,'message'=>'status is required.'], 400);
    $sql    = "UPDATE `$table` SET status = ?";
    $params = [$d['status']];
    if (isset($d['notes'])) { $sql .= ', notes = ?'; $params[] = $d['notes']; }
    $sql   .= ' WHERE id = ?';
    $params[] = $id;
    $stmt   = $pdo->prepare($sql);
    $stmt->execute($params);
    if ($stmt->rowCount() === 0) respond(['success'=>false,'message'=>'Record not found.'], 404);
    respond(['success'=>true,'message'=>"Status updated to '{$d['status']}'."]);
}