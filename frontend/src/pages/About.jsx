import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Users, Eye, CheckCircle, Globe, ChevronRight } from "lucide-react";

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-5 py-4"
        style={{ color: "var(--text-primary)" }}
      >
        <span className="text-sm font-medium text-left">{question}</span>
        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} style={{ color: "var(--text-muted)" }} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {answer}
        </div>
      )}
    </div>
  );
}

function About() {
  return (
    <div
      className="min-h-screen relative selection:bg-emerald-500/30"
      style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* Decorative orbs — clipped to their own container so they don't affect footer */}
      <div className="absolute top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, var(--orb1), transparent)" }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, var(--orb2), transparent)" }} />
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pt-32 pb-24 relative z-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider hover:text-emerald-400 transition-colors uppercase mb-8 group"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Return to Platform
        </Link>

        {/* Page title */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-full text-xs font-medium mb-4">
            <Users className="w-3.5 h-3.5" /> Corporate Ecosystem
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4" style={{ color: "var(--text-primary)" }}>
            Securing Tomorrow's <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Digital Supply Chains
            </span>
          </h1>
          <p className="text-lg leading-relaxed font-light max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Risk Sentinel delivers unified threat exposure management. We help
            modern enterprises continuously map, evaluate, and mitigate
            structural third-party risks before hackers capitalize on them.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div
            className="rounded-2xl p-6 shadow-xl"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Our Core Vision</h3>
            <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-secondary)" }}>
              To replace slow, manual spreadsheets with split-second automated
              scans, giving security teams instant clarity on third-party
              security profiles across global infrastructure landscapes.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 shadow-xl"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>Global Scale</h3>
            <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-secondary)" }}>
              By collecting DNS routing metadata, public network layers, and
              threat intelligence records, we create a global defensive network
              perimeter.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              { q: "What is vendor risk management?", a: "Vendor risk management is the process of identifying, assessing, and mitigating risks introduced by third-party suppliers and service providers who have access to your systems, data, or infrastructure." },
              { q: "How does Risk Sentinel scan vendors?", a: "We perform passive, non-intrusive scans by querying public DNS records, analyzing HTTP response headers, and cross-referencing Shodan's infrastructure intelligence database — no active probing or intrusion." },
              { q: "How often are vendors rescanned?", a: "Continuous monitoring performs full rescans on a configurable cadence. Critical configuration changes trigger immediate re-evaluation and alert dispatches." },
              { q: "What do the security grades mean?", a: "Grades range from A (90–100, fully hardened) to F (below 60, critical exposure). Each grade reflects a weighted composite of HTTP headers, DNS anti-spoofing records, and infrastructure vulnerability data." },
              { q: "Can I export reports?", a: "Yes — generate audit-ready PDF reports directly from the dashboard with a single click. Scheduled exports and CSV formats are on the roadmap." },
              { q: "Is my scan data stored securely?", a: "All scan results are stored in an encrypted MongoDB Atlas cluster. Data is scoped per user account and never shared across organizations." },
              { q: "Does it integrate with SIEMs?", a: "Out-of-the-box connectors for popular SIEM and ticketing platforms are on the roadmap. The REST API is available for custom integrations today." },
              { q: "What compliance frameworks does it support?", a: "Risk Sentinel's scanning criteria aligns with SOC2, ISO/IEC 27001, and NIST CSF control families, providing evidence artifacts for audits." },
            ].map((item) => <FAQItem key={item.q} question={item.q} answer={item.a} />)}
          </div>
        </div>

        {/* Compliance block */}
        <div
          className="rounded-2xl p-8 shadow-2xl relative"
          style={{ background: "linear-gradient(to right, var(--bg-card), var(--bg-card-inner))", border: "1px solid var(--border-color)" }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Compliance & Security Standards
          </h3>
          <p className="text-sm leading-relaxed font-light mb-6" style={{ color: "var(--text-secondary)" }}>
            The platform's passive scanning routines match world-class
            operational frameworks, ensuring all asset tracking adheres to top
            industry standards.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              "SOC2 Framework Protocol",
              "ISO/IEC 27001 Metrics",
              "NIST Vulnerability Indexing",
              "Continuous Threat Mapping",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE ENTERPRISE SAAS FOOTER */}
      <footer className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pt-16 border-t mt-4 pb-8 text-xs font-medium" style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-2.5">
            <div className="font-bold uppercase tracking-wider text-[10px] mb-3" style={{ color: "var(--text-primary)" }}>Product</div>
            <Link to="/" className="block hover:text-emerald-400 transition-colors">Platform Overview</Link>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Interactive Sandbox</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Executive Reports</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Risk Scoring Engine</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Continuous Monitoring</div>
          </div>
          <div className="space-y-2.5">
            <div className="font-bold uppercase tracking-wider text-[10px] mb-3" style={{ color: "var(--text-primary)" }}>Company</div>
            <Link to="/about" className="block hover:text-emerald-400 transition-colors">About Us</Link>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Careers</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Contact Security</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Press & Media</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Verification Network</div>
          </div>
          <div className="space-y-2.5">
            <div className="font-bold uppercase tracking-wider text-[10px] mb-3" style={{ color: "var(--text-primary)" }}>Resources</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Technical Documentation</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">API Framework</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Platform Status</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Security Blog</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Compliance Guides</div>
          </div>
          <div className="space-y-2.5">
            <div className="font-bold uppercase tracking-wider text-[10px] mb-3" style={{ color: "var(--text-primary)" }}>Legal & Social</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Perimeter</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</div>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">Cookie Policy</div>
            <a href="https://github.com/ashok770/vendor-security-scorecard" target="_blank" rel="noreferrer" className="block hover:text-emerald-400 transition-colors">GitHub Portal</a>
            <div className="hover:text-emerald-400 transition-colors cursor-pointer">LinkedIn</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-[11px]" style={{ color: "var(--text-primary)" }}>RISK SENTINEL</span>
            <span className="text-[10px]">— Enterprise Vendor Risk Intelligence</span>
          </div>
          <div className="text-[11px]">
            © {new Date().getFullYear()} Risk Sentinel Inc. All infrastructure nodes secure.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
