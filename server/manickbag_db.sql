-- ============================================================
--  MANICKBAG AUTOMOBILES — Complete Database Schema
--  File   : manickbag_db.sql
--  Engine : MySQL 8.0+
--  Run    : mysql -u root -p < manickbag_db.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS manickbag_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE manickbag_db;

-- ============================================================
--  1. FINANCE LOAN ENQUIRIES
--     Source : Finance.jsx → POST /api/finance/enquiry
-- ============================================================
CREATE TABLE IF NOT EXISTS finance_enquiries (
  id               INT            NOT NULL AUTO_INCREMENT,

  -- Contact
  name             VARCHAR(120)   NOT NULL,
  phone            VARCHAR(15)    NOT NULL,
  email            VARCHAR(180)       NULL,
  city             VARCHAR(80)        NULL,

  -- Loan details
  vehicle_model    VARCHAR(80)        NULL  COMMENT 'e.g. Nexon EV, Safari',
  loan_amount      VARCHAR(50)        NULL  COMMENT 'Range e.g. ₹5–8 Lakh',
  employment_type  VARCHAR(80)        NULL  COMMENT 'Salaried / Self-Employed / Farmer',
  message          TEXT               NULL,

  -- Status tracking
  status           ENUM('new','contacted','processing','approved','rejected','closed')
                   NOT NULL DEFAULT 'new',
  assigned_to      VARCHAR(100)       NULL  COMMENT 'Finance advisor name',
  remarks          TEXT               NULL  COMMENT 'Internal notes',

  -- Meta
  source           VARCHAR(40)    NOT NULL DEFAULT 'website',
  ip_address       VARCHAR(45)        NULL,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_phone    (phone),
  INDEX idx_status   (status),
  INDEX idx_created  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Finance loan enquiries from website';


-- ============================================================
--  2. EXTENDED WARRANTY (EW) ENQUIRIES
--     Source : EW.jsx → POST /api/ew/enquiry
-- ============================================================
CREATE TABLE IF NOT EXISTS ew_enquiries (
  id               INT            NOT NULL AUTO_INCREMENT,

  -- Contact
  name             VARCHAR(120)   NOT NULL,
  phone            VARCHAR(15)    NOT NULL,
  email            VARCHAR(180)       NULL,
  city             VARCHAR(80)        NULL,

  -- Vehicle & plan
  vehicle_model    VARCHAR(80)        NULL,
  registration_no  VARCHAR(20)        NULL  COMMENT 'Vehicle Reg. Number',
  purchase_year    YEAR               NULL  COMMENT 'Year vehicle was purchased',
  plan_selected    ENUM('1_year','2_year','not_sure')
                   NOT NULL DEFAULT 'not_sure',
  current_warranty_expiry DATE        NULL,

  message          TEXT               NULL,

  -- Status
  status           ENUM('new','contacted','quote_sent','converted','closed')
                   NOT NULL DEFAULT 'new',
  assigned_to      VARCHAR(100)       NULL,
  remarks          TEXT               NULL,

  -- Meta
  source           VARCHAR(40)    NOT NULL DEFAULT 'website',
  ip_address       VARCHAR(45)        NULL,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_phone   (phone),
  INDEX idx_status  (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Extended Warranty enquiries from website';


-- ============================================================
--  3. AMC (ANNUAL MAINTENANCE CONTRACT) ENQUIRIES
--     Source : AMC.jsx → POST /api/amc/enquiry
-- ============================================================
CREATE TABLE IF NOT EXISTS amc_enquiries (
  id               INT            NOT NULL AUTO_INCREMENT,

  -- Contact
  name             VARCHAR(120)   NOT NULL,
  phone            VARCHAR(15)    NOT NULL,
  email            VARCHAR(180)       NULL,
  city             VARCHAR(80)        NULL,

  -- Vehicle & plan
  vehicle_model    VARCHAR(80)        NULL,
  registration_no  VARCHAR(20)        NULL,
  current_kms      INT                NULL  COMMENT 'Current odometer reading',
  plan_type        ENUM('gold','silver','protect_plus','p2p','not_sure')
                   NOT NULL DEFAULT 'not_sure',
  duration_years   TINYINT            NULL  COMMENT '1 / 2 / 3 / 4 years',

  message          TEXT               NULL,

  -- Status
  status           ENUM('new','contacted','quote_sent','converted','closed')
                   NOT NULL DEFAULT 'new',
  assigned_to      VARCHAR(100)       NULL,
  remarks          TEXT               NULL,

  -- Meta
  source           VARCHAR(40)    NOT NULL DEFAULT 'website',
  ip_address       VARCHAR(45)        NULL,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_phone      (phone),
  INDEX idx_plan_type  (plan_type),
  INDEX idx_status     (status),
  INDEX idx_created    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='AMC Value Care enquiries from website';


-- ============================================================
--  4. RSA (ROAD SIDE ASSISTANCE) ENQUIRIES
--     Source : RSA.jsx → POST /api/rsa/enquiry
-- ============================================================
CREATE TABLE IF NOT EXISTS rsa_enquiries (
  id               INT            NOT NULL AUTO_INCREMENT,

  -- Contact
  name             VARCHAR(120)   NOT NULL,
  phone            VARCHAR(15)    NOT NULL,
  email            VARCHAR(180)       NULL,
  city             VARCHAR(80)        NULL,

  -- Vehicle & plan
  vehicle_model    VARCHAR(80)        NULL,
  registration_no  VARCHAR(20)        NULL,
  plan_type        ENUM('within_warranty','premium','standard','not_sure')
                   NOT NULL DEFAULT 'not_sure',

  message          TEXT               NULL,

  -- Status
  status           ENUM('new','contacted','activated','closed')
                   NOT NULL DEFAULT 'new',
  assigned_to      VARCHAR(100)       NULL,
  remarks          TEXT               NULL,

  -- Meta
  source           VARCHAR(40)    NOT NULL DEFAULT 'website',
  ip_address       VARCHAR(45)        NULL,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_phone   (phone),
  INDEX idx_status  (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Roadside Assistance enquiries from website';


-- ============================================================
--  5. VAS (VALUE ADDED SERVICES) ENQUIRIES
--     Source : VAS.jsx → POST /api/vas/enquiry
-- ============================================================
CREATE TABLE IF NOT EXISTS vas_enquiries (
  id               INT            NOT NULL AUTO_INCREMENT,

  -- Contact
  name             VARCHAR(120)   NOT NULL,
  phone            VARCHAR(15)    NOT NULL,
  email            VARCHAR(180)       NULL,
  city             VARCHAR(80)        NULL,

  -- Vehicle & service
  vehicle_model    VARCHAR(80)        NULL,
  registration_no  VARCHAR(20)        NULL,
  service_category VARCHAR(60)        NULL  COMMENT 'anti-rust / detailing / engine / bodyshop',
  service_name     VARCHAR(120)       NULL  COMMENT 'Specific service requested',
  preferred_date   DATE               NULL,

  message          TEXT               NULL,

  -- Status
  status           ENUM('new','contacted','booked','completed','closed')
                   NOT NULL DEFAULT 'new',
  assigned_to      VARCHAR(100)       NULL,
  remarks          TEXT               NULL,

  -- Meta
  source           VARCHAR(40)    NOT NULL DEFAULT 'website',
  ip_address       VARCHAR(45)        NULL,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_phone            (phone),
  INDEX idx_service_category (service_category),
  INDEX idx_status           (status),
  INDEX idx_created          (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Value Added Services enquiries from website';


-- ============================================================
--  6. TEST DRIVE BOOKINGS  (bonus — from navbar button)
--     Source : Any page → POST /api/testdrive/book
-- ============================================================
CREATE TABLE IF NOT EXISTS test_drive_bookings (
  id               INT            NOT NULL AUTO_INCREMENT,

  name             VARCHAR(120)   NOT NULL,
  phone            VARCHAR(15)    NOT NULL,
  email            VARCHAR(180)       NULL,
  city             VARCHAR(80)        NULL,
  vehicle_model    VARCHAR(80)        NULL,
  preferred_date   DATE               NULL,
  preferred_time   VARCHAR(30)        NULL  COMMENT 'e.g. Morning / Afternoon / Evening',
  showroom         VARCHAR(100)       NULL,
  message          TEXT               NULL,

  status           ENUM('new','confirmed','completed','cancelled')
                   NOT NULL DEFAULT 'new',
  assigned_to      VARCHAR(100)       NULL,
  remarks          TEXT               NULL,

  source           VARCHAR(40)    NOT NULL DEFAULT 'website',
  ip_address       VARCHAR(45)        NULL,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_phone   (phone),
  INDEX idx_status  (status),
  INDEX idx_date    (preferred_date),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Test drive booking requests from website';


-- ============================================================
--  7. ADMIN USERS  (to manage enquiries)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id           INT          NOT NULL AUTO_INCREMENT,
  username     VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name    VARCHAR(120) NOT NULL,
  role         ENUM('super_admin','admin','finance_advisor','service_advisor')
               NOT NULL DEFAULT 'admin',
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  last_login   DATETIME         NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin (password: Admin@1234  — change immediately)
INSERT IGNORE INTO admin_users (username, password_hash, full_name, role)
VALUES (
  'admin',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt of "Admin@1234"
  'Manickbag Admin',
  'super_admin'
);


-- ============================================================
--  VIEWS — quick summary per table
-- ============================================================

CREATE OR REPLACE VIEW v_enquiry_summary AS
SELECT
  'Finance'    AS enquiry_type,
  COUNT(*)     AS total,
  SUM(status = 'new')         AS pending,
  SUM(status = 'contacted')   AS in_progress,
  SUM(status IN ('approved','converted','activated','booked','completed')) AS converted
FROM finance_enquiries
UNION ALL
SELECT 'EW',      COUNT(*), SUM(status='new'), SUM(status='contacted'), SUM(status IN ('converted')) FROM ew_enquiries
UNION ALL
SELECT 'AMC',     COUNT(*), SUM(status='new'), SUM(status='contacted'), SUM(status IN ('converted')) FROM amc_enquiries
UNION ALL
SELECT 'RSA',     COUNT(*), SUM(status='new'), SUM(status='contacted'), SUM(status IN ('activated')) FROM rsa_enquiries
UNION ALL
SELECT 'VAS',     COUNT(*), SUM(status='new'), SUM(status='contacted'), SUM(status IN ('booked','completed')) FROM vas_enquiries
UNION ALL
SELECT 'TestDrive', COUNT(*), SUM(status='new'), SUM(status='confirmed'), SUM(status='completed') FROM test_drive_bookings;


-- ============================================================
--  Done ✅
-- ============================================================
SELECT 'manickbag_db created successfully ✅' AS result;

-- ================================================================
-- MANICKBAG AUTOMOBILES — DATABASE ADDITIONS
-- Run this file AFTER your existing manickbag_db.sql
-- Adds 6 new tables for Offers, Exchange, Service, FASTag,
-- Insurance, Accessories + updates the summary view
-- ================================================================

USE manickbag_db;

-- ----------------------------------------------------------------
-- 1. OFFER ENQUIRIES  (CurrentOffers.jsx — "Claim Offer" button)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offer_enquiries (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  offer_id        INT            NOT NULL,
  model_name      VARCHAR(100)   NOT NULL,
  offer_headline  VARCHAR(255)   NOT NULL,
  offer_category  VARCHAR(50)    NOT NULL,          -- ev, suv, hatch, sedan, festive
  valid_till      VARCHAR(50)    DEFAULT NULL,
  name            VARCHAR(150)   DEFAULT NULL,
  phone           VARCHAR(20)    DEFAULT NULL,
  status          ENUM('new','contacted','converted','closed') DEFAULT 'new',
  notes           TEXT           DEFAULT NULL,
  created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_model     (model_name),
  INDEX idx_status    (status),
  INDEX idx_category  (offer_category),
  INDEX idx_created   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------
-- 2. CORPORATE ENQUIRIES  (CorporateDeals.jsx — Fleet Enquiry Form)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS corporate_enquiries (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  company_name      VARCHAR(255)  NOT NULL,
  contact_name      VARCHAR(150)  NOT NULL,
  phone             VARCHAR(20)   NOT NULL,
  email             VARCHAR(255)  DEFAULT NULL,
  gst_number        VARCHAR(20)   DEFAULT NULL,
  fleet_size        VARCHAR(20)   NOT NULL,          -- 1-4, 5-9, 10-24, 25+
  models_interested JSON          DEFAULT NULL,      -- array of model names selected
  city              VARCHAR(100)  DEFAULT NULL,
  status            ENUM('new','contacted','quoted','converted','closed') DEFAULT 'new',
  assigned_to       VARCHAR(150)  DEFAULT NULL,
  notes             TEXT          DEFAULT NULL,
  created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_company  (company_name),
  INDEX idx_fleet    (fleet_size),
  INDEX idx_status   (status),
  INDEX idx_city     (city),
  INDEX idx_created  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------
-- 3. EXCHANGE ENQUIRIES  (ExchangeBonus.jsx — Valuation Form)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exchange_enquiries (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)  NOT NULL,
  phone           VARCHAR(20)   NOT NULL,
  old_brand       VARCHAR(100)  NOT NULL,
  old_model       VARCHAR(150)  NOT NULL,
  old_year        VARCHAR(10)   DEFAULT NULL,
  old_km          VARCHAR(50)   DEFAULT NULL,
  new_model       VARCHAR(100)  DEFAULT NULL,        -- Tata model they want
  city            VARCHAR(100)  DEFAULT NULL,
  exchange_bonus  VARCHAR(50)   DEFAULT NULL,        -- bonus applicable for chosen model
  status          ENUM('new','valuation_pending','valued','converted','closed') DEFAULT 'new',
  valuation_amount DECIMAL(10,2) DEFAULT NULL,       -- filled by team after visit
  notes           TEXT          DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_old_brand  (old_brand),
  INDEX idx_new_model  (new_model),
  INDEX idx_status     (status),
  INDEX idx_city       (city),
  INDEX idx_created    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------
-- 4. FINANCE APPLICATIONS  (FinanceSchemes.jsx — Pre-Approval Form)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS finance_applications (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(150)  NOT NULL,
  phone             VARCHAR(20)   NOT NULL,
  employment_type   ENUM('salaried','govt','selfemployed','professional','farmer') NOT NULL,
  income_range      VARCHAR(50)   DEFAULT NULL,      -- 15-25k, 25-50k, 50-100k, 100k+
  vehicle_interest  VARCHAR(100)  DEFAULT NULL,
  scheme_interest   VARCHAR(100)  DEFAULT NULL,      -- low-emi, zero-dp, zero-cost, etc.
  city              VARCHAR(100)  DEFAULT NULL,
  loan_amount       DECIMAL(12,2) DEFAULT NULL,      -- from EMI calculator if captured
  tenure_months     INT           DEFAULT NULL,
  status            ENUM('new','documents_requested','processing','approved','rejected','closed') DEFAULT 'new',
  bank_assigned     VARCHAR(100)  DEFAULT NULL,
  approved_rate     DECIMAL(5,2)  DEFAULT NULL,
  notes             TEXT          DEFAULT NULL,
  created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_employment (employment_type),
  INDEX idx_vehicle    (vehicle_interest),
  INDEX idx_status     (status),
  INDEX idx_city       (city),
  INDEX idx_created    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------
-- 5. SERVICE BOOKINGS  (Service.jsx — 2-Step Booking Form)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_bookings (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)  NOT NULL,
  phone           VARCHAR(20)   NOT NULL,
  reg_number      VARCHAR(30)   NOT NULL,
  vehicle_model   VARCHAR(100)  NOT NULL,
  service_type    ENUM('periodic','repair','bodyshop','wheel','electrical','doorstep') NOT NULL,
  showroom        VARCHAR(200)  NOT NULL,
  appointment_date DATE         NOT NULL,
  appointment_time VARCHAR(20)  NOT NULL,
  issues_desc     TEXT          DEFAULT NULL,
  status          ENUM('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
  advisor_name    VARCHAR(150)  DEFAULT NULL,
  job_card_no     VARCHAR(50)   DEFAULT NULL,
  estimated_cost  DECIMAL(10,2) DEFAULT NULL,
  actual_cost     DECIMAL(10,2) DEFAULT NULL,
  notes           TEXT          DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone        (phone),
  INDEX idx_reg          (reg_number),
  INDEX idx_service_type (service_type),
  INDEX idx_showroom     (showroom),
  INDEX idx_date         (appointment_date),
  INDEX idx_status       (status),
  INDEX idx_created      (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------
-- 6. FASTAG ENQUIRIES  (FASTag.jsx — Application Form)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fastag_enquiries (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)  NOT NULL,
  phone           VARCHAR(20)   NOT NULL,
  reg_number      VARCHAR(30)   NOT NULL,
  vehicle_model   VARCHAR(100)  DEFAULT NULL,
  showroom_city   VARCHAR(100)  DEFAULT NULL,
  is_new_vehicle  TINYINT(1)    DEFAULT 0,           -- 1 if new delivery, 0 if existing
  status          ENUM('new','appointment_scheduled','completed','cancelled') DEFAULT 'new',
  appointment_date DATE         DEFAULT NULL,
  notes           TEXT          DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone   (phone),
  INDEX idx_reg     (reg_number),
  INDEX idx_status  (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------
-- 7. INSURANCE ENQUIRIES  (Insurance.jsx — Quote / Renew)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS insurance_enquiries (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)  DEFAULT NULL,
  phone           VARCHAR(20)   NOT NULL,
  vehicle_model   VARCHAR(100)  DEFAULT NULL,
  reg_number      VARCHAR(30)   DEFAULT NULL,
  enquiry_type    ENUM('new','renewal') NOT NULL DEFAULT 'new',
  plan_type       ENUM('third_party','comprehensive','zero_dep') DEFAULT 'comprehensive',
  insurer_pref    VARCHAR(100)  DEFAULT NULL,
  status          ENUM('new','quote_sent','policy_issued','closed') DEFAULT 'new',
  policy_number   VARCHAR(100)  DEFAULT NULL,
  premium_amount  DECIMAL(10,2) DEFAULT NULL,
  notes           TEXT          DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone        (phone),
  INDEX idx_enquiry_type (enquiry_type),
  INDEX idx_plan         (plan_type),
  INDEX idx_status       (status),
  INDEX idx_created      (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------
-- 8. ACCESSORY ENQUIRIES  (Accessories.jsx — Cart / Enquire)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accessory_enquiries (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)  DEFAULT NULL,
  phone           VARCHAR(20)   DEFAULT NULL,
  vehicle_model   VARCHAR(100)  DEFAULT NULL,
  items_selected  JSON          NOT NULL,            -- [{id, name, price, category}]
  total_items     INT           DEFAULT 0,
  showroom_city   VARCHAR(100)  DEFAULT NULL,
  status          ENUM('new','quote_sent','ordered','delivered','cancelled') DEFAULT 'new',
  notes           TEXT          DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone   (phone),
  INDEX idx_status  (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------
-- 9. VAS BOOKINGS  (VAS.jsx — Book Now per service)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vas_bookings (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150)  DEFAULT NULL,
  phone           VARCHAR(20)   DEFAULT NULL,
  vehicle_model   VARCHAR(100)  DEFAULT NULL,
  reg_number      VARCHAR(30)   DEFAULT NULL,
  services        JSON          NOT NULL,            -- array of service IDs selected
  showroom_city   VARCHAR(100)  DEFAULT NULL,
  preferred_date  DATE          DEFAULT NULL,
  status          ENUM('new','confirmed','in_progress','completed','cancelled') DEFAULT 'new',
  estimated_cost  DECIMAL(10,2) DEFAULT NULL,
  notes           TEXT          DEFAULT NULL,
  created_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone   (phone),
  INDEX idx_status  (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ================================================================
-- UPDATED SUMMARY VIEW — replaces existing v_enquiry_summary
-- ================================================================
DROP VIEW IF EXISTS v_enquiry_summary;

CREATE VIEW v_enquiry_summary AS
  SELECT 'finance_enquiries'    AS source, id, name, phone, status, created_at FROM finance_enquiries
  UNION ALL
  SELECT 'ew_enquiries',          id, name, phone, status, created_at FROM ew_enquiries
  UNION ALL
  SELECT 'amc_enquiries',         id, name, phone, status, created_at FROM amc_enquiries
  UNION ALL
  SELECT 'rsa_enquiries',         id, name, phone, status, created_at FROM rsa_enquiries
  UNION ALL
  SELECT 'vas_enquiries',         id, name, phone, status, created_at FROM vas_enquiries
  UNION ALL
  SELECT 'test_drive_bookings',   id, name, phone, status, created_at FROM test_drive_bookings
  UNION ALL
  SELECT 'offer_enquiries',       id, name, phone, status, created_at FROM offer_enquiries
  UNION ALL
  SELECT 'corporate_enquiries',   id, contact_name, phone, status, created_at FROM corporate_enquiries
  UNION ALL
  SELECT 'exchange_enquiries',    id, name, phone, status, created_at FROM exchange_enquiries
  UNION ALL
  SELECT 'finance_applications',  id, name, phone, status, created_at FROM finance_applications
  UNION ALL
  SELECT 'service_bookings',      id, name, phone, status, created_at FROM service_bookings
  UNION ALL
  SELECT 'fastag_enquiries',      id, name, phone, status, created_at FROM fastag_enquiries
  UNION ALL
  SELECT 'insurance_enquiries',   id, name, phone, status, created_at FROM insurance_enquiries
  UNION ALL
  SELECT 'accessory_enquiries',   id, name, phone, status, created_at FROM accessory_enquiries
  UNION ALL
  SELECT 'vas_bookings',          id, name, phone, status, created_at FROM vas_bookings;


-- ================================================================
-- QUICK STATS VIEW — useful for admin dashboard
-- ================================================================
CREATE OR REPLACE VIEW v_daily_stats AS
  SELECT
    source,
    COUNT(*) AS total,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS pending,
    SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS today,
    SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS this_week
  FROM v_enquiry_summary
  GROUP BY source
  ORDER BY today DESC;