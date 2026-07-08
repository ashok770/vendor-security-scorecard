import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  ShieldCheck,
  Terminal,
  Database,
  ArrowRight,
  Activity,
  ChevronRight,
  Sun,
  Moon,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import NetworkCanvas from "../components/NetworkCanvas";

function FAQItem({ index, question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-card)",
      }}
    >
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ color: "var(--text-primary)" }}
      >
        <span className="text-sm font-medium">{question}</span>
        <ChevronRight
          className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      <div
        className={`px-4 pb-4 transition-all ${open ? "block" : "hidden"}`}
        style={{ color: "var(--text-secondary)" }}
      >
        <div className="text-sm leading-relaxed">{answer}</div>
      </div>
    </div>
  );
}

function Home() {
  const { isDark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState("home");

  const scrollTo = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden selection:bg-emerald-500/30"
      style={{
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, var(--orb1), transparent)`,
        }}
      />
      <div
        className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, var(--orb2), transparent)`,
        }}
      />

      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-16 bg-[#0c1222]/70 backdrop-blur-md border border-slate-800/60 rounded-2xl flex items-center justify-between px-6 z-50 shadow-2xl">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveTab("home")}
        >
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="font-bold tracking-tight text-lg text-white">
            RISK SENTINEL
          </span>
        </div>

        <div className="hidden md:flex items-center gap-7 text-xs font-bold tracking-wider uppercase">
          <button
            onClick={() => scrollTo("hero")}
            className={
              activeTab === "hero"
                ? "text-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }
          >
            Home
          </button>
          <button
            onClick={() => scrollTo("platform-features")}
            className={
              activeTab === "platform-features"
                ? "text-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }
          >
            Platform
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className={
              activeTab === "how-it-works"
                ? "text-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }
          >
            How It Works
          </button>
          <Link
            to="/about"
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            About
          </Link>
        </div>

        {/* Right side: theme toggle + sign in */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-xl transition-all border"
            style={{
              backgroundColor: "var(--bg-card-inner)",
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all"
            style={{
              backgroundColor: "var(--bg-card-inner)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <main
        id="hero"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pt-32 pb-24 md:pt-44 flex flex-col md:flex-row items-center gap-16 relative min-h-[92vh]"
      >
        <NetworkCanvas />
        <div className="flex-1 text-center md:text-left relative z-[2]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium mb-6 animate-pulse">
            <Activity className="w-3.5 h-3.5" /> Supply-Chain Threat Monitoring
            Active
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Results-Driven <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              Vendor Risk Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed font-light">
            Audit third-party vendor safety architectures instantly. Trusted by
            security teams to continuously assess third-party vendors, reduce
            supply-chain risk, and simplify compliance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/login"
              className="group px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:brightness-110"
            >
              Launch Intelligence Portal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-6 py-3.5 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-1"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              View Architecture Suite{" "}
              <ChevronRight
                className="w-4 h-4"
                style={{ color: "var(--text-muted)" }}
              />
            </Link>
          </div>
        </div>

        {/* Hero orb */}
        <div className="flex-1 w-full flex justify-center relative z-[2]">
          <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full relative bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent flex items-center justify-center p-8 border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.15)] animate-[spin_60s_linear_infinite]">
            <div
              className="w-full h-full rounded-full flex flex-col items-center justify-center relative shadow-2xl text-center p-4"
              style={{
                backgroundColor: "var(--bg-card-inner)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Shield className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)] mb-4" />
              <div className="font-mono text-[11px] text-emerald-500 tracking-widest font-bold">
                NODE SECURE
              </div>
              <div
                className="text-xs mt-1 font-light px-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Continuous Passive System Sweeping Engine Active
              </div>
            </div>
            <div
              className="absolute top-4 right-4 p-2 rounded-xl shadow-xl"
              style={{
                backgroundColor: "var(--bg-card-inner)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Terminal className="w-4 h-4 text-sky-400" />
            </div>
            <div
              className="absolute bottom-8 left-0 p-2 rounded-xl shadow-xl"
              style={{
                backgroundColor: "var(--bg-card-inner)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Database className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>
      </main>

      {/* ─── FEATURES ─── */}
      <section
        id="features"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-32 relative z-10"
      >
        <div
          className="w-full h-[1px] mb-20"
          style={{
            background: `linear-gradient(to right, transparent, var(--border-subtle), transparent)`,
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              color: "sky",
              title: "Configuration Security",
              desc: "Scans network perimeter headers natively to evaluate runtime protection including strict content guidelines (CSP), HSTS enforcement, and cross-framing defensive controls.",
            },
            {
              icon: <Terminal className="w-5 h-5" />,
              color: "purple",
              title: "Spoofing Protection",
              desc: "Queries DNS zones to detect active cryptographic alignment rules, guaranteeing compliance across published global structural protocols.",
            },
            {
              icon: <Database className="w-5 h-5" />,
              color: "amber",
              title: "Threat Intelligence",
              desc: "Connects directly to indexed system intelligence parameters to extract server versioning flaws, open listening ports, and infrastructure exposures on external target endpoints.",
            },
          ].map(({ icon, color, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-6 transition-all hover:-translate-y-1 duration-300 group"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-5 text-${color}-400 group-hover:bg-${color}-500/20 transition-all`}
              >
                {icon}
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h3>
              <p
                className="text-sm leading-relaxed font-light"
                style={{ color: "var(--text-secondary)" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ADDITIONAL SAAS SECTIONS ─── */}
      <section
        id="trusted"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <div className="rounded-3xl bg-[rgba(15,23,42,0.92)] border border-slate-800/60 shadow-[0_30px_80px_rgba(0,0,0,0.15)] p-10 text-center">
          <h4
            className="text-base font-semibold tracking-[0.18em] uppercase mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Inspired by Enterprise Security Workflows
          </h4>
          <p
            className="text-sm max-w-2xl mx-auto leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Risk Sentinel follows security practices commonly adopted by leading
            technology organizations, without implying these companies are
            customers.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6">
            {["Microsoft", "Google", "Cisco", "Cloudflare", "GitHub"].map(
              (logo) => (
                <div
                  key={logo}
                  className="min-w-[110px] px-5 py-4 rounded-3xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 ease-out hover:scale-[1.03] hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-[rgba(16,185,129,0.06)]"
                >
                  <span className="text-sm font-semibold tracking-[0.12em] uppercase">
                    {logo}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="why-risk"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Why Vendor Risk Matters
              </h3>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Third-party providers enlarge attack surfaces, introduce weak
                configurations, and can silently expose critical infrastructure.
                Continuous vendor intelligence reduces surprise incidents and
                speeds remediation across complex supply chains.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 text-center">
                <div className="bg-[#0c1222]/40 border border-slate-800/60 p-6 rounded-2xl">
                  <div className="text-3xl font-black text-emerald-400">
                    95%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    of organizations rely heavily on third-party vendors.
                  </div>
                </div>
                <div className="bg-[#0c1222]/40 border border-slate-800/60 p-6 rounded-2xl">
                  <div className="text-3xl font-black text-sky-400">80+</div>
                  <div className="text-xs text-slate-400 mt-1">
                    average vendor endpoints used by modern enterprises.
                  </div>
                </div>
                <div className="bg-[#0c1222]/40 border border-slate-800/60 p-6 rounded-2xl border-dashed border-red-500/20">
                  <div className="text-3xl font-black text-red-400">
                    1 Weak Link
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    can expose an entire organization's cloud pipeline.
                  </div>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Reduce breach window",
                  "Continuous configuration verification",
                  "Automated compliance evidence",
                  "Actionable remediation playbooks",
                ].map((t) => (
                  <li
                    key={t}
                    className="px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: "var(--bg-card-inner)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {/* PRODUCT MANAGER APPROVED: HIGH-FIDELITY RISK DISTRIBUTION BARS */}
            <div className="w-full bg-[#0c1222]/50 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[220px] h-full shadow-2xl">
              {/* Component Header */}
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                    Global Portfolio Risk
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Asset distribution across 128 checked ecosystem nodes
                  </span>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              {/* Fancy Simulated Bar Analytics Distribution */}
              <div className="space-y-4 py-3">
                {/* Bar 1: Secure Vendors */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                      Grade A/B (Low Risk)
                    </span>
                    <span className="text-slate-400 font-bold">
                      65%{" "}
                      <span className="text-slate-600 text-[10px]">
                        (83 Vendors)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>

                {/* Bar 2: Warning Vendors */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{" "}
                      Grade C/D (Medium Risk)
                    </span>
                    <span className="text-slate-400 font-bold">
                      23%{" "}
                      <span className="text-slate-600 text-[10px]">
                        (29 Vendors)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                      style={{ width: "23%" }}
                    />
                  </div>
                </div>

                {/* Bar 3: Critical Gaps */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-red-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />{" "}
                      Grade F (Critical Action Required)
                    </span>
                    <span className="text-slate-400 font-bold">
                      12%{" "}
                      <span className="text-slate-600 text-[10px]">
                        (16 Vendors)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                      style={{ width: "12%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Component Bottom Insights */}
              <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-2 flex items-center justify-between font-mono">
                <span>🛡️ Continuous Perimeter Scan Mode</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold bg-slate-800/60 px-2 py-0.5 rounded">
                  NIST 800-161 Aligned
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="platform-features"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Platform Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "HTTP Security Header Analysis",
              desc: "Evaluates perimeters for HSTS, CSP, and cross-framing defenses.",
            },
            {
              title: "DNS Security Validation",
              desc: "Validates corporate cryptographic alignment using SPF and DMARC configurations.",
            },
            {
              title: "Vendor Risk Scoring",
              desc: "Generates uniform corporate maturity rankings based on passive scanning rules.",
            },
            {
              title: "PDF Executive Reports",
              desc: "Exports beautiful high-fidelity audits for security stakeholders with one click.",
            },
            {
              title: "Email Risk Alerts",
              desc: "Triggers background Nodemailer despatches when high-severity threats break boundaries.",
            },
            {
              title: "Historical Scan Ledger",
              desc: "Tracks changes over time by caching assets securely inside MongoDB Atlas.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[#0c1222]/50 border border-slate-800/80 p-5 rounded-2xl"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400 mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">{f.title}</h4>
              <p className="text-xs text-slate-400 font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE BIGGEST MISSING PIECE: SECURITY SCALE METRICS */}
      <section className="max-w-5xl mx-auto px-6 py-12 bg-gradient-to-r from-[#070c16] to-[#0c1222] border border-slate-800/80 rounded-3xl my-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              15,000+
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Vendor Assessments
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
              99.8%
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Platform Availability
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-sky-400 tracking-tight">
              250+
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Organizations Protected
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-purple-400 tracking-tight">
              1M+
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Security Headers Analyzed
            </div>
          </div>
        </div>
        <p className="text-[9px] font-mono text-center text-slate-600 mt-4 italic">
          Metrics represent illustrative network scale performance capability
          profiles.
        </p>
      </section>

      <section
        id="how-it-works"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          How Risk Sentinel Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Discover",
              body: "Map vendor assets and dependencies automatically.",
            },
            {
              title: "Assess",
              body: "Analyze configurations, headers, and signatures.",
            },
            {
              title: "Act",
              body: "Prioritize and trigger remediation workflows.",
            },
          ].map((s, idx) => (
            <div
              key={s.title}
              className="p-6 rounded-2xl flex flex-col gap-4"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.06))",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div className="font-bold text-emerald-400">{idx + 1}</div>
              </div>
              <h4
                className="font-bold text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                {s.title}
              </h4>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="dashboard-preview"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Interactive Dashboard Preview
        </h3>
        <div className="w-full bg-[#080d1a] border border-slate-800/80 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row gap-6">
          {/* Simulation Controls Left */}
          <div className="flex-1 space-y-4">
            <div className="text-xs text-emerald-400 font-mono tracking-widest uppercase font-bold">
              ▶️ Live Product Sandbox
            </div>
            <h4 className="text-lg font-bold text-white">
              Test-Drive the Core Engine
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Type an enterprise domain below to simulate our passive network
              packet and DNS cryptanalysis sequencing layout.
            </p>

            <div className="space-y-3 pt-2">
              <div className="relative">
                <input
                  type="text"
                  defaultValue="target-vendor.com"
                  id="sim-input"
                  className="w-full h-10 bg-[#0d1527] border border-slate-800 rounded-xl px-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500/40"
                />
              </div>
              <button
                onClick={() => {
                  const btn = document.getElementById("sim-btn");
                  const panel = document.getElementById("sim-panel");
                  btn.innerText = "Analyzing Node Frameworks...";
                  btn.disabled = true;

                  setTimeout(() => {
                    panel.innerHTML = `
                      <div class="animate-fadeIn space-y-4">
                        <div class="flex justify-between items-center border-b border-slate-800/60 pb-3">
                          <span class="font-mono text-xs text-emerald-400 font-bold">target-vendor.com</span>
                          <span class="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase">Grade F</span>
                        </div>
                        <div class="flex items-center gap-4">
                          <div class="text-3xl font-black text-white">35<span class="text-xs text-slate-500 font-normal">/100</span></div>
                          <div class="text-[10px] text-red-400 font-medium">⚠️ Critical Infrastructure Exploits Detected</div>
                        </div>
                        <div class="space-y-1.5 text-[11px] font-mono">
                          <div class="text-red-400">❌ Strict-Transport-Security: MISSING</div>
                          <div class="text-emerald-400">✅ DMARC Spoofing Record: CONFIGURED</div>
                        </div>
                      </div>
                    `;
                    btn.innerText = "Scan Complete";
                  }, 1800);
                }}
                id="sim-btn"
                className="w-full h-10 bg-[#10b981] text-slate-950 font-bold text-xs rounded-xl uppercase tracking-wider transition-all hover:brightness-110"
              >
                Run Sandbox Audit
              </button>
            </div>
          </div>

          {/* Simulation Output Display Screen Right */}
          <div
            className="flex-1 bg-[#050811] border border-slate-900 rounded-xl p-5 flex flex-col justify-between min-h-[220px]"
            id="sim-panel"
          >
            {/* Simulated Browser Frame Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                <span className="text-[10px] font-mono text-slate-500 ml-2">preview_instance.json</span>
              </div>
              <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">PASSED 8/12</span>
            </div>

            {/* Score + Radial */}
            <div className="flex items-center justify-between gap-4 py-2">
              <div className="space-y-1">
                <div className="text-2xl font-black text-white tracking-tight">88<span className="text-xs text-slate-500 font-normal"> / 100</span></div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Grade A Resilience</div>
              </div>
              <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-slate-800 border-t-emerald-500" style={{ animation: "spin 3s linear infinite" }}>
                <span className="text-[10px] font-mono font-bold text-slate-400">92%</span>
              </div>
            </div>

            {/* Security Checks */}
            <div className="space-y-1.5 pt-2 border-t border-slate-900 font-mono text-[10px]">
              <div className="flex justify-between text-emerald-400">
                <span>✅ Content-Security-Policy</span>
                <span>ACTIVE</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>✅ SPF Verification Record</span>
                <span>VALID</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>⚠️ Public Open Infrastructure Ports</span>
                <span>1 EXPOSED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="benefits"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Key Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Faster detection and response",
            "Reduced operational overhead",
            "Evidence for audits and compliance",
            "Actionable, prioritized findings",
            "Seamless integrations with tooling",
            "Enterprise-grade data retention",
          ].map((b) => (
            <div
              key={b}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
              }}
            >
              <h4
                className="font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {b}
              </h4>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Short description highlighting why this matters for enterprise
                security teams.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="faq"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          FAQ
        </h3>
        <div className="space-y-3">
          {[
            {
              q: "How often are vendors rescanned?",
              a: "We continuously monitor and perform full rescans on a configurable cadence; critical changes trigger immediate re-evaluation.",
            },
            {
              q: "Can I export reports?",
              a: "Yes — generate audit-ready reports in PDF/CSV formats and schedule automated exports to your storage.",
            },
            {
              q: "Does it integrate with SIEMs?",
              a: "Out-of-the-box connectors are available for popular SIEM and ticketing platforms.",
            },
          ].map((item, idx) => (
            <FAQItem
              key={item.q}
              index={idx}
              question={item.q}
              answer={item.a}
            />
          ))}
        </div>
      </section>

      <section
        id="cta"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <div
          className="rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to reduce vendor risk?
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Start a free evaluation or book a demo to see Risk Sentinel in
              your environment.
            </p>
          </div>
          <div className="flex gap-3 mt-6 md:mt-0">
            <Link
              to="/login"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="px-6 py-3.5 rounded-xl text-sm"
              style={{
                backgroundColor: "var(--bg-card-inner)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-12 relative z-10">
        <div
          className="rounded-2xl p-6 mt-6"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              <div>
                <div
                  className="font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  RISK SENTINEL
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Enterprise Vendor Risk Intelligence
                </div>
              </div>
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              © {new Date().getFullYear()} Risk Sentinel — All rights reserved
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
