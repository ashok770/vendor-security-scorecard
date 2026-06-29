import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Users, Eye, CheckCircle, Globe } from "lucide-react";

function About() {
  return (
    <div
      className="min-h-screen relative overflow-hidden selection:bg-emerald-500/30"
      style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* Decorative orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--orb1), transparent)" }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--orb2), transparent)" }} />

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
    </div>
  );
}

export default About;
