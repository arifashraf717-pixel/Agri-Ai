import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!phone || !password) {
      alert("Please enter phone and password");
      return;
    }
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login", { phone, password });
      if (res.data.status === "success") {
        alert("Login successful!");
        try {
          localStorage.setItem("userPhone", phone || "");
          const name = res.data.fullname || res.data.name || "";
          if (name) localStorage.setItem("userName", name);
        } catch {}
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow-sm p-4">
        <h3 className="text-center mb-4">Login</h3>

        <input
          className="form-control mb-3"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="form-control mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="d-flex justify-content-between">
          <button className="btn btn-success w-50 me-2" onClick={handleLogin}>Login</button>
          <button className="btn btn-secondary w-50 ms-2" onClick={() => navigate("/")}>Back</button>
        </div>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
