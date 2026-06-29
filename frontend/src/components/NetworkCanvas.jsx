import { useEffect, useRef } from "react";

const NODE_COUNT_BASE = 80;        // nodes on desktop
const CONNECTION_DIST = 160;       // max px to draw a line between nodes
const MOUSE_ATTRACT_DIST = 180;    // px radius of mouse influence
const MOUSE_FORCE = 0.012;         // strength of mouse pull
const FLOAT_SPEED = 0.35;          // max px/frame drift
const LINE_OPACITY = 0.18;         // max line alpha
const NODE_OPACITY = 0.55;         // node fill alpha
const NODE_RADIUS_MIN = 1.2;
const NODE_RADIUS_MAX = 2.8;

// brand palette — green / cyan / teal
const PALETTE = ["#10b981", "#34d399", "#2dd4bf", "#22d3ee", "#6ee7b7"];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function NetworkCanvas() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    nodes: [],
    mouse: { x: -9999, y: -9999 },
    raf: null,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const state = stateRef.current;

    /* ── resize ── */
    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = state.width;
      canvas.height = state.height;
      spawnNodes();
    }

    /* ── spawn ── */
    function spawnNodes() {
      const density = (state.width * state.height) / (1920 * 900);
      const count = Math.round(NODE_COUNT_BASE * Math.max(0.4, density));
      state.nodes = Array.from({ length: count }, () => ({
        x: randomBetween(0, state.width),
        y: randomBetween(0, state.height),
        vx: randomBetween(-FLOAT_SPEED, FLOAT_SPEED),
        vy: randomBetween(-FLOAT_SPEED, FLOAT_SPEED),
        r: randomBetween(NODE_RADIUS_MIN, NODE_RADIUS_MAX),
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        pulse: randomBetween(0, Math.PI * 2),
        pulseSpeed: randomBetween(0.008, 0.022),
      }));
    }

    /* ── mouse ── */
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      state.mouse.x = -9999;
      state.mouse.y = -9999;
    }

    /* ── draw loop ── */
    function draw() {
      const { width, height, nodes, mouse } = state;
      ctx.clearRect(0, 0, width, height);

      // update nodes
      for (const n of nodes) {
        // mouse attraction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_ATTRACT_DIST && dist > 1) {
          n.vx += (dx / dist) * MOUSE_FORCE;
          n.vy += (dy / dist) * MOUSE_FORCE;
        }

        // dampen velocity so it doesn't explode
        n.vx *= 0.98;
        n.vy *= 0.98;

        // clamp speed
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > FLOAT_SPEED * 3) {
          n.vx = (n.vx / speed) * FLOAT_SPEED * 3;
          n.vy = (n.vy / speed) * FLOAT_SPEED * 3;
        }

        n.x += n.vx;
        n.y += n.vy;
        n.pulse += n.pulseSpeed;

        // wrap around edges
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DIST) {
            const alpha = LINE_OPACITY * (1 - d / CONNECTION_DIST);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${hexToRgb(a.color)},${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // draw nodes
      for (const n of nodes) {
        const pulseFactor = 0.85 + 0.15 * Math.sin(n.pulse);
        const alpha = NODE_OPACITY * pulseFactor;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(n.color)},${alpha.toFixed(3)})`;
        ctx.fill();
      }

      state.raf = requestAnimationFrame(draw);
    }

    // init
    resize();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);
    state.raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
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
