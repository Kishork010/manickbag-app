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
const NODE_BASE = "http://localhost:5000/api";
const PHP_BASE  = "/server/api.php";       // relative path if PHP on same server

// Toggle this to "php" if you're using the PHP backend
const BACKEND = "node";

const BASE_URL = BACKEND === "php" ? PHP_BASE : NODE_BASE;


// ─────────────────────────────────────────────
//  CORE FETCH HELPERS
// ─────────────────────────────────────────────
const post = async (endpoint, data) => {
  let url;
  if (BACKEND === "php") {
    url = `${BASE_URL}?action=${endpoint}`;
  } else {
    url = `${BASE_URL}/${endpoint}`;
  }

  const res = await fetch(url, {
    method  : "POST",
    headers : { "Content-Type": "application/json" },
    body    : JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || "Something went wrong. Please try again.");
  }
  return json;
};

const get = async (endpoint, params = {}) => {
  let url;
  const query = new URLSearchParams(params).toString();
  if (BACKEND === "php") {
    url = `${BASE_URL}?action=${endpoint}${query ? "&" + query : ""}`;
  } else {
    url = `${BASE_URL}/${endpoint}${query ? "?" + query : ""}`;
  }

  const res  = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || "Something went wrong.");
  }
  return json;
};

const patch = async (endpoint, data) => {
  let url;
  if (BACKEND === "php") {
    url = `${BASE_URL}?action=${endpoint}`;
  } else {
    url = `${BASE_URL}/${endpoint}`;
  }

  const res  = await fetch(url, {
    method  : "PATCH",
    headers : { "Content-Type": "application/json" },
    body    : JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || "Something went wrong.");
  }
  return json;
};


// ================================================================
//  ── EXISTING ENDPOINTS (unchanged) ──────────────────────────────
// ================================================================

// ─────────────────────────────────────────────
//  1. FINANCE LOAN ENQUIRY
//  Called from: Finance.jsx → handleSubmit
// ─────────────────────────────────────────────
export const submitFinanceEnquiry = (formData) =>
  post("finance/enquiry", formData);


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


// ================================================================
//  ── NEW ENDPOINTS ───────────────────────────────────────────────
// ================================================================

// ─────────────────────────────────────────────
//  7. OFFER ENQUIRY
//  Called from: CurrentOffers.jsx → "Claim Offer" button
//
//  Payload:
//  {
//    offer_id       : number,
//    model_name     : string,   e.g. "Nexon EV"
//    offer_headline : string,   e.g. "₹50,000 Cash Benefit"
//    offer_category : string,   e.g. "ev" | "suv" | "hatch" | "sedan" | "festive"
//    valid_till     : string,   e.g. "30 Apr 2026"
//    name           : string,   optional
//    phone          : string,   optional
//  }
// ─────────────────────────────────────────────
export const submitOfferEnquiry = (formData) =>
  post("offer-enquiries", formData);

export const getOfferEnquiries = (params = {}) =>
  get("offer-enquiries", params);


// ─────────────────────────────────────────────
//  8. CORPORATE FLEET ENQUIRY
//  Called from: CorporateDeals.jsx → fleet enquiry form
//
//  Payload:
//  {
//    company_name      : string,   required
//    contact_name      : string,   required
//    phone             : string,   required
//    email             : string,   optional
//    gst_number        : string,   optional
//    fleet_size        : string,   "1-4" | "5-9" | "10-24" | "25+"
//    models_interested : string[], e.g. ["Nexon EV", "Tigor EV"]
//    city              : string,   optional
//  }
// ─────────────────────────────────────────────
export const submitCorporateEnquiry = (formData) =>
  post("corporate-enquiries", formData);

export const getCorporateEnquiries = (params = {}) =>
  get("corporate-enquiries", params);


// ─────────────────────────────────────────────
//  9. EXCHANGE BONUS ENQUIRY
//  Called from: ExchangeBonus.jsx → valuation form
//
//  Payload:
//  {
//    name           : string,   required
//    phone          : string,   required
//    old_brand      : string,   required   e.g. "Maruti Suzuki"
//    old_model      : string,   required   e.g. "Swift"
//    old_year       : string,   optional   e.g. "2019"
//    old_km         : string,   optional   e.g. "45,000 km"
//    new_model      : string,   optional   e.g. "Nexon EV"
//    city           : string,   optional
//    exchange_bonus : string,   optional   e.g. "₹35,000"
//  }
// ─────────────────────────────────────────────
export const submitExchangeEnquiry = (formData) =>
  post("exchange-enquiries", formData);

export const getExchangeEnquiries = (params = {}) =>
  get("exchange-enquiries", params);


// ─────────────────────────────────────────────
//  10. FINANCE PRE-APPROVAL APPLICATION
//  Called from: FinanceSchemes.jsx → pre-approval form
//
//  Payload:
//  {
//    name              : string,   required
//    phone             : string,   required
//    employment_type   : string,   required
//                        "salaried" | "govt" | "selfemployed" | "professional" | "farmer"
//    income_range      : string,   optional  "15-25k" | "25-50k" | "50-100k" | "100k+"
//    vehicle_interest  : string,   optional  e.g. "Nexon EV"
//    scheme_interest   : string,   optional  e.g. "low-emi" | "zero-dp" | "zero-cost"
//    city              : string,   optional
//    loan_amount       : number,   optional  from EMI calculator
//    tenure_months     : number,   optional  from EMI calculator
//  }
// ─────────────────────────────────────────────
export const submitFinanceApplication = (formData) =>
  post("finance-applications", formData);

export const getFinanceApplications = (params = {}) =>
  get("finance-applications", params);


// ─────────────────────────────────────────────
//  11. SERVICE BOOKING
//  Called from: Service.jsx → 2-step booking form
//
//  Payload:
//  {
//    name             : string,   required
//    phone            : string,   required
//    regNo            : string,   required  (sent as reg_number to API)
//    model            : string,   required  (sent as vehicle_model to API)
//    service_type     : string,   required
//                       "periodic"|"repair"|"bodyshop"|"wheel"|"electrical"|"doorstep"
//    showroom         : string,   required
//    date             : string,   required  YYYY-MM-DD
//    time             : string,   required  e.g. "10:00 AM"
//    issues           : string,   optional
//  }
// ─────────────────────────────────────────────
export const submitServiceBooking = (formData) =>
  post("service-bookings", {
    name             : formData.name,
    phone            : formData.phone,
    reg_number       : formData.regNo,        // map regNo → reg_number for API
    vehicle_model    : formData.model,         // map model → vehicle_model for API
    service_type     : formData.service_type,
    showroom         : formData.showroom,
    appointment_date : formData.date,
    appointment_time : formData.time,
    issues_desc      : formData.issues || null,
  });

export const getServiceBookings = (params = {}) =>
  get("service-bookings", params);

// Check available time slots for a showroom + date
export const getServiceSlots = (showroom, date) =>
  get("service-bookings/slots", { showroom, date });


// ─────────────────────────────────────────────
//  12. FASTAG ENQUIRY
//  Called from: FASTag.jsx → application form
//
//  Payload:
//  {
//    name            : string,   required
//    phone           : string,   required
//    reg_number      : string,   required
//    vehicle_model   : string,   optional
//    showroom_city   : string,   optional
//    is_new_vehicle  : boolean,  optional  true if new delivery
//  }
// ─────────────────────────────────────────────
export const submitFastagEnquiry = (formData) =>
  post("fastag-enquiries", formData);

export const getFastagEnquiries = (params = {}) =>
  get("fastag-enquiries", params);


// ─────────────────────────────────────────────
//  13. INSURANCE ENQUIRY
//  Called from: Insurance.jsx → quote / renew button
//
//  Payload:
//  {
//    name          : string,   optional
//    phone         : string,   required
//    vehicle_model : string,   optional
//    reg_number    : string,   optional
//    enquiry_type  : string,   required  "new" | "renewal"
//    plan_type     : string,   optional  "third_party" | "comprehensive" | "zero_dep"
//    insurer_pref  : string,   optional  e.g. "HDFC ERGO"
//  }
// ─────────────────────────────────────────────
export const submitInsuranceEnquiry = (formData) =>
  post("insurance-enquiries", formData);

export const getInsuranceEnquiries = (params = {}) =>
  get("insurance-enquiries", params);


// ─────────────────────────────────────────────
//  14. ACCESSORY ENQUIRY
//  Called from: Accessories.jsx → "Request Quote" button
//
//  Payload:
//  {
//    name           : string,   optional
//    phone          : string,   optional
//    vehicle_model  : string,   optional
//    items_selected : array,    required  [{ id, name, price, category }]
//    showroom_city  : string,   optional
//  }
// ─────────────────────────────────────────────
export const submitAccessoryEnquiry = (formData) =>
  post("accessory-enquiries", formData);

export const getAccessoryEnquiries = (params = {}) =>
  get("accessory-enquiries", params);


// ─────────────────────────────────────────────
//  15. VAS BOOKING (new — from VAS.jsx cards)
//  Called from: VAS.jsx → "Confirm Booking" button
//  (different from existing submitVASEnquiry above)
//
//  Payload:
//  {
//    name           : string,   optional
//    phone          : string,   optional
//    vehicle_model  : string,   optional
//    reg_number     : string,   optional
//    services       : string[], required  e.g. ["rust", "ceramic"]
//    showroom_city  : string,   optional
//    preferred_date : string,   optional  YYYY-MM-DD
//  }
// ─────────────────────────────────────────────
export const submitVASBooking = (formData) =>
  post("vas-bookings", formData);

export const getVASBookings = (params = {}) =>
  get("vas-bookings", params);


// ─────────────────────────────────────────────
//  16. ADMIN — GET STATS DASHBOARD
//  Called from: Admin dashboard
// ─────────────────────────────────────────────
export const getAdminStats = () =>
  get("admin/stats");


// ─────────────────────────────────────────────
//  17. ADMIN — UPDATE STATUS (any table)
//  table  : e.g. "service_bookings" | "exchange_enquiries" | etc.
//  id     : record ID
//  status : new status string
//  notes  : optional notes
// ─────────────────────────────────────────────
export const updateEnquiryStatus = (table, id, status, notes = undefined) =>
  patch(`${table}/${id}/status`, {
    status,
    ...(notes !== undefined && { notes }),
  });


// ================================================================
//  ── USAGE EXAMPLES ──────────────────────────────────────────────
// ================================================================

/*
──────────────────────────────────────────────────────────────────
  Finance.jsx (existing)
──────────────────────────────────────────────────────────────────
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


──────────────────────────────────────────────────────────────────
  CurrentOffers.jsx — inside OfferCard, replace setEnquired(true)
──────────────────────────────────────────────────────────────────
import { submitOfferEnquiry } from "../services/apiService";

const handleClaim = async () => {
  try {
    await submitOfferEnquiry({
      offer_id       : offer.id,
      model_name     : offer.model,
      offer_headline : offer.headline,
      offer_category : offer.category,
      valid_till     : offer.validTill,
    });
    setEnquired(true);
  } catch (err) {
    alert(err.message);
  }
};
// Replace: onClick={() => setEnquired(true)}
// With:    onClick={handleClaim}


──────────────────────────────────────────────────────────────────
  CorporateDeals.jsx — replace setSubmitted(true)
──────────────────────────────────────────────────────────────────
import { submitCorporateEnquiry } from "../services/apiService";

const handleSubmit = async () => {
  if (!canSubmit) return;
  try {
    await submitCorporateEnquiry({
      ...formData,
      models_interested: selectedModels,
    });
    setSubmitted(true);
  } catch (err) {
    alert(err.message);
  }
};


──────────────────────────────────────────────────────────────────
  ExchangeBonus.jsx — replace setSubmitted(true)
──────────────────────────────────────────────────────────────────
import { submitExchangeEnquiry } from "../services/apiService";

const handleSubmit = async () => {
  if (!canSubmit) return;
  try {
    const bonus = exchangeBonusModels.find(m => m.name === formData.newModel)?.bonus;
    await submitExchangeEnquiry({ ...formData, exchange_bonus: bonus });
    setSubmitted(true);
  } catch (err) {
    alert(err.message);
  }
};


──────────────────────────────────────────────────────────────────
  FinanceSchemes.jsx — replace setSubmitted(true)
──────────────────────────────────────────────────────────────────
import { submitFinanceApplication } from "../services/apiService";

const handleSubmit = async () => {
  if (!canSubmit) return;
  try {
    await submitFinanceApplication({
      ...formData,
      scheme_interest: activeScheme,
    });
    setSubmitted(true);
  } catch (err) {
    alert(err.message);
  }
};


──────────────────────────────────────────────────────────────────
  Service.jsx — replace setSubmitted(true) in handleSubmit
──────────────────────────────────────────────────────────────────
import { submitServiceBooking } from "../services/apiService";

const handleSubmit = async () => {
  if (!canProceed2) return;
  try {
    const res = await submitServiceBooking({
      ...form,
      service_type: selectedType,
    });
    setSubmitted(true);
    // Optional: show booking ref
    // console.log("Ref:", res.booking_ref);
  } catch (err) {
    alert(err.message);
  }
};


──────────────────────────────────────────────────────────────────
  FASTag.jsx — replace setSubmitted(true)
──────────────────────────────────────────────────────────────────
import { submitFastagEnquiry } from "../services/apiService";

const handleSubmit = async () => {
  try {
    await submitFastagEnquiry(formData);
    setSubmitted(true);
  } catch (err) {
    alert(err.message);
  }
};


──────────────────────────────────────────────────────────────────
  Insurance.jsx — on Get Quote / Renew Now click
──────────────────────────────────────────────────────────────────
import { submitInsuranceEnquiry } from "../services/apiService";

const handleEnquiry = async (type) => {
  try {
    await submitInsuranceEnquiry({
      phone        : "",          // collect from a quick modal or form
      enquiry_type : type,        // "new" or "renewal"
      plan_type    : selectedPlan,
    });
    alert("Our advisor will call you with quotes in 30 minutes!");
  } catch (err) {
    alert(err.message);
  }
};


──────────────────────────────────────────────────────────────────
  Accessories.jsx — on "Request Quote" button click
──────────────────────────────────────────────────────────────────
import { submitAccessoryEnquiry } from "../services/apiService";

const handleQuote = async () => {
  try {
    const items = cart.map(id => accessories.find(a => a.id === id));
    await submitAccessoryEnquiry({ items_selected: items });
    setCart([]);
    alert("Quote request sent! We will contact you shortly.");
  } catch (err) {
    alert(err.message);
  }
};


──────────────────────────────────────────────────────────────────
  VAS.jsx — on "Confirm Booking" button
──────────────────────────────────────────────────────────────────
import { submitVASBooking } from "../services/apiService";

const handleBook = async () => {
  try {
    await submitVASBooking({ services: enquired });
    setEnquired([]);
    alert("VAS booking confirmed! Appointment details sent to your phone.");
  } catch (err) {
    alert(err.message);
  }
};
*/