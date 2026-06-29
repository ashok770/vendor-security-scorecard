const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL_USER,
    pass: process.env.ALERT_EMAIL_PASS,
  },
});

const sendRiskAlertEmail = async (targetEmail, domain, grade, missingHeaders) => {
  if (!targetEmail) return;

  const mailOptions = {
    from: `"Risk Sentinel Alerts" <${process.env.ALERT_EMAIL_USER}>`,
    to: targetEmail,
    subject: `🚨 CRITICAL RISK ALERT: ${domain.toUpperCase()} Security Posture Compromised`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #fca5a5; border-radius: 12px; padding: 24px; background-color: #fef2f2;">
        <h2 style="color: #dc2626; margin-top: 0;">Supply-Chain Threat Exposure Detected</h2>
        <p style="color: #4b5563; font-size: 14px;">
          An automated infrastructure scan was executed for <strong>${domain}</strong>. The target asset failed to satisfy critical security baseline protocols.
        </p>

        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #fee2e2; margin: 20px 0;">
          <span style="font-size: 12px; color: #7f1d1d; font-weight: bold; text-transform: uppercase;">Assigned Metric</span>
          <div style="font-size: 32px; font-weight: 800; color: #b91c1c; margin-top: 4px;">GRADE ${grade}</div>
        </div>

        <h3 style="color: #991b1b; font-size: 14px; margin-bottom: 8px;">Identified Compliance Gaps:</h3>
        <ul style="color: #991b1b; font-size: 13px; font-family: monospace; padding-left: 20px;">
          ${missingHeaders.map((h) => `<li style="margin-bottom: 4px;">Missing: ${h}</li>`).join("")}
        </ul>

        <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 24px 0;" />
        <p style="font-size: 11px; color: #9ca3af; margin-bottom: 0;">
          This is an automated threat intelligence broadcast from Risk Sentinel. Log into your dashboard to isolate the vendor perimeter.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Risk alert email dispatched to ${targetEmail} ✅`);
  } catch (err) {
    console.error("Nodemailer dispatch failed ❌:", err);
  }
};

module.exports = { sendRiskAlertEmail };
