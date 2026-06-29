import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Shield, Lock, Mail, User } from "lucide-react";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("sentinel_token", data.token);
        localStorage.setItem("sentinel_user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Authentication processing failure.");
      }
    } catch (err) {
      setError("Cannot establish contact with backend auth microservice.");
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: googleResponse.credential }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("sentinel_token", data.token);
        localStorage.setItem("sentinel_user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Google token exchange authentication failed.");
      }
    } catch (err) {
      setError("Network communication crash during Google handshake.");
    }
  };

  const inputWrap = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "var(--bg-code)",
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
  };

  const inputStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--text-primary)",
    width: "100%",
    outline: "none",
    fontSize: "0.95rem",
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "2rem",
          backgroundColor: "var(--bg-card)",
          borderRadius: "16px",
          border: "1px solid var(--border-color)",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
          <Shield size={44} style={{ color: "#34d399", marginBottom: "0.5rem" }} />
          <h2 style={{ margin: 0, color: "var(--text-primary)" }}>
            {isSignUp ? "Create Secure Profile" : "Identity Gateway"}
          </h2>
          <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Access Risk Sentinel dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "#991b1b", color: "#fca5a5", borderRadius: "6px", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
          {isSignUp && (
            <div style={inputWrap}>
              <User size={18} style={{ color: "var(--text-muted)", marginRight: "0.5rem", flexShrink: 0 }} />
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
            </div>
          )}
          <div style={inputWrap}>
            <Mail size={18} style={{ color: "var(--text-muted)", marginRight: "0.5rem", flexShrink: 0 }} />
            <input type="email" name="email" placeholder="Corporate Identity Email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
          </div>
          <div style={inputWrap}>
            <Lock size={18} style={{ color: "var(--text-muted)", marginRight: "0.5rem", flexShrink: 0 }} />
            <input type="password" name="password" placeholder="Cipher Access Key" value={formData.password} onChange={handleInputChange} style={inputStyle} required />
          </div>
          <button type="submit" style={{ padding: "0.75rem", borderRadius: "8px", backgroundColor: "#10b981", color: "white", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}>
            {isSignUp ? "Sign Up" : "Authenticate Session"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
          <span style={{ padding: "0 10px" }}>OR SECURE IDENTITY PROVIDER</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border-subtle)" }} />
        </div>

        {/* Google */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google OAuth Provider handshake aborted.")}
            theme="dark"
            shape="square"
          />
        </div>

        {/* Toggle */}
        <p style={{ textAlign: "center", margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          {isSignUp ? "Already have an authorized profile?" : "Don't have an access profile yet?"}{" "}
          <span onClick={() => { setIsSignUp(!isSignUp); setError(""); }} style={{ color: "#34d399", cursor: "pointer", fontWeight: "bold" }}>
            {isSignUp ? "Login Session" : "Register Here"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
