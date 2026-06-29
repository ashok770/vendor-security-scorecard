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
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 relative overflow-hidden selection:bg-emerald-500/30">
      {/* BACKGROUND DECORATION ORB: Gives that high-end glowing background depth from your sample image */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 to-teal-500/0 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-sky-500/10 to-purple-500/0 rounded-full blur-[100px] pointer-events-none" />

      {/* ─── PREMIUM FLOATING NAVBAR ─── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-16 bg-[#0c1222]/70 backdrop-blur-md border border-slate-800/60 rounded-2xl flex items-center justify-between px-6 z-50 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            RISK SENTINEL
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono border border-slate-700/50">
            v2.1
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link to="/" className="text-emerald-400 transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-slate-200 transition-colors">
            Technical Stack
          </Link>
          <a
            href="#features"
            className="hover:text-slate-200 transition-colors"
          >
            Core Engine
          </a>
        </div>

        {/* CTA Button */}
        <div>
          <Link
            to="/login"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold tracking-wide border border-slate-700/60 transition-all shadow-inner"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ─── HERO HERO SECTION (ASYNCHRONIC SPLIT DESIGN) ─── */}
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 md:pt-44 flex flex-col md:flex-row items-center gap-16 relative z-10">
        {/* Left Side: Dynamic Copywriting block */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium mb-6 animate-pulse">
            <Activity className="w-3.5 h-3.5" /> Supply-Chain Threat Monitoring
            Active
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Results-Driven <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              Vendor Risk Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed font-normal">
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
              className="px-6 py-3.5 bg-[#0c1222]/80 hover:bg-[#121b32] text-slate-300 font-semibold rounded-xl text-sm transition-all border border-slate-800 flex items-center justify-center gap-1"
            >
              View Architecture Suite{" "}
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Right Side: The Premium Visual Feature Orb Display Mock */}
        <div className="flex-1 w-full flex justify-center relative">
          <div className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full relative bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent flex items-center justify-center p-8 border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.15)] animate-[spin_60s_linear_infinite]">
            {/* Inner Floating Identity Sphere Node */}
            <div className="w-full h-full rounded-full bg-[#0d1527] border border-slate-800 flex flex-col items-center justify-center relative shadow-2xl text-center p-4">
              <Shield className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)] mb-4" />
              <div className="font-mono text-[11px] text-emerald-500 tracking-widest font-bold">
                NODE SECURE
              </div>
              <div className="text-xs text-slate-400 mt-1 font-light px-4">
                Continuous Passive System Sweeping Engine Active
              </div>
            </div>

            {/* Orbiting Satellite Node Accents */}
            <div className="absolute top-4 right-4 p-2 bg-[#0c1222] border border-slate-800 rounded-xl shadow-xl">
              <Terminal className="w-4 h-4 text-sky-400" />
            </div>
            <div className="absolute bottom-8 left-0 p-2 bg-[#0c1222] border border-slate-800 rounded-xl shadow-xl">
              <Database className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>
      </main>

      {/* ─── FEATURES SUB SECTION ─── */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-6 pb-32 relative z-10"
      >
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-20" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#0c1222]/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/60 transition-all hover:-translate-y-1 duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-5 text-sky-400 group-hover:bg-sky-500/20 transition-all">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Configuration Security
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Scans network perimeter headers natively to evaluate runtime
              protection including strict content guidelines (CSP), HSTS
              enforcement, and cross-framing defensive controls.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0c1222]/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/60 transition-all hover:-translate-y-1 duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-400 group-hover:bg-purple-500/20 transition-all">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Spoofing Protection
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Queries DNS zones to detect active cryptographic alignment rules,
              guaranteeing compliance across published global structural
              protocols.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0c1222]/50 border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700/60 transition-all hover:-translate-y-1 duration-300 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-400 group-hover:bg-amber-500/20 transition-all">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Threat Intelligence
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Connects directly to indexed system intelligence parameters to
              extract server versioning flaws, open listening ports, and
              infrastructure exposures on external target endpoints.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
