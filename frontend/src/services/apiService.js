const API_BASE = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : "/backend/api";

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await response.json();
  if (!response.ok || data.status !== "success") {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}

function postPhp(fileName, body) {
  return request(`${API_BASE}/${fileName}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function submitContactEnquiry(formData) {
  const messageParts = [formData.remark, formData.address].filter(Boolean);
  return postPhp("contact.php", {
    full_name: formData.name,
    mobile: formData.phone,
    email: formData.email || "",
    subject: "Website Contact Enquiry",
    message: messageParts.join(" | ") || "Contact enquiry from website popup.",
    source_page: "contact_popup",
  });
}

export function submitFinanceEnquiry(formData) {
  return postPhp("loan-enquiry.php", formData);
}

export function submitEWEnquiry(formData) {
  return postPhp("ew_enquiry.php", formData);
}

export function submitAMCEnquiry(formData) {
  return postPhp("amc_enquiry.php", formData);
}

export function submitRSAEnquiry(formData) {
  return postPhp("rsa_enquiry.php", formData);
}

export function submitVASEnquiry(formData) {
  return postPhp("vas_enquiry.php", formData);
}

export function submitTestDriveBooking(formData) {
  return postPhp("test-drive.php", formData);
}
