const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route to check backend status
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is operational" });
});

// Core Scan Route
app.post("/api/scan", (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: "Domain parameter is required" });
  }

  // Clean input to block basic command injection strings
  const sanitizedDomain = domain.trim().replace(/[^a-zA-Z0-9.-]/g, "");

  // Path targeting your core_scanner.py file
  const scriptPath = path.join(__dirname, "../../cyber-engine/core_scanner.py");

  // Command executing the script through your dedicated conda environment
  const command = `conda run -n cyber-engine python "${scriptPath}" ${sanitizedDomain}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      return res
        .status(500)
        .json({ error: "Scanner execution failed internally" });
    }

    try {
      // Parse the JSON data emitted by the Python script
      const scorecardData = JSON.parse(stdout);
      return res.json(scorecardData);
    } catch (parseError) {
      console.error(`Parsing error: ${parseError}`);
      return res
        .status(500)
        .json({ error: "Failed to parse security report data" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});
