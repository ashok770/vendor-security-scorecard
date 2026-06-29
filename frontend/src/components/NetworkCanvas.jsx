import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

// ── tuning ───────────────────────────────────────────────
const NODE_COUNT      = 110;
const CONNECTION_DIST = 200;
const MOUSE_DIST      = 220;   // px — node attraction + brightness radius
const MOUSE_FORCE     = 0.018;
const FLOAT_SPEED     = 0.4;
const NODE_R_MIN      = 2;
const NODE_R_MAX      = 4.5;
const CURSOR_GLOW_R   = 65;    // radius of the soft cursor glow
// ─────────────────────────────────────────────────────────

const DARK_PALETTE  = ["#10b981","#34d399","#2dd4bf","#22d3ee","#6ee7b7","#5eead4"];
const LIGHT_PALETTE = ["#059669","#0d9488","#0891b2","#10b981","#0f766e","#0e7490"];

function rnd(a, b) { return a + Math.random() * (b - a); }
function hexRgb(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}
// smooth lerp helper
function lerp(a, b, t) { return a + (b - a) * t; }

export default function NetworkCanvas() {
  const canvasRef = useRef(null);
  const state     = useRef({
    nodes: [],
    mouse: { x: -9999, y: -9999 },
    // cursor glow alpha — lerped each frame for smooth fade-in / fade-out
    cursorAlpha: 0,
    mouseInside: false,
    raf: null,
    w: 0,
    h: 0,
  });
  const { isDark } = useTheme();
  const isDarkRef  = useRef(isDark);
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const s      = state.current;

    // ── resize ───────────────────────────────────────────
    function resize() {
      const p      = canvas.parentElement.getBoundingClientRect();
      s.w          = p.width;
      s.h          = p.height;
      canvas.width  = s.w;
      canvas.height = s.h;
      spawn();
    }

    // ── spawn nodes ──────────────────────────────────────
    function spawn() {
      const scale = (s.w * s.h) / (1440 * 800);
      const count = Math.round(NODE_COUNT * Math.max(0.5, scale));
      s.nodes = Array.from({ length: count }, () => ({
        x:          rnd(0, s.w),
        y:          rnd(0, s.h),
        vx:         rnd(-FLOAT_SPEED, FLOAT_SPEED),
        vy:         rnd(-FLOAT_SPEED, FLOAT_SPEED),
        r:          rnd(NODE_R_MIN, NODE_R_MAX),
        colorIdx:   Math.floor(Math.random() * DARK_PALETTE.length),
        phase:      rnd(0, Math.PI * 2),
        phaseSpeed: rnd(0.01, 0.025),
        brightness: 0,   // 0 = normal, 1 = fully lit by cursor
      }));
    }

    // ── mouse tracking — relative to canvas rect ─────────
    function onMove(e) {
      const r      = canvas.getBoundingClientRect();
      s.mouse.x    = e.clientX - r.left;
      s.mouse.y    = e.clientY - r.top;
      s.mouseInside = (
        s.mouse.x >= 0 && s.mouse.x <= s.w &&
        s.mouse.y >= 0 && s.mouse.y <= s.h
      );
    }
    function onLeave() {
      s.mouseInside = false;
    }

    // ── main draw loop ────────────────────────────────────
    function draw() {
      const { w, h, nodes, mouse } = s;
      const dark    = isDarkRef.current;
      const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;

      const lineOpacityBase = dark ? 0.55 : 0.50;
      const lineWidthBase   = dark ? 1.0  : 1.1;
      const nodeOpacity     = dark ? 0.90 : 0.85;
      const glowBlur        = dark ? 10   : 8;
      const glowOpacity     = dark ? 0.35 : 0.30;

      ctx.clearRect(0, 0, w, h);

      // ── 1. cursor glow — drawn first so it sits below everything ──
      // lerp alpha toward target for smooth fade in/out
      const targetAlpha = s.mouseInside ? (dark ? 0.28 : 0.22) : 0;
      s.cursorAlpha     = lerp(s.cursorAlpha, targetAlpha, 0.07);

      if (s.cursorAlpha > 0.003) {
        const gx   = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, CURSOR_GLOW_R);
        // cyan centre → transparent edge
        gx.addColorStop(0,    `rgba(34,211,238,${(s.cursorAlpha * 2.0).toFixed(3)})`);
        gx.addColorStop(0.35, `rgba(16,185,129,${(s.cursorAlpha * 1.2).toFixed(3)})`);
        gx.addColorStop(1,    `rgba(16,185,129,0)`);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, CURSOR_GLOW_R, 0, Math.PI * 2);
        ctx.fillStyle = gx;
        ctx.fill();
      }

      // ── 2. update nodes ──────────────────────────────────
      for (const n of nodes) {
        const dx   = mouse.x - n.x;
        const dy   = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // attraction
        if (dist < MOUSE_DIST && dist > 1) {
          n.vx += (dx / dist) * MOUSE_FORCE;
          n.vy += (dy / dist) * MOUSE_FORCE;
        }

        // brightness — lerp toward 1 when inside radius, back to 0 otherwise
        const targetBrightness = (s.mouseInside && dist < MOUSE_DIST)
          ? (1 - dist / MOUSE_DIST)   // stronger near cursor centre
          : 0;
        n.brightness = lerp(n.brightness, targetBrightness, 0.06);

        n.vx *= 0.97;
        n.vy *= 0.97;
        const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if (spd > FLOAT_SPEED * 3.5) {
          n.vx = (n.vx / spd) * FLOAT_SPEED * 3.5;
          n.vy = (n.vy / spd) * FLOAT_SPEED * 3.5;
        }
        n.x += n.vx;
        n.y += n.vy;
        n.phase += n.phaseSpeed;

        if (n.x < -30) n.x = w + 30; if (n.x > w + 30) n.x = -30;
        if (n.y < -30) n.y = h + 30; if (n.y > h + 30) n.y = -30;
      }

      // ── 3. connections ───────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DIST) {
            const t = 1 - d / CONNECTION_DIST;

            // boost opacity by the average brightness of the two endpoint nodes
            const brightBoost = (a.brightness + b.brightness) * 0.5;
            const alpha       = Math.min(0.95, lineOpacityBase * t * t + brightBoost * 0.55);
            const width       = lineWidthBase * t + 0.3 + brightBoost * 1.2;

            // shift hue toward cyan when nodes are lit
            const rgb = brightBoost > 0.05
              ? "34,211,238"                         // bright cyan for lit lines
              : hexRgb(palette[a.colorIdx]);         // normal palette colour

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
            ctx.lineWidth   = width;
            ctx.stroke();
          }
        }
      }

      // ── 4. nodes ─────────────────────────────────────────
      for (const n of nodes) {
        const pulse    = 0.8 + 0.2 * Math.sin(n.phase);
        const bright   = n.brightness;
        const r        = n.r * pulse * (1 + bright * 0.5);   // slightly larger when lit
        const rgb      = bright > 0.05 ? "34,211,238" : hexRgb(palette[n.colorIdx]);
        const finalGlow = glowOpacity + bright * 0.45;
        const haloR     = r * (3.5 + bright * 2);

        // glow halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR);
        grad.addColorStop(0, `rgba(${rgb},${finalGlow.toFixed(3)})`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle  = grad;
        ctx.shadowBlur = 0;
        ctx.fill();

        // solid core
        const coreAlpha = Math.min(1, nodeOpacity + bright * 0.1);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.shadowColor = `rgba(${rgb},0.9)`;
        ctx.shadowBlur  = glowBlur + bright * 12;
        ctx.fillStyle   = `rgba(${rgb},${coreAlpha.toFixed(3)})`;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }

      s.raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
    s.raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
