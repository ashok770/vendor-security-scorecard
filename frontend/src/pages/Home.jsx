import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ShieldCheck,
  Terminal,
  Database,
  ArrowRight,
} from "lucide-react";

function Home() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "center",
        paddingTop: "6rem",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <Shield size={60} style={{ color: "#34d399" }} />
        <h1
          style={{
            fontSize: "3rem",
            margin: 0,
            fontWeight: "800",
            tracking: "-0.05em",
          }}
        >
          Risk Sentinel
        </h1>
      </div>

      <p
        style={{
          fontSize: "1.25rem",
          color: "#94a3b8",
          maxWidth: "700px",
          margin: "0 auto 2.5rem auto",
          lineHeight: "1.75",
        }}
      >
        Automated supply-chain threat intelligence. Audit third-party vendor
        safety instantly by checking web header postures, DNS spoofing
        vulnerabilities, and real-time Shodan infrastructure network metrics.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "5rem",
        }}
      >
        <Link
          to="/login"
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#10b981",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Launch Dashboard <ArrowRight size={18} />
        </Link>
        <Link
          to="/about"
          style={{
            padding: "0.75rem 2rem",
            border: "1px solid #475569",
            color: "#f8fafc",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Technical Stack
        </Link>
      </div>

      {/* Feature Highlights Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "2rem",
          textAlign: "left",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #334155",
          }}
        >
          <ShieldCheck
            style={{ color: "#60a5fa", marginBottom: "1rem" }}
            size={32}
          />
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Configuration Security</h3>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>
            Scans defensive HTTP security responses including active CSP, HSTS,
            and framing controls.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #334155",
          }}
        >
          <Terminal
            style={{ color: "#c084fc", marginBottom: "1rem" }}
            size={32}
          />
          <h3 style={{ margin: "0 0 0.5rem 0" }}>Spoofing Protection</h3>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>
            Queries global domain name servers to verify active cryptographic
            SPF and DMARC anti-phishing configurations.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #334155",
          }}
        >
          <Database
            style={{ color: "#f59e0b", marginBottom: "1rem" }}
            size={32}
          />
          <h3 style={{ margin: "0 0 0.5rem 0" }}>
            Infrastructure Intelligence
          </h3>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem" }}>
            Hooks directly into active Shodan API nodes to extract open ports
            and indexed CVE server exposures.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
