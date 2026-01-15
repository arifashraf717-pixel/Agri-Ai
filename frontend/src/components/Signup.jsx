import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    password: "",
    location: "",
    farm_type: ""
  });

  const locations = ["ERODE", "COIMBATORE", "TIRUPPUR", "SALEM", "Other"];
  const farmTypes = ["Dairy", "Crop Farming", "Mixed"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/signup", formData);
      if (res.data.status === "success") {
        alert("Signup successful!");
        try {
          localStorage.setItem("userPhone", formData.phone || "");
          localStorage.setItem("userName", formData.fullname || "");
        } catch {}
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4" style={{ fontWeight: "600", color: "#2c3e50" }}>Signup</h3>

        <input
          className="form-control mb-3"
          placeholder="Full Name"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          style={{ borderRadius: "8px", padding: "10px" }}
        />

        <input
          className="form-control mb-3"
          placeholder="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          style={{ borderRadius: "8px", padding: "10px" }}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{ borderRadius: "8px", padding: "10px" }}
        />

        <select
          className="form-control mb-3"
          name="location"
          value={formData.location}
          onChange={handleChange}
          style={{ borderRadius: "8px", padding: "10px" }}
        >
          <option value="">Select Location</option>
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          className="form-control mb-4"
          name="farm_type"
          value={formData.farm_type}
          onChange={handleChange}
          style={{ borderRadius: "8px", padding: "10px" }}
        >
          <option value="">Select Farm Type</option>
          {farmTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>

        <div className="d-flex gap-2">
          <button
            className="btn btn-success flex-fill"
            onClick={handleSubmit}
            style={{ borderRadius: "8px", fontWeight: "500" }}
          >
            Signup
          </button>
          <button
            className="btn btn-secondary flex-fill"
            onClick={() => navigate("/")}
            style={{ borderRadius: "8px", fontWeight: "500" }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
