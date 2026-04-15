-- ============================================================
--  MANICKBAG AUTOMOBILES — DATABASE TABLES
--  Database: manickbag_db
-- ============================================================

-- 1. QUOTE REQUESTS
-- Triggered when user clicks "Quote" on any vehicle card
CREATE TABLE IF NOT EXISTS `quote_requests` (
  `id`             INT(11)       NOT NULL AUTO_INCREMENT,
  `vehicle_name`   VARCHAR(100)  NOT NULL,              -- e.g. "Nexon EV"
  `full_name`      VARCHAR(150)  NOT NULL,
  `mobile`         VARCHAR(15)   NOT NULL,
  `email`          VARCHAR(150)  DEFAULT NULL,
  `city`           VARCHAR(100)  DEFAULT NULL,
  `fuel_type`      VARCHAR(50)   DEFAULT NULL,          -- Petrol / Diesel / Electric / iCNG
  `message`        TEXT          DEFAULT NULL,
  `status`         ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
  `created_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_vehicle`    (`vehicle_name`),
  INDEX `idx_mobile`     (`mobile`),
  INDEX `idx_status`     (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. CONTACT US
-- Triggered from the "Contact Us" button in the Hero section
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `full_name`   VARCHAR(150) NOT NULL,
  `mobile`      VARCHAR(15)  NOT NULL,
  `email`       VARCHAR(150) DEFAULT NULL,
  `subject`     VARCHAR(200) DEFAULT NULL,
  `message`     TEXT         NOT NULL,
  `source_page` VARCHAR(100) DEFAULT 'home',            -- which page they came from
  `status`      ENUM('new','read','replied','closed') NOT NULL DEFAULT 'new',
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_mobile`     (`mobile`),
  INDEX `idx_status`     (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. TEST DRIVE BOOKINGS
-- Triggered from "Book Test Drive" button in Navbar & CTA section
CREATE TABLE IF NOT EXISTS `test_drive_bookings` (
  `id`              INT(11)      NOT NULL AUTO_INCREMENT,
  `full_name`       VARCHAR(150) NOT NULL,
  `mobile`          VARCHAR(15)  NOT NULL,
  `email`           VARCHAR(150) DEFAULT NULL,
  `vehicle_name`    VARCHAR(100) NOT NULL,              -- e.g. "Nexon EV"
  `fuel_type`       VARCHAR(50)  DEFAULT NULL,
  `preferred_date`  DATE         NOT NULL,
  `preferred_time`  VARCHAR(30)  DEFAULT NULL,          -- e.g. "10:00 AM"
  `showroom_city`   VARCHAR(100) NOT NULL,              -- Belgaum / Hubli / Dharwad etc.
  `showroom_branch` VARCHAR(150) DEFAULT NULL,          -- e.g. "3'S Belgaum"
  `message`         TEXT         DEFAULT NULL,
  `status`          ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_vehicle`    (`vehicle_name`),
  INDEX `idx_mobile`     (`mobile`),
  INDEX `idx_date`       (`preferred_date`),
  INDEX `idx_showroom`   (`showroom_city`),
  INDEX `idx_status`     (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE amc_enquiries (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(120)  NOT NULL,
    phone            VARCHAR(15)   NOT NULL,
    email            VARCHAR(120)  DEFAULT NULL,
    city             VARCHAR(80)   DEFAULT NULL,
    vehicle_model    VARCHAR(100)  DEFAULT NULL,
    registration_no  VARCHAR(30)   DEFAULT NULL,
    plan_type        ENUM('gold','silver','protect_plus','p2p') NOT NULL DEFAULT 'gold',
    plan_name        VARCHAR(100)  DEFAULT NULL,
    message          TEXT          DEFAULT NULL,
    status           ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  Tata Accessories Enquiry Tables
--  Place this file in: public_html/backend/sql/
--  Run via phpMyAdmin or MySQL CLI
-- ============================================================

-- 1. Main enquiry table
CREATE TABLE IF NOT EXISTS `accessories_enquiries` (
  `id`            INT(11)       NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(100)  NOT NULL,
  `phone`         VARCHAR(15)   NOT NULL,
  `email`         VARCHAR(150)  NOT NULL,
  `total_items`   INT(5)        NOT NULL DEFAULT 0,
  `status`        ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Enquiry items table (one row per accessory)
CREATE TABLE IF NOT EXISTS `accessories_enquiry_items` (
  `id`            INT(11)       NOT NULL AUTO_INCREMENT,
  `enquiry_id`    INT(11)       NOT NULL,
  `model_id`      VARCHAR(50)   NOT NULL,
  `model_name`    VARCHAR(100)  NOT NULL,
  `acc_name`      VARCHAR(150)  NOT NULL,
  `acc_category`  VARCHAR(50)   NOT NULL,
  `acc_tag`       VARCHAR(50)   NOT NULL,
  `is_ev`         TINYINT(1)    NOT NULL DEFAULT 0,
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_enquiry_id` (`enquiry_id`),
  CONSTRAINT `fk_enquiry_items`
    FOREIGN KEY (`enquiry_id`)
    REFERENCES `accessories_enquiries`(`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE corporate_enquiries (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    company          VARCHAR(150)  NOT NULL,
    name             VARCHAR(120)  NOT NULL,
    phone            VARCHAR(15)   NOT NULL,
    email            VARCHAR(120)  DEFAULT NULL,
    gst              VARCHAR(20)   DEFAULT NULL,
    fleet_size       ENUM('1-4','5-9','10-24','25+') NOT NULL,
    city             VARCHAR(80)   DEFAULT NULL,
    selected_models  TEXT          DEFAULT NULL,  -- comma-separated model names
    status           ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  Tata Current Offers Enquiry Table
--  Place: public_html/backend/sql/offers_enquiry.sql
--  Run once in phpMyAdmin or MySQL CLI
-- ============================================================

CREATE TABLE IF NOT EXISTS `offers_enquiries` (
  `id`           INT(11)       NOT NULL AUTO_INCREMENT,
  `name`         VARCHAR(100)  NOT NULL,
  `phone`        VARCHAR(15)   NOT NULL,
  `email`        VARCHAR(150)  NOT NULL,
  `offer_id`     INT(11)       NOT NULL,
  `offer_model`  VARCHAR(100)  NOT NULL,
  `offer_headline` VARCHAR(200) NOT NULL,
  `enquiry_type` ENUM('claim','know_more') NOT NULL DEFAULT 'claim',
  `status`       ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  `created_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_offer_id`  (`offer_id`),
  INDEX `idx_phone`     (`phone`),
  INDEX `idx_status`    (`status`),
  INDEX `idx_type`      (`enquiry_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE ew_enquiries (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(120)  NOT NULL,
    phone            VARCHAR(15)   NOT NULL,
    email            VARCHAR(120)  DEFAULT NULL,
    city             VARCHAR(80)   DEFAULT NULL,
    vehicle_model    VARCHAR(100)  DEFAULT NULL,
    registration_no  VARCHAR(30)   DEFAULT NULL,
    message          TEXT          DEFAULT NULL,
    plan_name        VARCHAR(100)  DEFAULT NULL,
    enquiry_type     ENUM('general','plan_quote') NOT NULL DEFAULT 'general',
    status           ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exchange_enquiries (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120)  NOT NULL,
    phone       VARCHAR(15)   NOT NULL,
    old_brand   VARCHAR(80)   NOT NULL,
    old_model   VARCHAR(100)  NOT NULL,
    old_year    VARCHAR(10)   DEFAULT NULL,
    old_km      VARCHAR(30)   DEFAULT NULL,
    new_model   VARCHAR(100)  DEFAULT NULL,
    city        VARCHAR(80)   DEFAULT NULL,
    status      ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  MANICKBAG — FASTag Enquiry Table
--  Run this in phpMyAdmin or MySQL CLI
-- ============================================================

CREATE TABLE IF NOT EXISTS `fastag_enquiries` (
  `id`           INT(11)      NOT NULL AUTO_INCREMENT,
  `full_name`    VARCHAR(150) NOT NULL,
  `mobile`       VARCHAR(15)  NOT NULL,
  `reg_no`       VARCHAR(20)  NOT NULL,       -- Vehicle Registration No e.g. KA-01-AB-1234
  `vehicle`      VARCHAR(100) DEFAULT NULL,   -- Vehicle model e.g. Tata Nexon
  `status`       ENUM('new','contacted','completed','cancelled') NOT NULL DEFAULT 'new',
  `created_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_mobile`     (`mobile`),
  INDEX `idx_reg_no`     (`reg_no`),
  INDEX `idx_status`     (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  MANICKBAG — Loan Enquiry Table
--  Run this in phpMyAdmin or MySQL CLI
-- ============================================================

CREATE TABLE IF NOT EXISTS `loan_enquiries` (
  `id`               INT(11)      NOT NULL AUTO_INCREMENT,
  `full_name`        VARCHAR(150) NOT NULL,
  `mobile`           VARCHAR(15)  NOT NULL,
  `email`            VARCHAR(150) DEFAULT NULL,
  `city`             VARCHAR(100) DEFAULT NULL,
  `vehicle`          VARCHAR(100) NOT NULL,
  `loan_amount`      VARCHAR(50)  NOT NULL,          -- e.g. "₹5–8 Lakh"
  `employment_type`  VARCHAR(80)  DEFAULT NULL,       -- e.g. "Salaried — Private"
  `message`          TEXT         DEFAULT NULL,
  `status`           ENUM('new','called','in_process','approved','rejected','closed')
                     NOT NULL DEFAULT 'new',
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_mobile`     (`mobile`),
  INDEX `idx_vehicle`    (`vehicle`),
  INDEX `idx_status`     (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE finance_enquiries (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(120)  NOT NULL,
    phone         VARCHAR(15)   NOT NULL,
    email         VARCHAR(120)  DEFAULT NULL,
    city          VARCHAR(80)   DEFAULT NULL,
    vehicle_model VARCHAR(100)  DEFAULT NULL,
    employment    VARCHAR(80)   DEFAULT NULL,
    income        VARCHAR(50)   DEFAULT NULL,
    scheme_id     VARCHAR(30)   DEFAULT NULL,
    scheme_name   VARCHAR(120)  DEFAULT NULL,
    message       TEXT          DEFAULT NULL,
    enquiry_type  ENUM('scheme_apply','pre_approval') NOT NULL DEFAULT 'pre_approval',
    status        ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
--  Tata Insurance Enquiry Table
--  Place: public_html/backend/sql/insurance_enquiry.sql
--  Run once in phpMyAdmin or MySQL CLI
-- ============================================================

CREATE TABLE IF NOT EXISTS `insurance_enquiries` (
  `id`              INT(11)       NOT NULL AUTO_INCREMENT,
  `name`            VARCHAR(100)  NOT NULL,
  `phone`           VARCHAR(15)   NOT NULL,
  `email`           VARCHAR(150)  NOT NULL,
  `enquiry_type`    ENUM('new','renew') NOT NULL DEFAULT 'new',
  `plan_selected`   VARCHAR(100)  NOT NULL DEFAULT '',
  -- New Insurance fields
  `chassis_no`      VARCHAR(50)   DEFAULT NULL,
  -- Renewal fields
  `old_policy_no`   VARCHAR(80)   DEFAULT NULL,
  -- Common vehicle fields
  `vehicle_number`  VARCHAR(20)   DEFAULT NULL,
  `vehicle_model`   VARCHAR(100)  NOT NULL,
  `message`         TEXT          DEFAULT NULL,
  `status`          ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  `created_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_phone`        (`phone`),
  INDEX `idx_type`         (`enquiry_type`),
  INDEX `idx_status`       (`status`),
  INDEX `idx_plan`         (`plan_selected`(50))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  Tata Service Booking Tables
--  Place: public_html/backend/sql/service_booking.sql
--  Run once in phpMyAdmin or MySQL CLI
-- ============================================================

-- 1. Main service bookings table (for the appointment booking form)
CREATE TABLE IF NOT EXISTS `service_bookings` (
  `id`              INT(11)       NOT NULL AUTO_INCREMENT,
  `name`            VARCHAR(100)  NOT NULL,
  `phone`           VARCHAR(15)   NOT NULL,
  `email`           VARCHAR(150)  DEFAULT NULL,
  `reg_no`          VARCHAR(25)   NOT NULL,
  `vehicle_model`   VARCHAR(100)  NOT NULL,
  `service_type`    VARCHAR(50)   NOT NULL,
  `showroom`        VARCHAR(100)  NOT NULL,
  `preferred_date`  DATE          NOT NULL,
  `preferred_time`  VARCHAR(20)   NOT NULL,
  `issues`          TEXT          DEFAULT NULL,
  `booking_source`  ENUM('appointment','package') NOT NULL DEFAULT 'appointment',
  `status`          ENUM('new','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'new',
  `created_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_phone`          (`phone`),
  INDEX `idx_reg_no`         (`reg_no`),
  INDEX `idx_service_type`   (`service_type`),
  INDEX `idx_status`         (`status`),
  INDEX `idx_preferred_date` (`preferred_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. Package bookings table (for the "Book This" popup on service packages)
CREATE TABLE IF NOT EXISTS `package_bookings` (
  `id`              INT(11)       NOT NULL AUTO_INCREMENT,
  `name`            VARCHAR(100)  NOT NULL,
  `phone`           VARCHAR(15)   NOT NULL,
  `email`           VARCHAR(150)  DEFAULT NULL,
  `address`         VARCHAR(255)  DEFAULT NULL,
  `vehicle_model`   VARCHAR(100)  NOT NULL,
  `variant`         VARCHAR(80)   DEFAULT NULL,
  `mfg_year`        YEAR          DEFAULT NULL,
  `vehicle_number`  VARCHAR(25)   NOT NULL,
  `current_kms`     VARCHAR(30)   NOT NULL,
  `package_km`      VARCHAR(30)   NOT NULL,   -- e.g. "10,000 km"
  `package_label`   VARCHAR(80)   NOT NULL,   -- e.g. "2nd Service"
  `package_price`   VARCHAR(30)   NOT NULL,   -- e.g. "From ₹1,800"
  `status`          ENUM('new','confirmed','completed','cancelled') NOT NULL DEFAULT 'new',
  `created_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_phone`          (`phone`),
  INDEX `idx_vehicle_number` (`vehicle_number`),
  INDEX `idx_package_label`  (`package_label`(50)),
  INDEX `idx_status`         (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE showroom_enquiries (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(120)  NOT NULL,
    phone          VARCHAR(15)   NOT NULL,
    email          VARCHAR(120)  DEFAULT NULL,
    city           VARCHAR(80)   DEFAULT NULL,
    vehicle_model  VARCHAR(100)  DEFAULT NULL,
    preferred_date DATE          DEFAULT NULL,
    preferred_time VARCHAR(20)   DEFAULT NULL,
    message        TEXT          DEFAULT NULL,
    outlet_name    VARCHAR(120)  DEFAULT NULL,
    outlet_city    VARCHAR(80)   DEFAULT NULL,
    enquiry_type   VARCHAR(80)   DEFAULT 'General Enquiry',
    status         ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vas_enquiries (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(120)  NOT NULL,
    phone            VARCHAR(15)   NOT NULL,
    email            VARCHAR(120)  DEFAULT NULL,
    city             VARCHAR(80)   DEFAULT NULL,
    vehicle_model    VARCHAR(100)  DEFAULT NULL,
    registration_no  VARCHAR(30)   DEFAULT NULL,
    service_name     VARCHAR(150)  DEFAULT NULL,
    category_name    VARCHAR(80)   DEFAULT NULL,
    preferred_date   DATE          DEFAULT NULL,
    message          TEXT          DEFAULT NULL,
    status           ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rsa_enquiries (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(120)  NOT NULL,
    phone            VARCHAR(15)   NOT NULL,
    email            VARCHAR(120)  DEFAULT NULL,
    city             VARCHAR(80)   DEFAULT NULL,
    vehicle_model    VARCHAR(100)  DEFAULT NULL,
    registration_no  VARCHAR(30)   DEFAULT NULL,
    message          TEXT          DEFAULT NULL,
    plan_name        VARCHAR(100)  DEFAULT NULL,
    status           ENUM('new','contacted','converted','closed') NOT NULL DEFAULT 'new',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);