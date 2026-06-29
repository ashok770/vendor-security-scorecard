const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema({
  domain: { type: String, required: true, trim: true },
  userEmail: { type: String, default: "", trim: true, lowercase: true },
  rating: {
    numeric_score: { type: Number, required: true },
    grade: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  security_headers: {
    type: Map,
    of: new mongoose.Schema(
      {
        status: String,
        value: String,
      },
      { _id: false },
    ),
  },
  dns_security: {
    SPF: { status: String, record: String },
    DMARC: { status: String, record: String },
  },
  scannedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Scan", ScanSchema);
