import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import NetworkCanvas from "../components/NetworkCanvas";

const scanSteps = [
    "Initializing Risk Sentinel Engine...",
    "Resolving domain",
    "Checking HTTP Security Headers",
    "Checking DNS",
    "Inspecting Infrastructure",
    "Calculating Risk Score",
    "Generating Executive Report",
];

const completedHeaders = ["HSTS", "CSP", "X-Frame-Options"];
const completedDns = ["SPF", "DMARC"];

function FAQItem({ question, answer }) {
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
  const [domain, setDomain] = useState("example-vendor.com");
  const [scanStatus, setScanStatus] = useState("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [loadingDots, setLoadingDots] = useState("");

  useEffect(() => {
    if (scanStatus !== "scanning") return undefined;

    const timeoutIds = [];
    scanSteps.forEach((_, index) => {
      timeoutIds.push(
        setTimeout(
          () => {
            setActiveStep(index);
            setProgress(Math.round(((index + 1) / scanSteps.length) * 100));
          },
          450 * index + 300,
        ),
      );
    });

    timeoutIds.push(
      setTimeout(
        () => {
          setLoadingDots("");
          setScanStatus("complete");
        },
        450 * scanSteps.length + 450,
      ),
    );

    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, [scanStatus]);

  useEffect(() => {
    if (scanStatus !== "scanning") return undefined;
    const dotTimer = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "" : `${prev}.`));
    }, 400);
    return () => clearInterval(dotTimer);
  }, [scanStatus]);

  useEffect(() => {
    if (scanStatus === "complete") {
      let current = 0;
      const target = 91;
      const countTimer = setInterval(() => {
        current += 2;
        setAnimatedScore(current >= target ? target : current);
        if (current >= target) clearInterval(countTimer);
      }, 18);
      return () => clearInterval(countTimer);
    }
    return undefined;
  }, [scanStatus]);

  const useCountUp = (target, trigger, duration = 1500) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!trigger) return;
      let start = 0;
      const step = Math.ceil(target / (duration / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(start);
      }, 16);
      return () => clearInterval(timer);
    }, [trigger, target, duration]);
    return count;
  };

  const [metricsVisible, setMetricsVisible] = useState(false);
  const metricsRef = (el) => {
    if (!el || metricsVisible) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMetricsVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
  };
  const count500 = useCountUp(500, metricsVisible);
  const count95 = useCountUp(95, metricsVisible);

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
            Reduce Third-Party Risk <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              Before It Becomes a Breach
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed font-light">
            Continuously monitor vendors, detect security weaknesses, reduce
            compliance effort, and deliver executive-ready reports that align
            security decisions with business risk.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/login"
              className="group px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:brightness-110"
            >
              Run Free Vendor Assessment
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
              Analyze a Vendor
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
            Inspired by enterprise security workflows used across modern organizations
          </h4>
          <p
            className="text-sm max-w-2xl mx-auto leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Risk Sentinel is built to match the operational priorities of
            security, compliance and procurement teams while preserving the
            review processes that matter most to enterprise leaders.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            {[
              "SecureOps",
              "RiskGrid",
              "VaultPoint",
              "CloudAnchor",
              "SentinelSync",
            ].map((logo) => (
              <div
                key={logo}
                className="min-w-[110px] px-5 py-4 rounded-3xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 ease-out hover:scale-[1.03] hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-[rgba(16,185,129,0.06)]"
              >
                <span className="text-sm font-semibold tracking-[0.12em] uppercase">
                  {logo}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" ref={metricsRef}>
            {[
              { value: `${count500}+`, label: "Vendor Assessments Simulated" },
              { value: `${count95}%`, label: "Configuration Detection Accuracy" },
              { value: "24/7", label: "Continuous Monitoring" },
              { value: "Enterprise Ready", label: "Executive Reports" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5"
              >
                <div className="text-3xl font-black text-white mb-2">
                  {item.value}
                </div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  {item.label}
                </div>
              </div>
            ))}
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

              <div className="grid grid-cols-1 gap-6 my-12 text-left">
                {[
                  {
                    problem: "Weak vendor security hides real risk.",
                    solution: "Continuously assess third-party posture without disrupting business systems.",
                    impact: "Reduce the chance that a supplier vulnerability becomes a board-level incident.",
                  },
                  {
                    problem: "Audit teams spend hours chasing fragmented evidence.",
                    solution: "Generate executive-ready reports with compliance context.",
                    impact: "Speed decision-making and simplify vendor review cycles.",
                  },
                  {
                    problem: "Procurement lacks a trusted vendor risk signal.",
                    solution: "Centralize vendor security scores and trend history for every supplier.",
                    impact: "Identify risky vendors before they enter contracts.",
                  },
                ].map((item) => (
                  <div
                    key={item.problem}
                    className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card-inner)] p-5"
                  >
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-3">
                      Problem
                    </div>
                    <div className="text-sm text-white font-semibold mb-3">
                      {item.problem}
                    </div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-mono mb-3">
                      Solution
                    </div>
                    <div className="text-sm text-slate-300 leading-relaxed mb-3">
                      {item.solution}
                    </div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-mono mb-2">
                      Business Impact
                    </div>
                    <div className="text-sm text-slate-400 leading-relaxed">
                      {item.impact}
                    </div>
                  </div>
                ))}
              </div>
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
              desc: "Detect missing or weak header protections so your team can close vendor configuration gaps before they become incidents.",
            },
            {
              title: "DNS Security Validation",
              desc: "Verify SPF and DMARC alignment across suppliers to reduce spoofing risk and protect email trust.",
            },
            {
              title: "Vendor Risk Scoring",
              desc: "Turn raw vendor signals into a clear security grade that makes procurement and security reviews faster.",
            },
            {
              title: "PDF Executive Reports",
              desc: "Deliver board-ready insights and compliance evidence from every assessment with one click.",
            },
            {
              title: "Email Risk Alerts",
              desc: "Notify stakeholders instantly when a vendor crosses a risk threshold so teams can act before exposure spreads.",
            },
            {
              title: "Historical Scan Ledger",
              desc: "See how vendor security changes over time and compare trends across your supplier portfolio.",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-0 gap-y-6">
          {[
            { title: "Discover", body: "Identify vendor assets, domains, and technology stacks with a unified collection process." },
            { title: "Collect", body: "Gather observable vendor signals from headers, DNS, TLS, and infrastructure without active disruption." },
            { title: "Analyze", body: "Turn visibility into actionable risk insights using enterprise-grade rules and security context." },
            { title: "Score", body: "Apply a consistent risk rating across suppliers so stakeholders can compare security posture instantly." },
            { title: "Report", body: "Generate executive summaries and compliance-ready evidence for security reviews and vendor committees." },
            { title: "Monitor", body: "Continuously watch for change and trigger alerts when vendor posture deteriorates." },
          ].map((s, idx) => (
            <div key={s.title} className="relative flex items-stretch">
              {/* Card */}
              <div
                className="group flex-1 relative p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.06))", border: "1px solid var(--border-subtle)" }}
                >
                  <span className="font-bold text-emerald-400">{idx + 1}</span>
                </div>
                <h4 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{s.title}</h4>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{s.body}</p>
              </div>
              {/* Arrow — show after every card except last in each row and not the last card */}
              {idx !== 5 && (
                <div className="hidden xl:flex items-center justify-center w-8 shrink-0 z-10">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-4 h-[1px] bg-emerald-500/30" />
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500/50 -ml-1" />
                  </div>
                </div>
              )}
              {/* Mobile arrow below each card except last */}
              {idx !== 5 && (
                <div className="xl:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                  <div className="h-3 w-[1px] bg-emerald-500/30" />
                  <ChevronRight className="w-3 h-3 text-emerald-500/40 rotate-90" />
                </div>
              )}
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
          Live Risk Assessment Preview
        </h3>
        <div className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl p-6 flex flex-col xl:flex-row gap-6">
          <div className="xl:w-[40%] rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card-inner)] p-6 flex flex-col justify-between gap-5">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold font-mono mb-3">
                Live Product Sandbox
              </div>
              <h4
                className="text-3xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Live Risk Assessment Preview
              </h4>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                Experience how Risk Sentinel evaluates vendor security posture
                in real time before you even sign in.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 font-medium font-mono">
                Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example-vendor.com"
                className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                type="button"
                onClick={() => {
                  if (scanStatus === "scanning") return;
                  setActiveStep(0);
                  setProgress(0);
                  setAnimatedScore(0);
                  setLoadingDots("");
                  setScanStatus("scanning");
                }}
                disabled={scanStatus === "scanning"}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold py-3 uppercase tracking-[0.15em] shadow-lg shadow-emerald-500/20 transition-transform duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {scanStatus === "scanning"
                  ? "Launching Sandbox Audit..."
                  : scanStatus === "complete"
                    ? "Run Another Audit"
                    : "Run Sandbox Audit"}
              </button>
              <p className="text-xs leading-5 text-slate-400">
                This demonstration uses a simulated security assessment based on
                our real analysis workflow.
              </p>
            </div>
          </div>

          <div className="xl:w-[60%] rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card-inner)] p-6 flex flex-col gap-5 shadow-inner min-h-[460px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-mono font-semibold mb-2">
                  Simulated Secure Overview
                </div>
                <div className="text-sm font-medium text-[var(--text-primary)]">
                  Vendor sandbox audit for{" "}
                  <span className="text-emerald-400">
                    {domain || "example-vendor.com"}
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs text-slate-400 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                <span>preview_instance.json</span>
              </div>
            </div>

            {scanStatus === "scanning" ? (
              <div className="flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {scanSteps[activeStep]}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {loadingDots}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {scanSteps.map((step, index) => {
                      const isActive = index === activeStep;
                      const isComplete = index < activeStep;
                      return (
                        <div
                          key={step}
                          className={`rounded-2xl border px-4 py-3 transition-all duration-300 ${
                            isActive
                              ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.09)]"
                              : "border-[var(--border-color)] bg-[var(--bg-card)]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <div className="inline-flex items-center gap-2">
                              <span
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  isComplete
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : isActive
                                      ? "bg-emerald-400/15 text-emerald-300"
                                      : "bg-slate-800 text-slate-500"
                                }`}
                              >
                                {isComplete ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : isActive ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Shield className="w-4 h-4" />
                                )}
                              </span>
                              <span
                                className={
                                  isActive
                                    ? "font-semibold text-emerald-200"
                                    : "text-slate-400"
                                }
                              >
                                {step}
                              </span>
                            </div>
                            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                              {isComplete
                                ? "Done"
                                : isActive
                                  ? "In progress"
                                  : "Pending"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500 font-mono">
                    <span>Audit progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : scanStatus === "complete" ? (
              <div className="space-y-6">
                <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-mono mb-2">
                        Vendor Performance Overview
                      </div>
                      <div className="text-3xl font-bold text-white tracking-tight">
                        {domain || "example-vendor.com"}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-900/80 px-4 py-3 border border-slate-800">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                        Risk Grade
                      </span>
                      <span className="rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-2 text-sm font-semibold">
                        A
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[170px_minmax(0,1fr)] gap-5">
                  <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 flex items-center justify-center shadow-sm">
                    <div className="relative w-32 h-32">
                      <div
                        className="absolute inset-0 rounded-full bg-slate-900"
                        style={{
                          boxShadow: "inset 0 0 0 5px rgba(56,189,248,0.08)",
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          backgroundImage: `conic-gradient(rgba(16,185,129,0.9) ${animatedScore * 3.6}deg, rgba(148,163,184,0.14) ${animatedScore * 3.6}deg)`,
                        }}
                      />
                      <div className="absolute inset-4 rounded-full bg-[var(--bg-card-inner)] flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-white">
                          {animatedScore}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold">
                          Score
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-mono mb-4">
                        HTTP Security Headers
                      </div>
                      {completedHeaders.map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between gap-3 mb-3 last:mb-0"
                        >
                          <span className="inline-flex items-center gap-2 text-sm text-white">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            {item}
                          </span>
                          <span className="text-[11px] uppercase text-emerald-300 tracking-[0.2em] font-semibold">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-mono mb-4">
                        DNS Protection
                      </div>
                      <div className="space-y-3">
                        {completedDns.map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between gap-3 text-sm text-white"
                          >
                            <span className="inline-flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              {item}
                            </span>
                            <span className="text-[11px] uppercase text-emerald-300 tracking-[0.2em] font-semibold">
                              Valid
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-mono mb-4">
                        Open Ports
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-white font-semibold">
                        <span className="text-emerald-400">443</span>
                        <span className="text-slate-500 text-xs uppercase tracking-[0.2em]">
                          secure
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm text-emerald-100 shadow-sm">
                  <div className="font-semibold text-white mb-2">
                    Executive Alert
                  </div>
                  <div className="text-slate-300">
                    No critical exposure detected.
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-emerald-300 border border-emerald-500/20 transition hover:bg-[#111c31]"
                  >
                    View Full Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex-1 rounded-[28px] border border-[var(--border-color)] bg-[var(--bg-card)] p-6 flex flex-col justify-center items-center text-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />{" "}
                  Sandbox preview ready
                </div>
                <div className="text-lg font-semibold text-white max-w-sm">
                  Run a sandbox audit to reveal the Risk Sentinel enterprise
                  dashboard experience.
                </div>
                <div className="text-sm text-slate-500 max-w-[340px]">
                  The preview mimics our full product environment with live
                  score, grade badge, security controls, and executive alerting.
                </div>
              </div>
            )}
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
          Business Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Security Team",
              desc: "Continuous monitoring, automated risk scoring, and fast detection across vendor infrastructure.",
            },
            {
              title: "Compliance Team",
              desc: "Audit-ready reports, evidence trails, and control alignment for board and regulatory reviews.",
            },
            {
              title: "Procurement Team",
              desc: "Vendor comparison and risk context so sourcing decisions are grounded in security data.",
            },
            {
              title: "Executives",
              desc: "High-level risk visibility and alerts that make vendor exposure measurable and accountable.",
            },
          ].map((item) => (
            <div
              key={item.title}
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
                {item.title}
              </h4>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="capabilities"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-20 relative z-10"
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          Product Capabilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            {
              title: "Executive Reports",
              desc: "Export concise vendor risk summaries for CISO and board reviews.",
            },
            {
              title: "Risk Scoring",
              desc: "Standardize vendor comparisons with a transparent security grade.",
            },
            {
              title: "Vendor History",
              desc: "Track vendor posture changes over time and identify trend shifts.",
            },
            {
              title: "PDF Export",
              desc: "Create shareable reports for audits, procurement reviews, and leadership.",
            },
            {
              title: "Email Alerts",
              desc: "Notify teams when vendor security lapses or exposures emerge.",
            },
            {
              title: "Multivendor Comparison",
              desc: "Compare supplier security posture side by side to support sourcing decisions.",
            },
            {
              title: "Historical Timeline",
              desc: "See what changed, when it changed, and how vendor risk evolved.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 transition-all hover:-translate-y-1"
            >
              <h4
                className="font-semibold text-lg mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {item.title}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.desc}
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
              a: "Vendor posture is reassessed continuously, with critical exposures triggering immediate re-evaluation and alerting.",
            },
            {
              q: "Can I export compliance reports?",
              a: "Yes — generate audit-ready reports in PDF format and archive evidence for security and procurement reviews.",
            },
            {
              q: "Does Risk Sentinel store vendor data?",
              a: "Vendor snapshots are retained securely so you can compare historical trends without exposing raw infrastructure details.",
            },
            {
              q: "Can this integrate with SIEM?",
              a: "Risk Sentinel is designed to feed your existing toolchain through alerts, exports, and API-ready risk data.",
            },
            {
              q: "How is the risk score calculated?",
              a: "A normalized score combines header, DNS, infrastructure and historical findings into a consistent vendor risk grade.",
            },
            {
              q: "What frameworks are supported?",
              a: "We support common security and compliance frameworks through our reporting model and can adapt to your review standards.",
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
              Start identifying risky vendors before they become business incidents.
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Launch a free assessment or schedule a demo to see how Risk Sentinel fits into your security program.
            </p>
          </div>
          <div className="flex gap-3 mt-6 md:mt-0">
            <Link
              to="/login"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Run Free Assessment
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
              Book Product Demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-12 relative z-10">
        <div className="border-t pt-12 mt-4" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            {/* Product */}
            <div className="space-y-3">
              <div className="font-bold uppercase tracking-wider text-[10px] mb-4" style={{ color: "var(--text-primary)" }}>Product</div>
              <Link to="/" className="block hover:text-emerald-400 transition-colors">Platform Overview</Link>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Risk Scoring Engine</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Executive Reports</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Continuous Monitoring</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Vendor Comparison</div>
            </div>
            {/* Resources */}
            <div className="space-y-3">
              <div className="font-bold uppercase tracking-wider text-[10px] mb-4" style={{ color: "var(--text-primary)" }}>Resources</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Documentation</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">API Reference</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Roadmap</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Security Blog</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Platform Status</div>
            </div>
            {/* Company */}
            <div className="space-y-3">
              <div className="font-bold uppercase tracking-wider text-[10px] mb-4" style={{ color: "var(--text-primary)" }}>Company</div>
              <Link to="/about" className="block hover:text-emerald-400 transition-colors">About Us</Link>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Careers</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Contact</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Press & Media</div>
              <a href="https://github.com/ashok770/vendor-security-scorecard" target="_blank" rel="noreferrer" className="block hover:text-emerald-400 transition-colors">GitHub</a>
            </div>
            {/* Legal */}
            <div className="space-y-3">
              <div className="font-bold uppercase tracking-wider text-[10px] mb-4" style={{ color: "var(--text-primary)" }}>Legal & Security</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Policy</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Cookie Policy</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Security Disclosure</div>
              <div className="hover:text-emerald-400 transition-colors cursor-pointer">Compliance</div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>RISK SENTINEL</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>— Enterprise Vendor Risk Intelligence</span>
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} Risk Sentinel Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
