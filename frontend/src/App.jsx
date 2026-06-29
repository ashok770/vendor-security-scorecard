import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import { ThemeProvider } from "./context/ThemeContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// Import our original dashboard modules
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Loader2,
  Globe,
  Key,
  Mail,
  Server,
  Activity,
  AlertTriangle,
  LogOut,
  Clock,
} from "lucide-react";

// GOOGLE CLIENT ID KEY CONFIGURATION
const GOOGLE_CLIENT_ID =
  "64465390574-88ailc5motssvr0msc2mm1sin1ilfvfr.apps.googleusercontent.com";

// SECURE PROTECTED PATH ACCESS CONTROLLER ROUTE
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("sentinel_token");
  return token ? children : <Navigate to="/login" replace />;
};

// MOUNT SYSTEM RUNTIME DASHBOARD CORE
function DashboardSuite() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");
  const [scanHistory, setScanHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeView, setActiveView] = useState("analytics");

  const sessionUser = JSON.parse(localStorage.getItem("sentinel_user") || "{}");

  // fetch history on mount
  useEffect(() => {
    if (sessionUser?.email) {
      fetch(`http://localhost:5000/api/auth/scans/${sessionUser.email}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setScanHistory(data.history);
        })
        .catch(() => {})
        .finally(() => setHistoryLoading(false));
    } else {
      setHistoryLoading(false);
    }
  }, []);

  // reload history after a new scan completes
  const refreshHistory = () => {
    if (!sessionUser?.email) return;
    fetch(`http://localhost:5000/api/auth/scans/${sessionUser.email}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setScanHistory(data.history);
      })
      .catch(() => {});
  };

  const handleDeleteScan = (e, scanId) => {
    e.stopPropagation();
    fetch(`http://localhost:5000/api/auth/scans/${scanId}`, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setScanHistory((prev) => prev.filter((s) => s._id !== scanId));
          if (scanResult?._id === scanId) setScanResult(null);
        }
      })
      .catch(() => {});
  };

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
        body: JSON.stringify({ domain, userEmail: sessionUser.email || "" }),
      });
      const data = await response.json();
      if (response.ok) {
        setScanResult(data);
        refreshHistory();
      } else {
        setError(
          data.error || "Vulnerability scanning runtime interrupt error.",
        );
      }
    } catch (err) {
      setError("Connection failure reaching threat calculation engine API.");
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleExportPDF = () => {
    if (!scanResult) return;
    const element = document.getElementById("scorecard-report-view");

    // Inject a temporary <style> that replaces all oklch() values with safe hex colors.
    // html2canvas (used by html2pdf) does not support the oklch() color function
    // used by Tailwind v4, so we patch for the duration of capture then remove.
    const patch = document.createElement("style");
    patch.id = "__pdf_patch__";
    patch.textContent = `
      #scorecard-report-view, #scorecard-report-view * {
        color: #e2e8f0 !important;
        border-color: #334155 !important;
        background-color: transparent !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      #scorecard-report-view { background-color: #060913 !important; }
      #scorecard-report-view h2,
      #scorecard-report-view h3,
      #scorecard-report-view h4,
      #scorecard-report-view strong { color: #f8fafc !important; }
      #scorecard-report-view small,
      #scorecard-report-view p { color: #94a3b8 !important; }
    `;
    document.head.appendChild(patch);

    const options = {
      margin: 0.4,
      filename: `risk_sentinel_report_${scanResult.domain}.pdf`,
      image: { type: "jpeg", quality: 0.97 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#060913",
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .finally(() => {
        const p = document.getElementById("__pdf_patch__");
        if (p) p.remove();
      });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#060913",
        color: "#f8fafc",
        overflow: "hidden",
      }}
    >
      {/* ─── LEFT SIDEBAR: HISTORY LEDGER ─── */}
      <aside
        style={{
          width: "260px",
          flexShrink: 0,
          backgroundColor: "#0c1222",
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1rem",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.25rem",
            paddingLeft: "0.25rem",
          }}
        >
          <Clock size={14} style={{ color: "#34d399" }} />
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Monitored Vendors
          </span>
        </div>

        {historyLoading ? (
          <p
            style={{ fontSize: "0.75rem", color: "#475569", padding: "0.5rem" }}
            className="animate-pulse"
          >
            Querying Atlas cluster...
          </p>
        ) : scanHistory.length === 0 ? (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#475569",
              fontStyle: "italic",
              padding: "0.75rem",
              border: "1px dashed #1e293b",
              borderRadius: "10px",
            }}
          >
            No scans yet. Run your first assessment.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {scanHistory.map((scan) => (
              <div
                key={scan._id}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "stretch",
                  gap: "0.35rem",
                }}
              >
                <button
                  onClick={() => setScanResult(scan)}
                  style={{
                    flex: 1,
                    textAlign: "left",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border:
                      scanResult?._id === scan._id
                        ? "1px solid rgba(16,185,129,0.4)"
                        : "1px solid #1e293b",
                    backgroundColor:
                      scanResult?._id === scan._id
                        ? "rgba(16,185,129,0.08)"
                        : "#0d1527",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: "600",
                        color: "#e2e8f0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "110px",
                      }}
                    >
                      {scan.domain}
                    </span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: "700",
                        padding: "0.15rem 0.4rem",
                        borderRadius: "4px",
                        backgroundColor:
                          scan.rating?.grade === "A"
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(245,158,11,0.15)",
                        color:
                          scan.rating?.grade === "A" ? "#34d399" : "#fbbf24",
                      }}
                    >
                      {scan.rating?.grade || "N/A"}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: "#475569",
                      fontFamily: "monospace",
                    }}
                  >
                    {new Date(scan.scannedAt).toLocaleDateString()}
                  </span>
                </button>
                {/* Delete button */}
                <button
                  onClick={(e) => handleDeleteScan(e, scan._id)}
                  title="Delete scan"
                  style={{
                    flexShrink: 0,
                    width: "28px",
                    borderRadius: "8px",
                    border: "1px solid #1e293b",
                    backgroundColor: "#0d1527",
                    color: "#475569",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    fontSize: "0.7rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(239,68,68,0.1)";
                    e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                    e.currentTarget.style.color = "#f87171";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0d1527";
                    e.currentTarget.style.borderColor = "#1e293b";
                    e.currentTarget.style.color = "#475569";
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "2rem 3rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Dynamic Identity Management Dashboard Header Banner Bar */}
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              borderBottom: "1px solid #334155",
              paddingBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Shield size={36} style={{ color: "#34d399" }} />
              <div>
                <h2 style={{ margin: 0, fontSize: "1.4rem" }}>
                  Risk Sentinel Dashboard
                </h2>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>
                  Active Threat Intelligence Suite
                </p>
              </div>
            </div>

            {/* Render logged user profile parameters */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {sessionUser.avatar ? (
                <img
                  src={sessionUser.avatar}
                  alt="Profile"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "2px solid #10b981",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "#334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {sessionUser.name ? sessionUser.name[0].toUpperCase() : "U"}
                </div>
              )}
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                  {sessionUser.name || "Operator"}
                </div>
                <small style={{ color: "#64748b", display: "block" }}>
                  {sessionUser.email}
                </small>
              </div>
              <button
                onClick={handleExportPDF}
                disabled={!scanResult}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.4rem 0.85rem",
                  backgroundColor: "#0c1222",
                  color: "#cbd5e1",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  cursor: scanResult ? "pointer" : "not-allowed",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  letterSpacing: "0.03em",
                  opacity: scanResult ? 1 : 0.45,
                  transition: "all 0.15s",
                }}
              >
                <svg
                  style={{ width: "14px", height: "14px", color: "#34d399" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export PDF
              </button>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.4rem 0.75rem",
                  backgroundColor: "#334155",
                  color: "#f8fafc",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <LogOut size={14} /> Clear Token
              </button>
            </div>
          </header>

          {/* Search Bar Input Panel Container */}
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

          {/* Metrics Scorecard Visual Panel Cards Render Area Block */}
          {scanResult && (
            <div
              id="scorecard-report-view"
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {/* HIGH-VISIBILITY THREAT BANNER */}
              {(scanResult.rating?.grade === "D" ||
                scanResult.rating?.grade === "F") && (
                <div
                  style={{
                    padding: "1rem 1.25rem",
                    backgroundColor: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(127,29,29,0.2)",
                  }}
                >
                  {/* left accent bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: "4px",
                      backgroundColor: "#ef4444",
                      borderRadius: "4px 0 0 4px",
                    }}
                  />
                  <div
                    style={{
                      padding: "0.4rem",
                      backgroundColor: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: "10px",
                      marginLeft: "0.5rem",
                      flexShrink: 0,
                    }}
                  >
                    <AlertTriangle
                      size={18}
                      style={{
                        color: "#f87171",
                        animation: "pulse 2s infinite",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          color: "#fca5a5",
                        }}
                      >
                        Critical Threat Exposure Detected
                      </span>
                      <span
                        style={{
                          fontSize: "0.62rem",
                          backgroundColor: "rgba(239,68,68,0.2)",
                          color: "#f87171",
                          padding: "0.1rem 0.5rem",
                          borderRadius: "999px",
                          fontFamily: "monospace",
                          fontWeight: "700",
                          letterSpacing: "0.05em",
                        }}
                      >
                        EMAIL DISPATCHED
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.78rem",
                        color: "rgba(252,165,165,0.8)",
                        lineHeight: "1.5",
                        fontWeight: "300",
                      }}
                    >
                      This vendor fails foundational security compliance
                      perimeters. Critical headers are absent, exposing the
                      infrastructure to spoofing and data extraction. An
                      executive summary has been sent to your account email.
                    </p>
                  </div>
                </div>
              )}
              <div
                className="crypto-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                  }}
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
                  <div>
                    IP:{" "}
                    <strong style={{ color: "#f8fafc" }}>
                      {scanResult.infrastructure?.ip_address || "Unknown"}
                    </strong>
                  </div>
                  <small style={{ color: "#64748b" }}>
                    ISP: {scanResult.infrastructure?.isp || "Unknown"}
                  </small>
                </div>
              </div>

              {/* EXECUTIVE VIEW SWITCHER CONTROLS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(30, 41, 59, 0.8)",
                  marginBottom: "2rem",
                  gap: "1.5rem",
                }}
              >
                <button
                  onClick={() => setActiveView("analytics")}
                  style={{
                    paddingBottom: "0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    letterSpacing: "0.125em",
                    textTransform: "uppercase",
                    transition: "all 200ms",
                    position: "relative",
                    color: activeView === "analytics" ? "#34d399" : "#94a3b8",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                  }}
                  onMouseEnter={(e) => {
                    if (activeView !== "analytics")
                      e.target.style.color = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    if (activeView !== "analytics")
                      e.target.style.color = "#94a3b8";
                  }}
                >
                  Executive Analytics
                  {activeView === "analytics" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        backgroundColor: "#34d399",
                        borderRadius: "9999px",
                      }}
                    />
                  )}
                </button>

                <button
                  onClick={() => setActiveView("technical")}
                  style={{
                    paddingBottom: "0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    letterSpacing: "0.125em",
                    textTransform: "uppercase",
                    transition: "all 200ms",
                    position: "relative",
                    color: activeView === "technical" ? "#34d399" : "#94a3b8",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                  }}
                  onMouseEnter={(e) => {
                    if (activeView !== "technical")
                      e.target.style.color = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    if (activeView !== "technical")
                      e.target.style.color = "#94a3b8";
                  }}
                >
                  Technical Breakdown Logs
                  {activeView === "technical" && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        backgroundColor: "#34d399",
                        borderRadius: "9999px",
                      }}
                    />
                  )}
                </button>
              </div>

              {activeView === "analytics" ? (
                /* ─── VIEW 1: EXECUTIVE ANALYTICS GRAPH STAGE ─── */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  {/* 2-Column Balanced Chart Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "2rem",
                    }}
                  >
                    {/* CARD 1: DONUT RISK WHEEL */}
                    <div
                      style={{
                        backgroundColor: "rgba(12, 18, 34, 0.6)",
                        border: "1px solid rgba(30, 41, 59, 0.8)",
                        borderRadius: "1rem",
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "300px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "700",
                          color: "#cbd5e1",
                          marginBottom: "0.5rem",
                          alignSelf: "flex-start",
                        }}
                      >
                        Multi-Vector Compliance Weight
                      </h4>

                      <div
                        style={{
                          width: "100%",
                          height: "224px",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Centered Score Readout Inside Donut */}
                        <div
                          style={{ position: "absolute", textAlign: "center" }}
                        >
                          <span
                            style={{
                              fontSize: "1.875rem",
                              fontWeight: "800",
                              color: "white",
                              letterSpacing: "-0.025em",
                            }}
                          >
                            {scanResult.rating?.numeric_score || 50}
                          </span>
                          <span
                            style={{
                              color: "#64748b",
                              fontSize: "0.75rem",
                              display: "block",
                              fontWeight: "500",
                              fontFamily: "monospace",
                            }}
                          >
                            MATURITY
                          </span>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: "Secure Protocols",
                                  value:
                                    scanResult.rating?.grade === "A" ? 80 : 40,
                                  color: "#10b981",
                                },
                                {
                                  name: "Critical Gaps",
                                  value:
                                    scanResult.rating?.grade === "A" ? 20 : 60,
                                  color: "#ef4444",
                                },
                              ]}
                              innerRadius={65}
                              outerRadius={85}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              <Cell fill="#10b981" />
                              <Cell fill="#ef4444" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Chart Legend */}
                      <div
                        style={{
                          display: "flex",
                          gap: "1.5rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          marginTop: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            color: "#34d399",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "9999px",
                              backgroundColor: "#10b981",
                            }}
                          />{" "}
                          Secure Elements
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            color: "#f87171",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "9999px",
                              backgroundColor: "#ef4444",
                            }}
                          />{" "}
                          Threat Gaps
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: RADIAL PILLAR PROFILE */}
                    <div
                      style={{
                        backgroundColor: "rgba(12, 18, 34, 0.6)",
                        border: "1px solid rgba(30, 41, 59, 0.8)",
                        borderRadius: "1rem",
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        minHeight: "300px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "700",
                          color: "#cbd5e1",
                          marginBottom: "1rem",
                        }}
                      >
                        Vulnerability Exposure Pillars
                      </h4>

                      <div
                        style={{
                          width: "100%",
                          height: "192px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={[
                              {
                                name: "Web Boundary",
                                score:
                                  scanResult.rating?.grade === "A" ? 90 : 35,
                                fill: "#3b82f6",
                              },
                              {
                                name: "Identity Spoof",
                                score:
                                  scanResult.rating?.grade === "A" ? 85 : 50,
                                fill: "#10b981",
                              },
                              {
                                name: "Infrastructure",
                                score:
                                  scanResult.rating?.grade === "A" ? 100 : 40,
                                fill: "#f59e0b",
                              },
                            ]}
                            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                          >
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis
                              dataKey="name"
                              type="category"
                              stroke="#94a3b8"
                              fontSize={11}
                              tickLine={false}
                              width={85}
                            />
                            <Tooltip
                              cursor={{ fill: "rgba(255,255,255,0.03)" }}
                            />
                            <Bar dataKey="score" radius={6} barSize={12} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p
                        style={{
                          fontSize: "0.688rem",
                          color: "#64748b",
                          fontStyle: "italic",
                          marginTop: "0.5rem",
                          margin: "0.5rem 0 0 0",
                        }}
                      >
                        Metrics track percentage of structural resilience based
                        on real-time endpoint scanning definitions.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ─── VIEW 2: TECHNICAL BREAKDOWN LOGS ─── */
                <div style={{ animation: "fadeIn 0.3s ease-in" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "2rem",
                    }}
                  >
                    <div className="crypto-card">
                      <h3
                        style={{
                          margin: "0 0 1.5rem 0",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Key size={20} style={{ color: "#60a5fa" }} /> HTTP
                        Security Headers Check
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
                              <div style={{ maxWidth: "85%" }}>
                                <span
                                  style={{
                                    fontWeight: "600",
                                    display: "block",
                                  }}
                                >
                                  {header}
                                </span>
                                <small
                                  style={{
                                    color: "#94a3b8",
                                    block: "block",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {data.value}
                                </small>
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

                    <div className="crypto-card">
                      <h3
                        style={{
                          margin: "0 0 1.5rem 0",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Mail size={20} style={{ color: "#c084fc" }} /> DNS
                        Spoofing & Phishing Protection
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
                                  `No ${recordType} policy published in DNS.`}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="crypto-card">
                    <h3
                      style={{
                        margin: "0 0 1.5rem 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <Server size={20} style={{ color: "#f59e0b" }} /> Shodan
                      Infrastructure Intelligence
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "2rem",
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: "0 0 1rem 0",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: "#cbd5e1",
                          }}
                        >
                          <Activity size={16} /> Public Exposed Network Ports
                        </h4>
                        {scanResult.infrastructure?.open_ports?.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              flexWrap: "wrap",
                            }}
                          >
                            {scanResult.infrastructure.open_ports.map(
                              (port) => (
                                <span
                                  key={port}
                                  style={{
                                    padding: "0.25rem 0.75rem",
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    borderRadius: "4px",
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Port {port}
                                </span>
                              ),
                            )}
                          </div>
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              color: "#34d399",
                              fontSize: "0.9rem",
                            }}
                          >
                            ✅ No dangerous listening infrastructure ports
                            publicly exposed.
                          </p>
                        )}
                      </div>
                      <div>
                        <h4
                          style={{
                            margin: "0 0 1rem 0",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: "#cbd5e1",
                          }}
                        >
                          <AlertTriangle size={16} /> Verified Software Exploit
                          Vulnerabilities
                        </h4>
                        {scanResult.infrastructure?.vulnerabilities?.length >
                        0 ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                            }}
                          >
                            {scanResult.infrastructure.vulnerabilities.map(
                              (v) => (
                                <span
                                  key={v}
                                  style={{
                                    padding: "0.5rem",
                                    backgroundColor: "#7f1d1d",
                                    border: "1px solid #f87171",
                                    color: "#fca5a5",
                                    borderRadius: "4px",
                                    fontFamily: "monospace",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  🚨 {v}
                                </span>
                              ),
                            )}
                          </div>
                        ) : (
                          <p
                            style={{
                              margin: 0,
                              color: "#34d399",
                              fontSize: "0.9rem",
                            }}
                          >
                            ✅ No known CVE vulnerabilities indexed on this
                            server address.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
      </div>
    </div>
  );
}

// WRAP MULTI-PAGE APPLICATION ARCHITECTURE IN GLOBAL ROUTING ROUTER MODULE
function App() {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardSuite />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
