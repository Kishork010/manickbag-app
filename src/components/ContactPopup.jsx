import { useState } from "react";
import { submitContactEnquiry } from "../services/apiService";

export default function ContactPopup({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    remark: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      alert("Name & Phone are required");
      return;
    }

    setLoading(true);
    try {
      await submitContactEnquiry(form);
      alert("✅ Enquiry Submitted Successfully");
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2 style={{ marginBottom: 20 }}>Contact Us</h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="phone" placeholder="Contact No." onChange={handleChange} required />
          <input name="email" placeholder="Email ID" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />
          <textarea name="remark" placeholder="Remark" onChange={handleChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        <button onClick={onClose} style={{ marginTop: 10 }}>Close</button>
      </div>
    </div>
  );
}

// styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const popupStyle = {
  background: "#fff",
  padding: 30,
  borderRadius: 8,
  width: 350
};