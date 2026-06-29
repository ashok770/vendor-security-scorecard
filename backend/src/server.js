const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Scan = require("./models/Scan");
const authRoutes = require('./routes/auth');
const { sendRiskAlertEmail } = require('./utils/alert');

const app = (report) => express();
const appInstance = express();
const PORT = process.env.PORT || 5000;

appInstance.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
appInstance.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected successfully ✅"))
  .catch((err) => console.error("MongoDB Atlas connection error ❌:", err));

appInstance.get("/api/health", (req, res) => {
  res.json({ status: "Backend is operational" });
});

appInstance.post("/api/scan", (req, res) => {
  const { domain, userEmail } = req.body;

  if (!domain) {
    return res.status(400).json({ error: "Domain parameter is required" });
  }

  const sanitizedDomain = domain.trim().replace(/[^a-zA-Z0-9.-]/g, "");
  const scriptPath = path.join(__dirname, "../../cyber-engine/core_scanner.py");
  const command = `conda run -n cyber-engine python "${scriptPath}" ${sanitizedDomain}`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      return res
        .status(500)
        .json({ error: "Scanner execution failed internally" });
    }

    try {
      const scorecardData = JSON.parse(stdout);

      if (scorecardData.rating?.notes === "Host unreachable") {
        return res.json(scorecardData);
      }

      const newScan = new Scan({
        domain: scorecardData.domain,
        userEmail: userEmail || "",
        rating: scorecardData.rating,
        security_headers: scorecardData.security_headers,
        dns_security: scorecardData.dns_security,
      });

      await newScan.save();
      console.log(`Uploaded fresh scorecard to Atlas cloud for: ${sanitizedDomain} 💾`);

      // Fire alert email for D or F grade vendors — non-blocking
      const grade = scorecardData.rating?.grade;
      if (grade === "D" || grade === "F") {
        const missingHeaders = [];
        const headers = scorecardData.security_headers || {};
        if (!headers["Strict-Transport-Security"] || headers["Strict-Transport-Security"]?.status !== "Secure")
          missingHeaders.push("HSTS (Strict-Transport-Security)");
        if (!headers["Content-Security-Policy"] || headers["Content-Security-Policy"]?.status !== "Secure")
          missingHeaders.push("CSP (Content-Security-Policy)");
        if (userEmail) sendRiskAlertEmail(userEmail, scorecardData.domain, grade, missingHeaders);
      }

      return res.json(scorecardData);
    } catch (parseError) {
      console.error(`Parsing/Saving error: ${parseError}`);
      return res
        .status(500)
        .json({ error: "Failed to parse or store security report data" });
    }
  });
});

appInstance.use('/api/auth', authRoutes);

appInstance.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});
