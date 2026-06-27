import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

function About() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        paddingTop: "4rem",
      }}
    >
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#94a3b8",
          textDecoration: "none",
          marginBottom: "2rem",
        }}
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <Shield style={{ color: "#34d399" }} /> Technical Architecture Overview
      </h2>
      <p style={{ color: "#94a3b8", lineHeight: "1.6", marginBottom: "2rem" }}>
        This multi-tier platform acts as an automated orchestration pipeline
        across software layers to collect, evaluate, and flag security
        configurations in real-world infrastructure systems.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div
          style={{
            borderLeft: "4px solid #10b981",
            paddingLeft: "1rem",
            backgroundColor: "#1e293b",
            padding: "1rem",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <strong>Frontend Core:</strong> Built using React and styled with
          functional glassmorphic layouts to render asynchronous data pipelines
          cleanly.
        </div>
        <div
          style={{
            borderLeft: "4px solid #60a5fa",
            paddingLeft: "1rem",
            backgroundColor: "#1e293b",
            padding: "1rem",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <strong>Orchestration Backend:</strong> Powered by Node.js and Express
          to route processes, sanitize incoming query parameters, and securely
          sign JSON Web Tokens (JWT).
        </div>
        <div
          style={{
            borderLeft: "4px solid #f59e0b",
            paddingLeft: "1rem",
            backgroundColor: "#1e293b",
            padding: "1rem",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <strong>Database Pipeline:</strong> Utilizes MongoDB Atlas cloud
          architectures to log persistent chronological history collections.
        </div>
        <div
          style={{
            borderLeft: "4px solid #c084fc",
            paddingLeft: "1rem",
            backgroundColor: "#1e293b",
            padding: "1rem",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <strong>Cyber Analytics Engine:</strong> Driven by an active isolated
          Conda environment executing custom multi-threaded Python scripts
          paired with external active Shodan threat indexes.
        </div>
      </div>
    </div>
  );
}

export default About;
