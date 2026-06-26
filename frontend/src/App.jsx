import React, { useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Loader2,
  Globe,
  Key,
  Mail,
} from "lucide-react";

function App() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    if (!domain) return;

    setLoading(true);
    setError("");
    setScanResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      if (response.ok) {
        setScanResult(data);
      } else {
        setError(data.error || "An error occurred during scanning.");
      }
    } catch (err) {
      setError(
        "Cannot connect to the backend server. Make sure it is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "bg-emerald-500 text-white";
      case "B":
        return "bg-teal-500 text-white";
      case "C":
        return "bg-amber-500 text-white";
      case "D":
        return "bg-orange-500 text-white";
      default:
        return "bg-rose-500 text-white";
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Shield
          size={40}
          className="text-emerald-400"
          style={{ color: "#34d399" }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "1.8rem" }}>
            Third-Party Risk Sentinel
          </h1>
          <p style={{ margin: 0, color: "#94a3b8" }}>
            Automated Vendor Security Posture Scorecard
          </p>
        </div>
      </header>

      {/* Search Input Bar */}
      <form
        onSubmit={handleScan}
        style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}
      >
        <input
          type="text"
          placeholder="Enter vendor domain (e.g., target.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #475569",
            backgroundColor: "#1e293b",
            color: "#f8fafc",
            fontSize: "1rem",
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Search size={20} />
          )}
          {loading ? "Scanning Infrastructure..." : "Analyze"}
        </button>
      </form>

      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#991b1b",
            borderRadius: "8px",
            marginBottom: "2rem",
            color: "#fca5a5",
          }}
        >
          {error}
        </div>
      )}

      {/* Dashboard Metrics Layout */}
      {scanResult && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Top Summary Card */}
          <div
            className="crypto-card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              <div
                className={`grade-badge ${getGradeColor(scanResult.rating?.grade)}`}
              >
                {scanResult.rating?.grade}
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Globe size={20} style={{ color: "#94a3b8" }} />{" "}
                  {scanResult.domain}
                </h2>
                <p style={{ margin: "0.5rem 0 0 0", color: "#94a3b8" }}>
                  Overall Security Factor Maturity:{" "}
                  <strong>{scanResult.rating?.numeric_score}/100</strong>
                </p>
              </div>
            </div>
            <div style={{ color: "#94a3b8", textAlign: "right" }}>
              <span>Status: Active Recon Completed</span>
            </div>
          </div>

          {/* Breakdown Content Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            {/* Security Headers Module */}
            <div className="crypto-card">
              <h3
                style={{
                  margin: "0 0 1.5rem 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Key size={20} style={{ color: "#60a5fa" }} /> HTTP Security
                Headers Check
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {Object.entries(scanResult.security_headers || {}).map(
                  ([header, data]) => (
                    <div
                      key={header}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #334155",
                        paddingBottom: "0.5rem",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: "600", display: "block" }}>
                          {header}
                        </span>
                        <small style={{ color: "#94a3b8" }}>{data.value}</small>
                      </div>
                      <span>
                        {data.status === "Secure" ? (
                          <ShieldCheck style={{ color: "#34d399" }} />
                        ) : (
                          <ShieldAlert style={{ color: "#f87171" }} />
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Email & DNS Security Module */}
            <div className="crypto-card">
              <h3
                style={{
                  margin: "0 0 1.5rem 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Mail size={20} style={{ color: "#c084fc" }} /> DNS Spoofing &
                Email Fraud Protection
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {Object.entries(scanResult.dns_security || {}).map(
                  ([recordType, data]) => (
                    <div
                      key={recordType}
                      style={{
                        borderBottom: "1px solid #334155",
                        paddingBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {recordType} Protocol Verification
                        </span>
                        <span>
                          {data.status === "Configured" ? (
                            <span
                              style={{
                                color: "#34d399",
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                              }}
                            >
                              CONFIGURED
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "#f87171",
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                              }}
                            >
                              MISSING
                            </span>
                          )}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontFamily: "monospace",
                          backgroundColor: "#0f172a",
                          padding: "0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          wordBreak: "break-all",
                        }}
                      >
                        {data.record ||
                          `No ${recordType} policy published in DNS. Domain can be spoofed.`}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
