import React from "react";
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
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import NetworkCanvas from "../components/NetworkCanvas";

function Home() {
  const { isDark, toggle } = useTheme();

  return (
    <div
      className="min-h-screen relative overflow-hidden selection:bg-emerald-500/30"
      style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: `radial-gradient(circle, var(--orb1), transparent)` }}
      />
      <div
        className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: `radial-gradient(circle, var(--orb2), transparent)` }}
      />

      {/* ─── NAVBAR ─── */}
      <nav
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-16 backdrop-blur-md rounded-2xl flex items-center justify-between px-6 z-50 shadow-2xl shadow-black/20"
        style={{
          backgroundColor: "var(--bg-nav)",
          borderColor: "var(--border-color)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
            RISK SENTINEL
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-mono"
            style={{
              backgroundColor: "var(--bg-card-inner)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            v2.1
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
          <a href="#features" className="hover:text-emerald-400 transition-colors">Core Engine</a>
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
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
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
      <main className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pt-32 pb-24 md:pt-44 flex flex-col md:flex-row items-center gap-16 relative min-h-[92vh]">
        <NetworkCanvas />
        <div className="flex-1 text-center md:text-left relative z-[2]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium mb-6 animate-pulse">
            <Activity className="w-3.5 h-3.5" /> Supply-Chain Threat Monitoring Active
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6" style={{ color: "var(--text-primary)" }}>
            Results-Driven <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              Vendor Risk Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed font-normal" style={{ color: "var(--text-secondary)" }}>
            Audit third-party vendor safety architectures instantly. Inspect
            cryptographic DNS structures, evaluate HTTP response headers, and
            scan infrastructure nodes across real-time global asset maps.
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
              View Architecture Suite <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </Link>
          </div>
        </div>

        {/* Hero orb */}
        <div className="flex-1 w-full flex justify-center relative z-[2]">
          <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full relative bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent flex items-center justify-center p-8 border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.15)] animate-[spin_60s_linear_infinite]">
            <div
              className="w-full h-full rounded-full flex flex-col items-center justify-center relative shadow-2xl text-center p-4"
              style={{ backgroundColor: "var(--bg-card-inner)", border: "1px solid var(--border-subtle)" }}
            >
              <Shield className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)] mb-4" />
              <div className="font-mono text-[11px] text-emerald-500 tracking-widest font-bold">NODE SECURE</div>
              <div className="text-xs mt-1 font-light px-4" style={{ color: "var(--text-secondary)" }}>
                Continuous Passive System Sweeping Engine Active
              </div>
            </div>
            <div className="absolute top-4 right-4 p-2 rounded-xl shadow-xl" style={{ backgroundColor: "var(--bg-card-inner)", border: "1px solid var(--border-color)" }}>
              <Terminal className="w-4 h-4 text-sky-400" />
            </div>
            <div className="absolute bottom-8 left-0 p-2 rounded-xl shadow-xl" style={{ backgroundColor: "var(--bg-card-inner)", border: "1px solid var(--border-color)" }}>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>
      </main>

      {/* ─── FEATURES ─── */}
      <section id="features" className="w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 pb-32 relative z-10">
        <div className="w-full h-[1px] mb-20" style={{ background: `linear-gradient(to right, transparent, var(--border-subtle), transparent)` }} />

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
              <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-5 text-${color}-400 group-hover:bg-${color}-500/20 transition-all`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{title}</h3>
              <p className="text-sm leading-relaxed font-light" style={{ color: "var(--text-secondary)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
