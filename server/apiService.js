// ============================================================
//  MANICKBAG AUTOMOBILES — Frontend API Service
//  File   : src/services/apiService.js
//  Usage  : import { submitFinanceEnquiry } from "../services/apiService"
// ============================================================

// ─────────────────────────────────────────────
//  CONFIG
//  If using Node.js server → BASE_URL = "http://localhost:5000/api"
//  If using PHP server     → BASE_URL = "http://localhost/manickbag/server/api.php"
// ─────────────────────────────────────────────
const NODE_BASE  = "http://localhost:5000/api";
const PHP_BASE   = "/server/api.php";       // relative path if PHP on same server

// Toggle this to "php" if you're using the PHP backend
const BACKEND = "node";

const BASE_URL = BACKEND === "php" ? PHP_BASE : NODE_BASE;

// ─────────────────────────────────────────────
//  CORE FETCH HELPER
// ─────────────────────────────────────────────
const post = async (endpoint, data) => {
  let url;
  if (BACKEND === "php") {
    // PHP uses ?action= pattern
    url = `${BASE_URL}?action=${endpoint}`;
  } else {
    // Node uses /api/endpoint
    url = `${BASE_URL}/${endpoint}`;
  }

  const res = await fetch(url, {
    method  : "POST",
    headers : { "Content-Type": "application/json" },
    body    : JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "Something went wrong. Please try again.");
  }

  return json;
};


// ─────────────────────────────────────────────
//  1. FINANCE LOAN ENQUIRY
//  Called from: Finance.jsx → handleSubmit
// ─────────────────────────────────────────────
export const submitFinanceEnquiry = (formData) =>
  post("finance/enquiry", formData);
  // PHP equivalent: post("finance", formData)


// ─────────────────────────────────────────────
//  2. EXTENDED WARRANTY ENQUIRY
//  Called from: EW.jsx
// ─────────────────────────────────────────────
export const submitEWEnquiry = (formData) =>
  post("ew/enquiry", formData);


// ─────────────────────────────────────────────
//  3. AMC ENQUIRY
//  Called from: AMC.jsx
// ─────────────────────────────────────────────
export const submitAMCEnquiry = (formData) =>
  post("amc/enquiry", formData);


// ─────────────────────────────────────────────
//  4. RSA ENQUIRY
//  Called from: RSA.jsx
// ─────────────────────────────────────────────
export const submitRSAEnquiry = (formData) =>
  post("rsa/enquiry", formData);


// ─────────────────────────────────────────────
//  5. VAS BOOKING
//  Called from: VAS.jsx
// ─────────────────────────────────────────────
export const submitVASEnquiry = (formData) =>
  post("vas/enquiry", formData);


// ─────────────────────────────────────────────
//  6. TEST DRIVE BOOKING
//  Called from: any page with "Book Test Drive"
// ─────────────────────────────────────────────
export const submitTestDriveBooking = (formData) =>
  post("testdrive/book", formData);

// ─────────────────────────────────────────────
//  7. CONTACT ENQUIRY
// ─────────────────────────────────────────────
export const submitContactEnquiry = (formData) =>
  post("contact/enquiry", formData);

// ─────────────────────────────────────────────
//  HOW TO USE IN Finance.jsx
//  Replace the fake setTimeout in handleSubmit:
// ─────────────────────────────────────────────
/*
import { submitFinanceEnquiry } from "../services/apiService";

const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length) { setErrors(errs); return; }

  setLoading(true);
  try {
    await submitFinanceEnquiry({
      name            : form.name,
      phone           : form.phone,
      email           : form.email,
      city            : form.city,
      vehicle_model   : form.vehicle,
      loan_amount     : form.loanAmount,
      employment_type : form.employmentType,
      message         : form.message,
    });
    setSubmitted(true);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};
*/


// ─────────────────────────────────────────────
//  HOW TO USE IN EW.jsx / AMC.jsx / RSA.jsx / VAS.jsx
//  Same pattern — just call the right function:
// ─────────────────────────────────────────────
/*
import { submitEWEnquiry } from "../services/apiService";

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await submitEWEnquiry({
      name                    : form.name,
      phone                   : form.phone,
      email                   : form.email,
      city                    : form.city,
      vehicle_model           : form.vehicle,
      registration_no         : form.regNo,
      plan_selected           : form.plan,       // "1_year" | "2_year" | "not_sure"
      current_warranty_expiry : form.expiryDate,
      message                 : form.message,
    });
    setSubmitted(true);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};
*/