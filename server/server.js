// ============================================================
//  MANICKBAG AUTOMOBILES — Node.js Backend Server
//  File    : server/server.js
//  Run     : node server.js  OR  npm run dev (with nodemon)
//  Port    : 5000
// ============================================================

const express    = require("express");
const mysql      = require("mysql2/promise");   // promise-based
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
require("dotenv").config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
//  MIDDLEWARE
// ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10kb" }));

// Rate limiting — 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 100,
  message  : { error: "Too many requests. Please try again later." },
});
app.use("/api/", limiter);

// Stricter limit for form submissions — 10 per 15 min
const formLimiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 10,
  message  : { error: "Too many submissions. Please try again later." },
});


// ─────────────────────────────────────────────
//  MySQL CONNECTION POOL
// ─────────────────────────────────────────────
const pool = mysql.createPool({
  host              : process.env.DB_HOST     || "localhost",
  user              : process.env.DB_USER     || "root",
  password          : process.env.DB_PASSWORD || "Manickbag@2025",
  database          : process.env.DB_NAME     || "manickbag_db",
  port              : process.env.DB_PORT     || 3306,
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0,
  charset           : "utf8mb4",
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅  MySQL Connected — manickbag_db");
    conn.release();
  } catch (err) {
    console.error("❌  MySQL Connection Failed:", err.message);
    process.exit(1);
  }
})();


// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

/** Extract client IP (works behind proxies too) */
const getIP = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  null;

/** Simple phone validator — Indian 10-digit */
const isValidPhone = (p) => /^\d{10}$/.test(String(p).trim());

/** Trim all string fields in an object */
const trimAll = (obj) => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = typeof v === "string" ? v.trim() : v;
  }
  return out;
};

/** Standard success response */
const ok = (res, message, data = {}) =>
  res.status(201).json({ success: true, message, ...data });

/** Standard error response */
const fail = (res, status, message) =>
  res.status(status).json({ success: false, error: message });


// ─────────────────────────────────────────────
//  HEALTH CHECK
// ─────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected", timestamp: new Date() });
  } catch {
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});


// ══════════════════════════════════════════════
//  1. FINANCE LOAN ENQUIRY
//  POST /api/finance/enquiry
// ══════════════════════════════════════════════
app.post("/api/finance/enquiry", formLimiter, async (req, res) => {
  try {
    const body = trimAll(req.body);
    const {
      name, phone, email, city,
      vehicle_model, loan_amount,
      employment_type, message,
    } = body;

    // Validation
    if (!name)               return fail(res, 400, "Name is required");
    if (!isValidPhone(phone)) return fail(res, 400, "Invalid phone number — must be 10 digits");
    if (!vehicle_model)      return fail(res, 400, "Please select a vehicle model");
    if (!loan_amount)        return fail(res, 400, "Please select a loan amount range");

    const sql = `
      INSERT INTO finance_enquiries
        (name, phone, email, city, vehicle_model, loan_amount, employment_type, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      name, phone, email || null, city || null,
      vehicle_model, loan_amount,
      employment_type || null, message || null,
      getIP(req),
    ]);

    console.log(`[Finance] New enquiry #${result.insertId} — ${name} (${phone})`);
    return ok(res, "Finance enquiry submitted successfully! Our team will contact you within 24 hours.", { id: result.insertId });

  } catch (err) {
    console.error("[Finance] Error:", err.message);
    return fail(res, 500, "Server error. Please try again.");
  }
});


// ══════════════════════════════════════════════
//  2. EXTENDED WARRANTY (EW) ENQUIRY
//  POST /api/ew/enquiry
// ══════════════════════════════════════════════
app.post("/api/ew/enquiry", formLimiter, async (req, res) => {
  try {
    const body = trimAll(req.body);
    const {
      name, phone, email, city,
      vehicle_model, registration_no,
      purchase_year, plan_selected,
      current_warranty_expiry, message,
    } = body;

    if (!name)               return fail(res, 400, "Name is required");
    if (!isValidPhone(phone)) return fail(res, 400, "Invalid phone number");

    const validPlans = ["1_year", "2_year", "not_sure"];
    const plan = validPlans.includes(plan_selected) ? plan_selected : "not_sure";

    const sql = `
      INSERT INTO ew_enquiries
        (name, phone, email, city, vehicle_model, registration_no,
         purchase_year, plan_selected, current_warranty_expiry, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      name, phone, email || null, city || null,
      vehicle_model || null, registration_no || null,
      purchase_year || null, plan,
      current_warranty_expiry || null, message || null,
      getIP(req),
    ]);

    console.log(`[EW] New enquiry #${result.insertId} — ${name} (${phone})`);
    return ok(res, "Extended Warranty enquiry received! We'll get back to you shortly.", { id: result.insertId });

  } catch (err) {
    console.error("[EW] Error:", err.message);
    return fail(res, 500, "Server error. Please try again.");
  }
});


// ══════════════════════════════════════════════
//  3. AMC ENQUIRY
//  POST /api/amc/enquiry
// ══════════════════════════════════════════════
app.post("/api/amc/enquiry", formLimiter, async (req, res) => {
  try {
    const body = trimAll(req.body);
    const {
      name, phone, email, city,
      vehicle_model, registration_no,
      current_kms, plan_type,
      duration_years, message,
    } = body;

    if (!name)               return fail(res, 400, "Name is required");
    if (!isValidPhone(phone)) return fail(res, 400, "Invalid phone number");

    const validPlans = ["gold", "silver", "protect_plus", "p2p", "not_sure"];
    const plan = validPlans.includes(plan_type) ? plan_type : "not_sure";

    const sql = `
      INSERT INTO amc_enquiries
        (name, phone, email, city, vehicle_model, registration_no,
         current_kms, plan_type, duration_years, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      name, phone, email || null, city || null,
      vehicle_model || null, registration_no || null,
      current_kms ? parseInt(current_kms) : null, plan,
      duration_years ? parseInt(duration_years) : null,
      message || null, getIP(req),
    ]);

    console.log(`[AMC] New enquiry #${result.insertId} — ${name} (${phone})`);
    return ok(res, "AMC enquiry submitted! Our team will call you to discuss the best plan.", { id: result.insertId });

  } catch (err) {
    console.error("[AMC] Error:", err.message);
    return fail(res, 500, "Server error. Please try again.");
  }
});


// ══════════════════════════════════════════════
//  4. RSA ENQUIRY
//  POST /api/rsa/enquiry
// ══════════════════════════════════════════════
app.post("/api/rsa/enquiry", formLimiter, async (req, res) => {
  try {
    const body = trimAll(req.body);
    const {
      name, phone, email, city,
      vehicle_model, registration_no,
      plan_type, message,
    } = body;

    if (!name)               return fail(res, 400, "Name is required");
    if (!isValidPhone(phone)) return fail(res, 400, "Invalid phone number");

    const validPlans = ["within_warranty", "premium", "standard", "not_sure"];
    const plan = validPlans.includes(plan_type) ? plan_type : "not_sure";

    const sql = `
      INSERT INTO rsa_enquiries
        (name, phone, email, city, vehicle_model, registration_no,
         plan_type, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      name, phone, email || null, city || null,
      vehicle_model || null, registration_no || null,
      plan, message || null, getIP(req),
    ]);

    console.log(`[RSA] New enquiry #${result.insertId} — ${name} (${phone})`);
    return ok(res, "RSA enquiry received! Our team will activate your plan shortly.", { id: result.insertId });

  } catch (err) {
    console.error("[RSA] Error:", err.message);
    return fail(res, 500, "Server error. Please try again.");
  }
});


// ══════════════════════════════════════════════
//  5. VAS ENQUIRY
//  POST /api/vas/enquiry
// ══════════════════════════════════════════════
app.post("/api/vas/enquiry", formLimiter, async (req, res) => {
  try {
    const body = trimAll(req.body);
    const {
      name, phone, email, city,
      vehicle_model, registration_no,
      service_category, service_name,
      preferred_date, message,
    } = body;

    if (!name)               return fail(res, 400, "Name is required");
    if (!isValidPhone(phone)) return fail(res, 400, "Invalid phone number");

    const sql = `
      INSERT INTO vas_enquiries
        (name, phone, email, city, vehicle_model, registration_no,
         service_category, service_name, preferred_date, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      name, phone, email || null, city || null,
      vehicle_model || null, registration_no || null,
      service_category || null, service_name || null,
      preferred_date || null, message || null,
      getIP(req),
    ]);

    console.log(`[VAS] New booking #${result.insertId} — ${name} (${phone})`);
    return ok(res, "VAS booking request submitted! We'll confirm your appointment shortly.", { id: result.insertId });

  } catch (err) {
    console.error("[VAS] Error:", err.message);
    return fail(res, 500, "Server error. Please try again.");
  }
});


// ══════════════════════════════════════════════
//  6. TEST DRIVE BOOKING
//  POST /api/testdrive/book
// ══════════════════════════════════════════════
app.post("/api/testdrive/book", formLimiter, async (req, res) => {
  try {
    const body = trimAll(req.body);
    const {
      name, phone, email, city,
      vehicle_model, preferred_date,
      preferred_time, showroom, message,
    } = body;

    if (!name)               return fail(res, 400, "Name is required");
    if (!isValidPhone(phone)) return fail(res, 400, "Invalid phone number");

    const sql = `
      INSERT INTO test_drive_bookings
        (name, phone, email, city, vehicle_model,
         preferred_date, preferred_time, showroom, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      name, phone, email || null, city || null,
      vehicle_model || null, preferred_date || null,
      preferred_time || null, showroom || null,
      message || null, getIP(req),
    ]);

    console.log(`[TestDrive] New booking #${result.insertId} — ${name} (${phone})`);
    return ok(res, "Test drive booked! Our showroom will confirm your slot shortly.", { id: result.insertId });

  } catch (err) {
    console.error("[TestDrive] Error:", err.message);
    return fail(res, 500, "Server error. Please try again.");
  }
});


// ══════════════════════════════════════════════
//  7. ADMIN — LIST ENQUIRIES  (protected by simple token)
//  GET /api/admin/enquiries?type=finance&status=new&limit=50
// ══════════════════════════════════════════════
const adminAuth = (req, res, next) => {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorised" });
  }
  next();
};

const TABLE_MAP = {
  finance   : "finance_enquiries",
  ew        : "ew_enquiries",
  amc       : "amc_enquiries",
  rsa       : "rsa_enquiries",
  vas       : "vas_enquiries",
  testdrive : "test_drive_bookings",
};

app.get("/api/admin/enquiries", adminAuth, async (req, res) => {
  try {
    const { type = "finance", status, limit = 50, page = 1 } = req.query;
    const table = TABLE_MAP[type];
    if (!table) return fail(res, 400, "Invalid enquiry type");

    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const params = [];
    let where = "WHERE 1=1";
    if (status) { where += " AND status = ?"; params.push(status); }

    const sql = `SELECT * FROM ${table} ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [rows]  = await pool.execute(sql, params);
    const [[cnt]] = await pool.execute(`SELECT COUNT(*) AS total FROM ${table} ${where.replace("WHERE 1=1", "WHERE 1=1")}`, params.slice(0, -2));

    res.json({ success: true, total: cnt.total, page: parseInt(page), data: rows });
  } catch (err) {
    console.error("[Admin] Error:", err.message);
    return fail(res, 500, "Server error");
  }
});


// ══════════════════════════════════════════════
//  8. ADMIN — UPDATE STATUS
//  PATCH /api/admin/enquiries/:type/:id
// ══════════════════════════════════════════════
app.patch("/api/admin/enquiries/:type/:id", adminAuth, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status, assigned_to, remarks } = req.body;
    const table = TABLE_MAP[type];
    if (!table) return fail(res, 400, "Invalid enquiry type");

    const fields = [];
    const params = [];
    if (status)      { fields.push("status = ?");      params.push(status); }
    if (assigned_to) { fields.push("assigned_to = ?"); params.push(assigned_to); }
    if (remarks)     { fields.push("remarks = ?");     params.push(remarks); }

    if (!fields.length) return fail(res, 400, "Nothing to update");

    params.push(parseInt(id));
    await pool.execute(`UPDATE ${table} SET ${fields.join(", ")} WHERE id = ?`, params);

    res.json({ success: true, message: "Updated successfully" });
  } catch (err) {
    console.error("[Admin PATCH] Error:", err.message);
    return fail(res, 500, "Server error");
  }
});


// ══════════════════════════════════════════════
//  9. ADMIN — SUMMARY DASHBOARD
//  GET /api/admin/summary
// ══════════════════════════════════════════════
app.get("/api/admin/summary", adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM v_enquiry_summary");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("[Admin Summary] Error:", err.message);
    return fail(res, 500, "Server error");
  }
});


// ─────────────────────────────────────────────
//  404 CATCH-ALL
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// ─────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║  Manickbag API Server — Running ✅   ║
  ║  http://localhost:${PORT}              ║
  ╚══════════════════════════════════════╝

  Endpoints:
    POST  /api/finance/enquiry
    POST  /api/ew/enquiry
    POST  /api/amc/enquiry
    POST  /api/rsa/enquiry
    POST  /api/vas/enquiry
    POST  /api/testdrive/book
    GET   /api/admin/enquiries?type=finance
    PATCH /api/admin/enquiries/:type/:id
    GET   /api/admin/summary
    GET   /api/health
  `);
});

// ================================================================
// MANICKBAG — NEW API ROUTES ADDITION
// Paste these routes into your existing server.js
// Place BEFORE the final app.listen() call
// ================================================================

// ── IMPORTS (add these if not already in your server.js) ─────────
// const express = require('express');
// const db = require('./db'); // your existing mysql2 pool


// ================================================================
//  1. OFFER ENQUIRIES  — POST /api/offer-enquiries
// ================================================================
app.post('/api/offer-enquiries', async (req, res) => {
  try {
    const { offer_id, model_name, offer_headline, offer_category, valid_till, name, phone } = req.body;

    if (!model_name || !offer_headline) {
      return res.status(400).json({ success: false, message: 'model_name and offer_headline are required.' });
    }

    const [result] = await db.execute(
      `INSERT INTO offer_enquiries
        (offer_id, model_name, offer_headline, offer_category, valid_till, name, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [offer_id || null, model_name, offer_headline, offer_category || 'general', valid_till || null, name || null, phone || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Offer enquiry submitted successfully.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('offer_enquiries error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/offer-enquiries — admin fetch all
app.get('/api/offer-enquiries', async (req, res) => {
  try {
    const { status, model_name, category, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM offer_enquiries WHERE 1=1';
    const params = [];
    if (status)     { query += ' AND status = ?';        params.push(status); }
    if (model_name) { query += ' AND model_name = ?';    params.push(model_name); }
    if (category)   { query += ' AND offer_category = ?'; params.push(category); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('offer_enquiries GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  2. CORPORATE ENQUIRIES  — POST /api/corporate-enquiries
// ================================================================
app.post('/api/corporate-enquiries', async (req, res) => {
  try {
    const { company_name, contact_name, phone, email, gst_number, fleet_size, models_interested, city } = req.body;

    if (!company_name || !contact_name || !phone || !fleet_size) {
      return res.status(400).json({ success: false, message: 'company_name, contact_name, phone, fleet_size are required.' });
    }

    const [result] = await db.execute(
      `INSERT INTO corporate_enquiries
        (company_name, contact_name, phone, email, gst_number, fleet_size, models_interested, city)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_name, contact_name, phone,
        email || null, gst_number || null, fleet_size,
        models_interested ? JSON.stringify(models_interested) : null,
        city || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Corporate fleet enquiry submitted. Our team will contact you within 4 hours.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('corporate_enquiries error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/corporate-enquiries
app.get('/api/corporate-enquiries', async (req, res) => {
  try {
    const { status, fleet_size, city, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM corporate_enquiries WHERE 1=1';
    const params = [];
    if (status)     { query += ' AND status = ?';     params.push(status); }
    if (fleet_size) { query += ' AND fleet_size = ?'; params.push(fleet_size); }
    if (city)       { query += ' AND city = ?';       params.push(city); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('corporate_enquiries GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  3. EXCHANGE ENQUIRIES  — POST /api/exchange-enquiries
// ================================================================
app.post('/api/exchange-enquiries', async (req, res) => {
  try {
    const { name, phone, old_brand, old_model, old_year, old_km, new_model, city, exchange_bonus } = req.body;

    if (!name || !phone || !old_brand || !old_model) {
      return res.status(400).json({ success: false, message: 'name, phone, old_brand, old_model are required.' });
    }

    const [result] = await db.execute(
      `INSERT INTO exchange_enquiries
        (name, phone, old_brand, old_model, old_year, old_km, new_model, city, exchange_bonus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, old_brand, old_model, old_year || null, old_km || null, new_model || null, city || null, exchange_bonus || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Exchange enquiry submitted. Our specialist will call you within 2 hours.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('exchange_enquiries error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/exchange-enquiries
app.get('/api/exchange-enquiries', async (req, res) => {
  try {
    const { status, old_brand, new_model, city, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM exchange_enquiries WHERE 1=1';
    const params = [];
    if (status)    { query += ' AND status = ?';    params.push(status); }
    if (old_brand) { query += ' AND old_brand = ?'; params.push(old_brand); }
    if (new_model) { query += ' AND new_model = ?'; params.push(new_model); }
    if (city)      { query += ' AND city = ?';      params.push(city); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('exchange_enquiries GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  4. FINANCE APPLICATIONS  — POST /api/finance-applications
// ================================================================
app.post('/api/finance-applications', async (req, res) => {
  try {
    const { name, phone, employment_type, income_range, vehicle_interest, scheme_interest, city, loan_amount, tenure_months } = req.body;

    if (!name || !phone || !employment_type) {
      return res.status(400).json({ success: false, message: 'name, phone, employment_type are required.' });
    }

    const validEmployment = ['salaried', 'govt', 'selfemployed', 'professional', 'farmer'];
    if (!validEmployment.includes(employment_type)) {
      return res.status(400).json({ success: false, message: 'Invalid employment_type value.' });
    }

    const [result] = await db.execute(
      `INSERT INTO finance_applications
        (name, phone, employment_type, income_range, vehicle_interest, scheme_interest, city, loan_amount, tenure_months)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, employment_type, income_range || null, vehicle_interest || null, scheme_interest || null, city || null, loan_amount || null, tenure_months || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Finance pre-approval application submitted. Our team will call you within 4 hours.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('finance_applications error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/finance-applications
app.get('/api/finance-applications', async (req, res) => {
  try {
    const { status, employment_type, vehicle_interest, city, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM finance_applications WHERE 1=1';
    const params = [];
    if (status)          { query += ' AND status = ?';          params.push(status); }
    if (employment_type) { query += ' AND employment_type = ?'; params.push(employment_type); }
    if (vehicle_interest){ query += ' AND vehicle_interest = ?';params.push(vehicle_interest); }
    if (city)            { query += ' AND city = ?';            params.push(city); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('finance_applications GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  5. SERVICE BOOKINGS  — POST /api/service-bookings
// ================================================================
app.post('/api/service-bookings', async (req, res) => {
  try {
    const { name, phone, reg_number, vehicle_model, service_type, showroom, appointment_date, appointment_time, issues_desc } = req.body;

    if (!name || !phone || !reg_number || !vehicle_model || !service_type || !showroom || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: 'All booking fields are required.' });
    }

    const validServiceTypes = ['periodic', 'repair', 'bodyshop', 'wheel', 'electrical', 'doorstep'];
    if (!validServiceTypes.includes(service_type)) {
      return res.status(400).json({ success: false, message: 'Invalid service_type.' });
    }

    // Check for duplicate booking same slot
    const [existing] = await db.execute(
      `SELECT id FROM service_bookings
       WHERE showroom = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'`,
      [showroom, appointment_date, appointment_time]
    );
    if (existing.length >= 3) {
      return res.status(409).json({ success: false, message: 'This time slot is fully booked. Please choose another slot.' });
    }

    const [result] = await db.execute(
      `INSERT INTO service_bookings
        (name, phone, reg_number, vehicle_model, service_type, showroom, appointment_date, appointment_time, issues_desc)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, reg_number, vehicle_model, service_type, showroom, appointment_date, appointment_time, issues_desc || null]
    );

    return res.status(201).json({
      success: true,
      message: `Service booking confirmed for ${appointment_date} at ${appointment_time}.`,
      id: result.insertId,
      booking_ref: `MB-SVC-${result.insertId.toString().padStart(5, '0')}`,
    });
  } catch (err) {
    console.error('service_bookings error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/service-bookings
app.get('/api/service-bookings', async (req, res) => {
  try {
    const { status, service_type, showroom, appointment_date, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM service_bookings WHERE 1=1';
    const params = [];
    if (status)           { query += ' AND status = ?';           params.push(status); }
    if (service_type)     { query += ' AND service_type = ?';     params.push(service_type); }
    if (showroom)         { query += ' AND showroom = ?';         params.push(showroom); }
    if (appointment_date) { query += ' AND appointment_date = ?'; params.push(appointment_date); }
    query += ' ORDER BY appointment_date ASC, appointment_time ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('service_bookings GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/service-bookings/slots — check available slots for a date+showroom
app.get('/api/service-bookings/slots', async (req, res) => {
  try {
    const { showroom, date } = req.query;
    if (!showroom || !date) {
      return res.status(400).json({ success: false, message: 'showroom and date are required.' });
    }
    const allSlots = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM'];
    const [booked] = await db.execute(
      `SELECT appointment_time, COUNT(*) as count FROM service_bookings
       WHERE showroom = ? AND appointment_date = ? AND status != 'cancelled'
       GROUP BY appointment_time`,
      [showroom, date]
    );
    const bookedMap = {};
    booked.forEach(b => { bookedMap[b.appointment_time] = b.count; });
    const slots = allSlots.map(slot => ({
      time: slot,
      available: (bookedMap[slot] || 0) < 3,
      remaining: Math.max(0, 3 - (bookedMap[slot] || 0)),
    }));
    return res.json({ success: true, data: slots });
  } catch (err) {
    console.error('slots GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  6. FASTAG ENQUIRIES  — POST /api/fastag-enquiries
// ================================================================
app.post('/api/fastag-enquiries', async (req, res) => {
  try {
    const { name, phone, reg_number, vehicle_model, showroom_city, is_new_vehicle } = req.body;

    if (!name || !phone || !reg_number) {
      return res.status(400).json({ success: false, message: 'name, phone, reg_number are required.' });
    }

    // Check duplicate reg number pending
    const [existing] = await db.execute(
      `SELECT id FROM fastag_enquiries WHERE reg_number = ? AND status IN ('new','appointment_scheduled')`,
      [reg_number]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'A FASTag enquiry for this vehicle is already in progress.' });
    }

    const [result] = await db.execute(
      `INSERT INTO fastag_enquiries
        (name, phone, reg_number, vehicle_model, showroom_city, is_new_vehicle)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, phone, reg_number, vehicle_model || null, showroom_city || null, is_new_vehicle ? 1 : 0]
    );

    return res.status(201).json({
      success: true,
      message: 'FASTag enquiry submitted. We will contact you within 2 hours to schedule your appointment.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('fastag_enquiries error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/fastag-enquiries
app.get('/api/fastag-enquiries', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM fastag_enquiries WHERE 1=1';
    const params = [];
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('fastag_enquiries GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  7. INSURANCE ENQUIRIES  — POST /api/insurance-enquiries
// ================================================================
app.post('/api/insurance-enquiries', async (req, res) => {
  try {
    const { name, phone, vehicle_model, reg_number, enquiry_type, plan_type, insurer_pref } = req.body;

    if (!phone || !enquiry_type) {
      return res.status(400).json({ success: false, message: 'phone and enquiry_type are required.' });
    }

    const validTypes  = ['new', 'renewal'];
    const validPlans  = ['third_party', 'comprehensive', 'zero_dep'];
    if (!validTypes.includes(enquiry_type)) {
      return res.status(400).json({ success: false, message: 'enquiry_type must be new or renewal.' });
    }

    const [result] = await db.execute(
      `INSERT INTO insurance_enquiries
        (name, phone, vehicle_model, reg_number, enquiry_type, plan_type, insurer_pref)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name || null, phone, vehicle_model || null, reg_number || null, enquiry_type, plan_type || 'comprehensive', insurer_pref || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Insurance enquiry submitted. Our advisor will share quotes within 30 minutes.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('insurance_enquiries error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/insurance-enquiries
app.get('/api/insurance-enquiries', async (req, res) => {
  try {
    const { status, enquiry_type, plan_type, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM insurance_enquiries WHERE 1=1';
    const params = [];
    if (status)       { query += ' AND status = ?';       params.push(status); }
    if (enquiry_type) { query += ' AND enquiry_type = ?'; params.push(enquiry_type); }
    if (plan_type)    { query += ' AND plan_type = ?';    params.push(plan_type); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('insurance_enquiries GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  8. ACCESSORY ENQUIRIES  — POST /api/accessory-enquiries
// ================================================================
app.post('/api/accessory-enquiries', async (req, res) => {
  try {
    const { name, phone, vehicle_model, items_selected, showroom_city } = req.body;

    if (!items_selected || !Array.isArray(items_selected) || items_selected.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one accessory item must be selected.' });
    }

    const [result] = await db.execute(
      `INSERT INTO accessory_enquiries
        (name, phone, vehicle_model, items_selected, total_items, showroom_city)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name || null, phone || null, vehicle_model || null, JSON.stringify(items_selected), items_selected.length, showroom_city || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Accessory enquiry submitted. Our team will send you a quote shortly.',
      id: result.insertId,
      total_items: items_selected.length,
    });
  } catch (err) {
    console.error('accessory_enquiries error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/accessory-enquiries
app.get('/api/accessory-enquiries', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM accessory_enquiries WHERE 1=1';
    const params = [];
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('accessory_enquiries GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  9. VAS BOOKINGS  — POST /api/vas-bookings
// ================================================================
app.post('/api/vas-bookings', async (req, res) => {
  try {
    const { name, phone, vehicle_model, reg_number, services, showroom_city, preferred_date } = req.body;

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one VAS service must be selected.' });
    }

    const [result] = await db.execute(
      `INSERT INTO vas_bookings
        (name, phone, vehicle_model, reg_number, services, showroom_city, preferred_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name || null, phone || null, vehicle_model || null, reg_number || null, JSON.stringify(services), showroom_city || null, preferred_date || null]
    );

    return res.status(201).json({
      success: true,
      message: 'VAS booking submitted. Our team will confirm your appointment within 2 hours.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('vas_bookings error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/vas-bookings
app.get('/api/vas-bookings', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM vas_bookings WHERE 1=1';
    const params = [];
    if (status) { query += ' AND status = ?'; params.push(status); }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.execute(query, params);
    return res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('vas_bookings GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  ADMIN — GET /api/admin/stats  (dashboard summary)
// ================================================================
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM v_daily_stats');
    const [todayTotal] = await db.execute(
      `SELECT COUNT(*) as total FROM v_enquiry_summary WHERE DATE(created_at) = CURDATE()`
    );
    const [pendingTotal] = await db.execute(
      `SELECT COUNT(*) as total FROM v_enquiry_summary WHERE status = 'new'`
    );
    return res.json({
      success: true,
      data: {
        by_source: rows,
        today_total: todayTotal[0].total,
        pending_total: pendingTotal[0].total,
      }
    });
  } catch (err) {
    console.error('admin stats error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});


// ================================================================
//  STATUS UPDATE  — PATCH /api/:table/:id/status
//  Works for ALL tables — admin use
// ================================================================
const VALID_TABLES = [
  'offer_enquiries', 'corporate_enquiries', 'exchange_enquiries',
  'finance_applications', 'service_bookings', 'fastag_enquiries',
  'insurance_enquiries', 'accessory_enquiries', 'vas_bookings',
  'finance_enquiries', 'ew_enquiries', 'amc_enquiries',
  'rsa_enquiries', 'vas_enquiries', 'test_drive_bookings',
];

app.patch('/api/:table/:id/status', async (req, res) => {
  try {
    const { table, id } = req.params;
    const { status, notes } = req.body;

    if (!VALID_TABLES.includes(table)) {
      return res.status(400).json({ success: false, message: 'Invalid table name.' });
    }
    if (!status) {
      return res.status(400).json({ success: false, message: 'status is required.' });
    }

    let query = `UPDATE ${table} SET status = ?`;
    const params = [status];
    if (notes !== undefined) { query += ', notes = ?'; params.push(notes); }
    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.execute(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    return res.json({ success: true, message: `Status updated to '${status}'.` });
  } catch (err) {
    console.error('status update error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});