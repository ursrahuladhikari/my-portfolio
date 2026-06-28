import React, { useEffect, useState, useRef } from "react";
import {
  Sun,
  Moon,
  Github,
  Linkedin,
  Mail,
  MapPin,
  FileText,
  X,
  Menu,
  Database,
  PieChart,
  BrainCircuit,
  Terminal,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Shield,
  Layers,
  BarChart3,
  Workflow,
  Instagram,
  User,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { CertificationSection } from "./components/Certification/CertificationSection";
import { PageGraphOverlay } from "./components/PageGraphOverlay";
import { Freelance } from "./pages/Freelance";
import { AdminDashboard } from "./pages/AdminDashboard";

const TYPEWRITER_PHRASES = [
  "Elevating Decisions via Data.",
  "Building scalable data pipelines.",
  "BI Analyst / Data Analyst."
];

// Binary Matrix Card — columns of 0/1 that glow near mouse pointer
const HexGridCard = ({ children, className = '', style = {}, isDark = true }) => {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });

  // Use a ref for isDark to avoid re-running useEffect just for the trail color
  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;
    const ctx = canvas.getContext('2d');

    const FONT_SIZE = 14;
    const RADIUS = 120;
    const COLORS = ['#06b6d4', '#ff1493', '#a78bfa', '#22d3ee', '#4ade80'];

    let cols = [], drops = [];

    const build = () => {
      canvas.width  = card.offsetWidth;
      canvas.height = card.offsetHeight;
      const numCols = Math.floor(canvas.width / FONT_SIZE);
      cols = Array.from({ length: numCols }, (_, i) => ({
        x: i * FONT_SIZE + FONT_SIZE / 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: Math.random() * 0.6 + 0.3,
      }));
      drops = cols.map(() => Math.random() * -canvas.height);
    };
    build();

    const ro = new ResizeObserver(build);
    ro.observe(card);

    const draw = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const inside = mouseRef.current.inside;

      if (!inside) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Gentle fade trail — match theme background (Slate 800 for dark, White for light)
      ctx.fillStyle = isDarkRef.current ? 'rgba(30, 41, 59, 0.08)' : 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${FONT_SIZE}px monospace`;

      cols.forEach((col, i) => {
        const y = drops[i] % (canvas.height + FONT_SIZE);
        const dist = Math.sqrt((col.x - mx) ** 2 + (y - my) ** 2);
        const proximity = Math.max(0, 1 - dist / RADIUS);

        // Ambient column — very dim
        const ambientAlpha = 0.06 + Math.random() * 0.04;

        // Mouse-lit cell
        const cellAlpha = ambientAlpha + proximity * 0.9;

        ctx.globalAlpha = cellAlpha;
        ctx.fillStyle = col.color;
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', col.x - FONT_SIZE / 2, y);

        ctx.globalAlpha = 1;
        drops[i] += col.speed * (1 + proximity * 3);

        // Reset when off bottom
        if (drops[i] > canvas.height + FONT_SIZE) {
          drops[i] = -FONT_SIZE;
          col.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999, inside: false }; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${isDark ? 'glass-card' : 'bg-transparent'} ${className}`}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, borderRadius: 'inherit' }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
};

const TechnologyLogo = ({ src, name, color, className = "w-12 h-12 p-2" }) => {
  const [error, setError] = React.useState(false);
  
  if (!src || error) {
    return (
      <div className={`${className} shrink-0 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner`} style={{ background: `${color}20`, color: color, border: `1px solid ${color}40` }}>
        {name.charAt(0)}
      </div>
    );
  }
  
  return (
    <div className={`${className} shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50`}>
      <img src={src} alt={name} className="w-full h-full object-contain drop-shadow-sm" onError={() => setError(true)} />
    </div>
  );
};

const TechnologyCard = ({ tool, activeColor, dark }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logoError, setLogoError] = React.useState(false);

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  const hasLogo = !!tool.logo && !logoError;
  const logoSrc = hasLogo ? `${tool.logo}${tool.logo.includes('?') ? '&' : '?'}v=2` : '';

  return (
    <>
      {/* Layer 1: Compact horizontal card matching user screenshot exactly */}
      <motion.div
        onClick={() => setIsOpen(true)}
        className="relative rounded-2xl border p-4 flex items-center gap-4 cursor-pointer backdrop-blur-md overflow-hidden transition-all duration-300"
        style={{
          background: dark ? 'rgba(13, 20, 45, 0.45)' : 'rgba(240, 244, 255, 0.6)',
          borderColor: dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)',
        }}
        whileHover={{
          scale: 1.03,
          borderColor: `${activeColor}70`,
          boxShadow: `0 10px 25px -8px ${activeColor}40`,
        }}
      >
        {/* Subtle glow behind card on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(circle at 10% 50%, ${activeColor}30, transparent 60%)` }}
        />

        {/* Icon wrapper */}
        <div className="w-12 h-12 flex items-center justify-center rounded-xl border shrink-0 relative overflow-hidden"
          style={{
            background: hasLogo ? 'rgba(255,255,255,0.96)' : dark ? 'rgba(15,23,42,0.7)' : 'rgba(241,245,249,0.9)',
            borderColor: `${activeColor}40`,
            boxShadow: hasLogo ? `0 0 16px ${activeColor}22` : `inset 0 0 10px ${activeColor}15`,
          }}
        >
          {hasLogo ? (
            <img src={logoSrc} alt={tool.name} className="w-8 h-8 object-contain drop-shadow-sm" onError={() => setLogoError(true)} />
          ) : (
            <span className="font-extrabold text-lg tracking-wider" style={{ color: activeColor, textShadow: `0 0 8px ${activeColor}60` }}>
              {tool.name.charAt(0)}
            </span>
          )}
        </div>

        {/* Title and Badge */}
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100 truncate leading-tight tracking-wide">
            {tool.name}
          </h4>
          <span
            className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest border inline-block mt-1.5"
            style={{ backgroundColor: `${activeColor}10`, color: activeColor, borderColor: `${activeColor}30` }}
          >
            {tool.badge}
          </span>
        </div>
      </motion.div>

      {/* Layer 3: Full floating glass panel modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 190 }}
              className="relative glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl border"
              style={{
                background: dark ? 'rgba(10, 15, 35, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: `${activeColor}40`,
                boxShadow: `0 30px 70px -10px ${activeColor}40`,
              }}
            >
              {/* Colored top gradient border */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)` }} />

              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full border transition-all hover:scale-110"
                style={{ borderColor: `${activeColor}20`, color: dark ? '#94a3b8' : '#475569' }}
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6 mt-2">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl border shrink-0"
                  style={{
                    background: hasLogo ? 'rgba(255,255,255,0.96)' : dark ? 'rgba(15,23,42,0.7)' : 'rgba(241,245,249,0.9)',
                    borderColor: `${activeColor}40`,
                    boxShadow: `0 0 15px ${activeColor}30`,
                  }}
                >
                  {hasLogo ? (
                    <img src={logoSrc} alt={tool.name} className="w-9 h-9 object-contain" onError={() => setLogoError(true)} />
                  ) : (
                    <span className="font-extrabold text-2xl" style={{ color: activeColor }}>
                      {tool.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">{tool.name}</h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border inline-block mt-1"
                    style={{ backgroundColor: `${activeColor}15`, color: activeColor, borderColor: `${activeColor}30` }}
                  >
                    {tool.badge}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-5 text-sm">
                <div>
                  <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 mono">// Overview</h5>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{tool.description}</p>
                </div>

                {tool.useCases && (
                  <div>
                    <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 mono">// Key Capabilities</h5>
                    <div className="flex flex-wrap gap-2">
                      {tool.useCases.map((uc, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-bold border"
                          style={{ borderColor: `${activeColor}25`, color: activeColor, backgroundColor: `${activeColor}08` }}
                        >
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tool.bestFor && (
                  <div className="p-4 rounded-2xl border"
                    style={{ borderColor: `${activeColor}20`, background: `${activeColor}05` }}
                  >
                    <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 mono">// Why it matters</h5>
                    <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{tool.bestFor}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const ProjectSlideshow = ({ images, title }) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setCurrentImage(0);
  }, [images]);

  if (!images?.length) return null;

  const activeImage = images[currentImage];
  const goToPrevious = () => {
    setCurrentImage((index) => (index === 0 ? images.length - 1 : index - 1));
  };
  const goToNext = () => {
    setCurrentImage((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  return (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-100 dark:bg-slate-950/60 shadow-inner">
        <img
          src={activeImage.src}
          alt={`${title} - ${activeImage.label}`}
          className="w-full aspect-[16/7] object-cover object-left-top"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/65 text-white hover:bg-[#06b6d4] transition-colors backdrop-blur-sm"
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/65 text-white hover:bg-[#06b6d4] transition-colors backdrop-blur-sm"
              aria-label="Next screenshot"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mono">
          {activeImage.label}
        </p>
        {images.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => setCurrentImage(index)}
                className={`h-2.5 rounded-full transition-all ${
                  currentImage === index
                    ? 'w-8 bg-[#ff1493] pink-glow'
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-[#06b6d4]'
                }`}
                aria-label={`Show ${image.label}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Evervault-style Matrix Spotlight Card
const EvervaultCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>{}[]|~';
  const COLORS = ['#06b6d4', '#818cf8', '#a78bfa', '#38bdf8', '#ff1493', '#22d3ee'];

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;
    const ctx = canvas.getContext('2d');
    const FONT_SIZE = 12;
    const BASE_ALPHA = 0;      // invisible until mouse hover
    const SPOT_ALPHA = 0.95;   // bright in spotlight
    const RADIUS = 150;
    let cols, rows, grid = [];

    const resize = () => {
      canvas.width = card.offsetWidth;
      canvas.height = card.offsetHeight;
      cols = Math.ceil(canvas.width / FONT_SIZE);
      rows = Math.ceil(canvas.height / FONT_SIZE);
      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          speed: Math.random() * 0.5 + 0.15
        }))
      );
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(card);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${FONT_SIZE}px monospace`;

      grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (Math.random() < cell.speed * 0.06) {
            cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
            cell.color = COLORS[Math.floor(Math.random() * COLORS.length)];
          }
          const x = c * FONT_SIZE;
          const y = r * FONT_SIZE + FONT_SIZE;
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
          const spotFactor = mouseRef.current.inside ? Math.max(0, 1 - dist / RADIUS) : 0;
          const alpha = BASE_ALPHA + spotFactor * (SPOT_ALPHA - BASE_ALPHA);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.char, x, y);
        });
      });
      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999, inside: false }; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '1rem',
      }}
    >
      {/* Matrix canvas — drawn ON TOP of the bg, BELOW text */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          borderRadius: 'inherit'
        }}
      />
      {/* Content sits above canvas */}
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
};

// Dot Grid Card — glowing dot grid with mouse bulge effect (used on project cards)
// Node Graph Card — drifting neural-network nodes + connections, mouse spotlight (project cards)
const NodeGraphCard = ({ children, style = {}, className = '' }) => {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, inside: false });
  const COLORS = ['#06b6d4', '#818cf8', '#a78bfa', '#38bdf8', '#ff1493', '#22d3ee'];
  const NODE_COUNT = 22;
  const CONNECT_DIST = 95;
  const RADIUS = 150;

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];

    const buildNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2
      }));
    };

    const resize = () => {
      canvas.width = card.offsetWidth;
      canvas.height = card.offsetHeight;
      buildNodes();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(card);

    let tick = 0;
    const draw = () => {
      tick += 0.018;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Always update node positions (drift)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        n.phase += 0.03;
      });

      if (!mouseRef.current.inside) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECT_DIST) continue;

          const dmi = Math.sqrt((nodes[i].x - mx) ** 2 + (nodes[i].y - my) ** 2);
          const dmj = Math.sqrt((nodes[j].x - mx) ** 2 + (nodes[j].y - my) ** 2);
          const proximity = Math.max(
            Math.max(0, 1 - dmi / RADIUS),
            Math.max(0, 1 - dmj / RADIUS)
          );
          if (proximity <= 0) continue;

          const lineAlpha = (1 - dist / CONNECT_DIST) * proximity * 0.55;
          const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          grad.addColorStop(0, nodes[i].color);
          grad.addColorStop(1, nodes[j].color);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.9;
          ctx.globalAlpha = lineAlpha;
          ctx.stroke();
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const dm = Math.sqrt((n.x - mx) ** 2 + (n.y - my) ** 2);
        const proximity = Math.max(0, 1 - dm / RADIUS);
        if (proximity <= 0) return;

        const pulse = Math.sin(tick * 2.5 + n.phase);
        const r = n.r + pulse * 0.6 + proximity * 3.5;

        // Outer glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        grd.addColorStop(0, n.color + 'cc');
        grd.addColorStop(1, n.color + '00');
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.globalAlpha = proximity * 0.4;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = proximity * 0.95;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999, inside: false }; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem', ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 1, borderRadius: 'inherit'
        }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
};

// Full-page mouse-reactive particle canvas
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let W, H, animId;
    const COLORS = ['#06b6d4', '#22d3ee', '#4ade80', '#10b981'];
    // Mouse interaction removed as requested
    let particles = [];

    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };

    window.addEventListener('resize', () => { resize(); buildParticles(); });
    resize();

    const buildParticles = () => {
      const count = Math.min(140, Math.floor((W * H) / 14000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          ox: 0, oy: 0,
          vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2,
          r: Math.random() * 1.8 + 0.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    };
    buildParticles();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6,182,212,${(1 - d / 150) * 0.18})`;
            ctx.lineWidth = .6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach(p => {
        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.5) { p.vx = (p.vx / speed) * 2.5; p.vy = (p.vy / speed) * 2.5; }

        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = .7;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none', zIndex: 0,
        opacity: 0.85
      }}
    />
  );
};

const WavyLinesCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    // Wavy line parameters
    const lines = [
      {
        yRatio: 0.22,
        amplitude: 28,
        frequency: 0.0035,
        speed: 3,
        lengthRatio: 0.4,
        color: '6, 182, 212',
        glowColor: '#06b6d4',
        lineWidth: 1.8,
        phase: 0,
        centerX: 0
      },
      {
        yRatio: 0.48,
        amplitude: 34,
        frequency: 0.0028,
        speed: 4,
        lengthRatio: 0.5,
        color: '167, 139, 250',
        glowColor: '#a78bfa',
        lineWidth: 1.5,
        phase: Math.PI / 3,
        centerX: 0
      },
      {
        yRatio: 0.58,
        amplitude: 22,
        frequency: 0.0042,
        speed: 5,
        lengthRatio: 0.35,
        color: '255, 20, 147',
        glowColor: '#ff1493',
        lineWidth: 1.2,
        phase: Math.PI / 1.5,
        centerX: 0
      },
      {
        yRatio: 0.82,
        amplitude: 26,
        frequency: 0.003,
        speed: 3.5,
        lengthRatio: 0.45,
        color: '34, 211, 238',
        glowColor: '#22d3ee',
        lineWidth: 2.0,
        phase: Math.PI / 2,
        centerX: 0
      }
    ];

    lines.forEach(line => {
      line.centerX = -Math.random() * 1000 - 300;
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      lines.forEach(line => {
        line.centerX += line.speed;
        line.phase += 0.02;

        const segmentLength = width * line.lengthRatio;

        if (line.centerX - segmentLength > width) {
          line.centerX = -segmentLength - (Math.random() * 800 + 200);
        }

        const centerY = height * line.yRatio;
        const startX = Math.max(0, line.centerX - segmentLength);
        const endX = Math.min(width, line.centerX + segmentLength);

        if (startX >= width || endX <= 0) return;

        ctx.beginPath();
        let firstPoint = true;
        for (let x = startX; x <= endX; x += 3) {
          const distFromCenter = Math.abs(x - line.centerX);
          const envelope = Math.max(0, 1 - (distFromCenter / segmentLength));
          const smoothEnvelope = Math.sin(envelope * Math.PI / 2);
          const y = centerY + Math.sin(x * line.frequency - line.phase) * line.amplitude * smoothEnvelope;

          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        const grad = ctx.createLinearGradient(
          line.centerX - segmentLength, 0,
          line.centerX + segmentLength, 0
        );
        grad.addColorStop(0, `rgba(${line.color}, 0)`);
        grad.addColorStop(0.5, `rgba(${line.color}, 0.8)`);
        grad.addColorStop(1, `rgba(${line.color}, 0)`);

        ctx.shadowColor = line.glowColor;
        ctx.shadowBlur = 12;
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1, mixBlendMode: 'screen' }}
    />
  );
};

// Debris particle animation overlay for the submerged profile photo
const AboutDebrisCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = 256);
    let H = (canvas.height = 256);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();

    const particles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;
    }[] = [];

    const particleColors = [
      'rgba(6, 182, 212, ', // Cyan
      'rgba(167, 139, 250, ', // Purple
      'rgba(255, 20, 147, ', // Pink
    ];

    const createParticle = (init = false) => {
      return {
        x: Math.random() * W,
        y: init ? Math.random() * H : H + 10,
        size: Math.random() * 2.2 + 0.5,
        speedY: -(Math.random() * 0.7 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
      };
    };

    for (let i = 0; i < 20; i++) {
      particles.push(createParticle(true));
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Respawn if off top
        if (p.y < -10) {
          particles[idx] = createParticle(false);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.shadowColor = p.color.includes('255') ? '#ff1493' : '#06b6d4';
        ctx.shadowBlur = 4;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  );
};

// ── AiEcosystem: Futuristic orbital node map — all interactions inside canvas ──
const NODE_POSITIONS = [
  { angle: -90  }, // 0 AI Assistants
  { angle: -30  }, // 1 Data Gen
  { angle:  30  }, // 2 Data Prep
  { angle:  90  }, // 3 Analytics
  { angle: 150  }, // 4 Frameworks
  { angle: 210  }, // 5 Workflow
];
const deg2rad = (d) => (d * Math.PI) / 180;

const AiEcosystem = ({ categories, dark }) => {
  const frameRef = useRef(null);
  const [hovered, setHovered] = React.useState(null);
  const [openIdx, setOpenIdx] = React.useState(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [frameWidth, setFrameWidth] = React.useState(0);
  const [frameHeight, setFrameHeight] = React.useState(0);

  // Escape to close
  React.useEffect(() => {
    if (openIdx === null) return;
    const h = (e) => { if (e.key === 'Escape') setOpenIdx(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [openIdx]);

  React.useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const updateDimensions = () => {
      setFrameWidth(frame.offsetWidth);
      setFrameHeight(frame.offsetHeight);
    };
    updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  const openCat = openIdx !== null ? categories[openIdx] : null;
  const isExpanded = openIdx !== null;
  const activeTab = openIdx !== null ? openIdx : activeIdx;
  const isCompact = frameWidth > 0 && frameWidth < 640;
  const NODE_SIZE = isCompact ? 64 : 72;
  const OPEN_NODE_SIZE = isCompact ? 70 : 80;
  const CORE_SIZE = isCompact ? 104 : 120;
  const CORE_RING_SIZE = CORE_SIZE + 32;
  const NODE_LINE_R = NODE_SIZE / 2;
  const CORE_LINE_R = CORE_RING_SIZE / 2;
  const ORBIT_R = isCompact
    ? Math.max(118, Math.min(150, (frameWidth - NODE_SIZE - 24) / 2))
    : 210;
  const ORBIT_Y_OFFSET = isCompact ? -8 : -29;
  const FRAME_MIN_HEIGHT = isCompact ? 560 : 640;

  return (
    <div
      ref={frameRef}
      className="relative w-full rounded-3xl overflow-hidden"
      style={{
        background: dark
          ? 'radial-gradient(ellipse at 50% 40%, #0d1b3e 0%, #060a18 60%, #000000 100%)'
          : 'radial-gradient(ellipse at 50% 40%, #e8f0fe 0%, #dbe8fd 60%, #c7d7fc 100%)',
        minHeight: FRAME_MIN_HEIGHT,
        border: `1px solid ${dark ? 'rgba(255,100,0,0.15)' : 'rgba(99,102,241,0.2)'}`,
        boxShadow: dark
          ? '0 0 80px rgba(255,80,0,0.08), inset 0 0 80px rgba(0,0,60,0.5)'
          : '0 20px 60px rgba(99,102,241,0.12)',
      }}
    >
      {/* ── Scanline grid ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: dark
          ? 'linear-gradient(rgba(255,100,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,100,0,0.03) 1px,transparent 1px)'
          : 'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* ── Floating particles ── */}
      {[...Array(14)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{
            width: 2 + (i % 3), height: 2 + (i % 3),
            left: `${8 + (i * 6) % 84}%`, top: `${8 + (i * 9) % 84}%`,
            backgroundColor: ['#ff6600','#a855f7','#06b6d4','#ff1493'][i % 4],
          }}
          animate={{ opacity:[0.15,0.7,0.15], y:[0,-14,0] }}
          transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.35, ease:'easeInOut' }}
        />
      ))}

      {/* ── Corner brackets ── */}
      {[{t:16,l:16},{t:16,r:16},{b:16,l:16},{b:16,r:16}].map((c,i)=>(
        <div key={i} className="absolute w-10 h-10 pointer-events-none" style={{
          top:c.t, bottom:c.b, left:c.l, right:c.r,
          borderTop: c.t!==undefined ? '1px solid rgba(255,100,0,0.3)' : undefined,
          borderBottom: c.b!==undefined ? '1px solid rgba(255,100,0,0.3)' : undefined,
          borderLeft: c.l!==undefined ? '1px solid rgba(255,100,0,0.3)' : undefined,
          borderRight: c.r!==undefined ? '1px solid rgba(255,100,0,0.3)' : undefined,
        }}/>
      ))}

      {/* ── SVG connection lines ── */}
      {frameWidth > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {NODE_POSITIONS.map((pos, i) => {
            const rad = deg2rad(pos.angle);
            const ux = Math.cos(rad);
            const uy = Math.sin(rad);
            
            const cx = frameWidth / 2;
            const cy = (frameHeight || FRAME_MIN_HEIGHT) / 2 + ORBIT_Y_OFFSET;
            
            const x1 = cx + CORE_LINE_R * ux;
            const y1 = cy + CORE_LINE_R * uy;
            const x2 = cx + (ORBIT_R - NODE_LINE_R) * ux;
            const y2 = cy + (ORBIT_R - NODE_LINE_R) * uy;
            
            const isAct = i === activeTab;
            const dimmed = isExpanded && !isAct;
            const color = categories[i].color;
            
            return (
              <g key={i}>
                {/* Active node pulsing outline ripple */}
                {isAct && (
                  <motion.circle
                    cx={x2}
                    cy={y2}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    animate={{
                      r: [(NODE_SIZE + 4) / 2, ((NODE_SIZE + 4) / 2) * 1.63],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                  />
                )}
                
                {/* Connection line */}
                <motion.line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={isAct ? 2 : 1}
                  strokeDasharray={isAct ? undefined : '6, 5'}
                  style={{
                    filter: isAct ? `drop-shadow(0 0 4px ${color})` : 'none',
                  }}
                  animate={{
                    opacity: dimmed ? 0.04 : isAct ? 0.9 : 0.22,
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Active moving dot along the line */}
                {isAct && (
                  <motion.circle
                    r={4}
                    fill={color}
                    style={{
                      filter: `drop-shadow(0 0 6px ${color})`,
                    }}
                    animate={{
                      cx: [x1, x2, x1],
                      cy: [y1, y2, y1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      )}

      {/* ── AI Core (shrinks when panel is open) ── */}
      <motion.div className="absolute" style={{left:'50%',top:`calc(50% + ${ORBIT_Y_OFFSET}px)`,zIndex:10}}
        animate={{
          x: isExpanded ? '-50%' : '-50%',
          y: isExpanded ? '-50%' : '-50%',
          scale: isExpanded ? 0.55 : 1,
          opacity: isExpanded ? 0.4 : 1,
        }}
        transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
      >
        <motion.div className="relative flex items-center justify-center rounded-full"
          style={{
            width:CORE_SIZE, height:CORE_SIZE,
            background:'radial-gradient(circle, #ff6600 0%, #cc3300 40%, #1a0800 100%)',
            boxShadow:'0 0 60px rgba(255,100,0,0.7),0 0 120px rgba(255,100,0,0.3)',
            border:'2px solid rgba(255,150,0,0.6)',
          }}
          animate={!isExpanded ? {
            scale:[1,1.05,1],
            boxShadow:['0 0 60px rgba(255,100,0,0.7)','0 0 90px rgba(255,150,0,0.9)','0 0 60px rgba(255,100,0,0.7)']
          } : {}}
          transition={{duration:2.5,repeat:Infinity,ease:'easeInOut'}}
        >
          <div className="text-center z-10 relative">
            <div className="text-white font-black text-xl leading-none" style={{textShadow:'0 0 20px rgba(255,200,0,0.9)'}}>AI</div>
            <div className="text-orange-200 font-bold text-[9px] tracking-widest mt-0.5 uppercase">Core</div>
          </div>
          <motion.div className="absolute rounded-full border"
            style={{width:CORE_RING_SIZE,height:CORE_RING_SIZE,borderColor:'rgba(255,100,0,0.2)',top:-16,left:-16}}
            animate={{rotate:360}} transition={{duration:20,repeat:Infinity,ease:'linear'}}
          />
        </motion.div>
      </motion.div>

      {/* ── Orbit nodes ── */}
      {NODE_POSITIONS.map((pos, i) => {
        const cat = categories[i];
        const rad = deg2rad(pos.angle);
        const isHov = hovered === i;
        const isOpen = openIdx === i;
        const isActive = activeTab === i;
        const dimmed = isExpanded && !isOpen;
        return (
          <div key={i}
            className="absolute cursor-pointer select-none"
            style={{
              left:`calc(50% + ${ORBIT_R*Math.cos(rad)}px)`,
              top:`calc(50% + ${ORBIT_R*Math.sin(rad)}px + ${ORBIT_Y_OFFSET}px)`,
              transform:`translate(-50%, ${isOpen ? `-${OPEN_NODE_SIZE / 2}px` : `-${NODE_SIZE / 2}px`})`,
              zIndex: isOpen ? 12 : 10,
            }}
            onMouseEnter={()=>setHovered(i)}
            onMouseLeave={()=>setHovered(null)}
            onClick={()=>{
              setActiveIdx(i);
              setOpenIdx(openIdx===i ? null : i);
            }}
          >
            <motion.div
              className="relative flex flex-col items-center"
              animate={{ opacity:dimmed?0.22:1 }}
              transition={{duration:0.25,ease:'easeOut'}}
            >
            <motion.div className="relative flex items-center justify-center rounded-full"
              style={{
                width:isOpen?OPEN_NODE_SIZE:NODE_SIZE, height:isOpen?OPEN_NODE_SIZE:NODE_SIZE,
                background:dark?`radial-gradient(circle,${cat.color}30 0%,${cat.color}08 100%)`:`radial-gradient(circle,${cat.color}20 0%,${cat.color}05 100%)`,
                border:`2px solid ${isOpen||isActive?cat.color:cat.color+'40'}`,
              }}
              animate={{
                boxShadow: isOpen||isHov
                  ? [`0 0 30px ${cat.color}80,0 0 60px ${cat.color}30`,`0 0 50px ${cat.color}90,0 0 80px ${cat.color}40`,`0 0 30px ${cat.color}80,0 0 60px ${cat.color}30`]
                  : `0 0 8px ${cat.color}20`
              }}
              transition={{duration:1.5,repeat:isOpen?Infinity:0,ease:'easeInOut'}}
            >
              <span style={{color:cat.color}}>{React.cloneElement(cat.icon,{className:'w-7 h-7'})}</span>
            </motion.div>
            <div className="mt-2 text-center" style={{maxWidth:90}}>
              <div className="font-bold text-[11px] leading-tight"
                style={{color:isOpen?cat.color:isHov?cat.color:(dark?'#94a3b8':'#475569')}}>
                {cat.shortLabel}
              </div>
              <div className="text-[9px] font-semibold mono mt-0.5" style={{color:dark?'#475569':'#94a3b8'}}>
                {cat.tools.length} tools
              </div>
            </div>

            {/* Hover tooltip — only in orbit view */}
            <AnimatePresence>
              {isHov && !isExpanded && (
                <motion.div
                  initial={{opacity:0,y:6,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:4,scale:0.95}}
                  transition={{duration:0.15}}
                  className="absolute rounded-xl px-3 py-2 text-center pointer-events-none"
                  style={{
                    top:-72,left:'50%',transform:'translateX(-50%)',width:170,zIndex:30,
                    background:dark?'rgba(10,15,40,0.97)':'rgba(255,255,255,0.97)',
                    border:`1px solid ${cat.color}50`,
                    boxShadow:`0 8px 30px ${cat.color}30`,
                  }}
                >
                  <p className="text-[10px] font-semibold leading-tight" style={{color:dark?'#e2e8f0':'#1e293b'}}>{cat.summary}</p>
                  <p className="text-[9px] mt-1 font-bold opacity-60" style={{color:cat.color}}>Click to explore →</p>
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          </div>
        );
      })}

      {/* ── Inner panel: shown INSIDE the canvas when a node is open ── */}
      <AnimatePresence>
        {openCat && (
          <motion.div
            key={openIdx}
            className="absolute inset-0 flex flex-col"
            style={{ zIndex: 20, padding: '16px 20px 20px 20px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Inner glassmorphism panel overlay matching screenshot exactly */}
            <motion.div
              className="relative w-full h-full rounded-2xl flex flex-col overflow-hidden"
              style={{
                background: dark ? 'rgba(6, 10, 26, 0.95)' : 'rgba(240, 245, 255, 0.96)',
                border: dark ? '1.5px solid rgba(255, 255, 255, 0.08)' : '1.5px solid rgba(0, 0, 0, 0.1)',
                boxShadow: `0 0 50px ${openCat.color}15, inset 0 0 30px rgba(0,0,0,0.4)`,
                backdropFilter: 'blur(20px)',
              }}
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top glowing gold/neon gradient line from screenshot */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] z-20" style={{
                background: `linear-gradient(90deg, transparent 15%, ${openCat.color} 50%, transparent 85%)`
              }} />

              {/* Background glow blob */}
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-[0.05]"
                style={{ background: openCat.color, transform: 'translate(30%, -30%)' }}
              />

              {/* Panel Header */}
              <div className="relative z-10 flex items-center justify-between px-6 py-5 shrink-0 border-b"
                style={{ borderBottomColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
              >
                <div className="flex items-center gap-4">
                  {/* Styled Icon box */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl border shrink-0"
                    style={{
                      background: dark ? 'rgba(15,23,42,0.72)' : 'rgba(255,255,255,0.9)',
                      borderColor: `${openCat.color}50`,
                      boxShadow: `0 0 12px ${openCat.color}25`,
                    }}
                  >
                    <span style={{ color: openCat.color }}>{React.cloneElement(openCat.icon, { className: 'w-6 h-6' })}</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl leading-tight text-slate-900 dark:text-slate-100 tracking-wide">
                      {openCat.label}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: openCat.color }} />
                      <span className="text-[10px] font-extrabold mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        {openCat.tools.length} TECHNOLOGIES <span className="opacity-30 mx-1">•</span> {openCat.summary}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Circular close button matching screenshot exactly */}
                <button
                  onClick={() => setOpenIdx(null)}
                  className="p-1 rounded-full border border-slate-300 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all hover:scale-110 shrink-0 flex items-center justify-center w-8 h-8"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tool cards — scrollable inside canvas */}
              <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6"
                style={{ scrollbarWidth: 'thin', scrollbarColor: `${openCat.color}40 transparent` }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  {openCat.tools.map((tool, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, delay: i * 0.05, ease: 'easeOut' }}
                    >
                      <TechnologyCard tool={tool} activeColor={openCat.color} dark={dark} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// Data for certifications has been moved to src/data/certifications.ts


const App = () => {
  const [dark, setDark] = useState(true);
  const [projectModal, setProjectModal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullJourney, setShowFullJourney] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(null);
  const skillsRef = useRef(null);
  const [page, setPage] = useState('home');

  // Hash-based router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/freelance' || hash === '#freelance') {
        setPage('freelance');
        window.scrollTo(0, 0);
      } else if (hash === '#/admin' || hash === '#admin' || hash === '#/dashboard' || hash === '#dashboard') {
        setPage('admin');
        window.scrollTo(0, 0);
      } else {
        setPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Lenis Smooth Scroll Initialization
  useEffect(() => {
    let lenisInst: any;
    try {
      const LenisConstructor = (Lenis && (Lenis as any).default) || Lenis;
      if (typeof LenisConstructor === 'function') {
        lenisInst = new LenisConstructor({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        const raf = (time: number) => {
          lenisInst.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      }
    } catch (e) {
      console.warn("Lenis smooth scroll failed to initialize:", e);
    }

    return () => {
      if (lenisInst) lenisInst.destroy();
    };
  }, []);

  // Cookie Logic
  useEffect(() => {
    const savedConsent = localStorage.getItem("cookie-consent");
    if (savedConsent) {
      setCookieConsent(savedConsent);
    } else {
      setTimeout(() => setCookieConsent('pending'), 2000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setCookieConsent("accepted");
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setCookieConsent("rejected");
  };

  // Preloader target logic
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 2;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setIsLoading(false), 500);
      }
      setLoadingProgress(currentProgress);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect state
  const [typewriterText, setTypewriterText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let ticker = setTimeout(() => {
      const i = loopNum % TYPEWRITER_PHRASES.length;
      const fullText = TYPEWRITER_PHRASES[i];

      if (isDeleting) {
        setTypewriterText(fullText.substring(0, typewriterText.length - 1));
        setTypingSpeed(30);
      } else {
        setTypewriterText(fullText.substring(0, typewriterText.length + 1));
        setTypingSpeed(80);
      }

      if (!isDeleting && typewriterText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typewriterText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(90);
      }
    }, typingSpeed);
    return () => clearTimeout(ticker);
  }, [typewriterText, isDeleting, loopNum, typingSpeed]);

  // Theme logic
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme-dark", JSON.stringify(dark));
  }, [dark]);

  // Scroll visibility for skills
  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setSkillsVisible(entry.isIntersecting));
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Sticky header logic
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToId = (id) => {
    setDrawerOpen(false);
    if (!id) {
      if (window.location.hash !== '' && window.location.hash !== '#/') {
        window.location.hash = '#/';
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    
    if (window.location.hash !== '' && window.location.hash !== '#/') {
      window.location.hash = '#/';
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrint = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument;
    doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Resume – Rahul Adhikari</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px 56px; font-size: 13px; line-height: 1.6; }
    h1 { font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .role { font-size: 13px; color: #475569; margin-top: 2px; margin-bottom: 14px; }
    h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #06b6d4; border-bottom: 1.5px solid #e0f2fe; padding-bottom: 4px; margin: 22px 0 11px; }
    .tag { display: inline-block; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:4px; padding:1px 7px; font-size:11px; color:#475569; margin:2px 2px; }
    .job { margin-bottom: 18px; }
    .job-title { font-weight: 700; font-size: 14px; color: #0f172a; }
    .job-company { color: #06b6d4; font-size: 12px; font-weight: 600; }
    .job-period { color: #94a3b8; font-size: 11px; float: right; }
    ul.points { margin: 6px 0 0 16px; }
    ul.points li { margin-bottom: 4px; color: #334155; font-size: 12.5px; }
    .summary { background: #f8fafc; border-left: 3px solid #06b6d4; padding: 10px 16px; border-radius: 4px; color: #334155; margin-bottom: 4px; }

    /* Contact grid */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px 12px; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #e2e8f0; }
    .ci { display: flex; align-items: center; gap: 7px; font-size: 11.5px; color: #334155; }
    .ci a { color: #0369a1; text-decoration: none; }
    /* Icon box — force print background */
    .icon-box {
      width: 20px; height: 20px;
      background: #0f172a !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .icon-box svg { width: 12px; height: 12px; fill: white !important; stroke: none; }
    @media print { body { padding: 20px 32px; } }
  </style>
</head>
<body>
  <h1>Rahul Adhikari</h1>
  <div class="role">Data Analyst &amp; Power BI Specialist</div>

  <div class="contact-grid">
    <!-- Row 1: Phone | Website (center) | Location -->
    <div class="ci">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.1 3.45 2 2 0 0 1 3.08 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/></svg>
      +91-7737006542
    </div>
    <div class="ci">
      <!-- Globe icon (stroke-based, always prints) -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
      <a href="https://www.rahuladhikari.com.np" target="_blank">www.rahuladhikari.com.np</a>
    </div>
    <div class="ci">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      Bengaluru, Karnataka, India
    </div>

    <!-- Row 2: LinkedIn | Email (center) | empty -->
    <div class="ci">
      <!-- LinkedIn: stroke-based icon, no fill box needed -->
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      <a href="https://linkedin.com/in/irahuladhikari" target="_blank">linkedin.com/in/irahuladhikari</a>
    </div>
    <div class="ci">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      <a href="mailto:irahuladhikari@gmail.com">irahuladhikari@gmail.com</a>
    </div>
    <div class="ci"></div>
  </div>



  <h2>Professional Summary</h2>
  <div class="summary">
    Results-driven Data Analyst with 3+ years of experience transforming raw data into strategic insights through Power BI, SQL, Python, and advanced Excel automation. Proven track record of building scalable dashboards, end-to-end ETL pipelines, and AI-driven analytics solutions across finance, e-commerce, and research domains.
    <br><br>
    Adept at bridging technical complexity with business clarity — delivering data products that drive measurable growth, reduce operational friction, and empower stakeholder decision-making at scale.
  </div>

  <h2>Work Experience</h2>

  <div class="job">
    <div class="job-period">Feb 2024 - Feb 2026</div>
    <div class="job-title">Data Analyst – Admin Executive</div>
    <div class="job-company">Market Maven Research <span style="font-weight: 400; font-size: 11px; font-style: italic; color: #94a3b8;">, Bengaluru, Karnataka</span></div>
    <ul class="points">
      <li>Directed CRM operations for 100+ sales team members, improving efficiency and lead assignment accuracy.</li>
      <li>Developed centralized Master Sheets to track clients, payments, complaints, and service upgrades.</li>
      <li>Designed monthly performance dashboards and sales presentations for stakeholder decision-making.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-period">Oct 2022 - Jan 2024</div>
    <div class="job-title">Market Research &amp; Data Analyst</div>
    <div class="job-company">TRIO Clothing's <span style="font-weight: 400; font-size: 11px; font-style: italic; color: #94a3b8;">, Kathmandu, Nepal</span></div>
    <ul class="points">
      <li>Conducted research on fashion trends across India and Nepal for product development strategy.</li>
      <li>Recommended cost-effective raw material sourcing locations, optimizing procurement costs.</li>
      <li>Analyzed competitors and seasonal trends to guide startup's market positioning.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-period">Apr 2022 – Aug 2024</div>
    <div class="job-title">Power BI Developer &amp; Data Analyst</div>
    <div class="job-company">Freelancing</div>
    <ul class="points">
      <li>Engineered scalable data models and automated workflows using Power BI, SQL, and Python.</li>
      <li>Created interactive dashboards for executives using Power BI, Tableau, and Google Data Studio.</li>
      <li>Integrated multi-source data (BigQuery, IBM Cloud, APIs) reducing errors by 95%.</li>
    </ul>
  </div>

  <h2>Internship &amp; Training</h2>

  <div class="job">
    <div class="job-period" style="color:#06b6d4">Jan 2022 – Apr 2022</div>
    <div class="job-title">3 Months Internship – Data Analytics Program</div>
    <div class="job-company">Labmentix</div>
    <ul class="points">
      <li>Completed hands-on Data Analytics &amp; AI internships focused on real-world projects using SQL, Excel, Power BI, Tableau, and Python, with mentorship-driven learning and practical reporting.</li>
      <li>Built end-to-end dashboards and analytics solutions, applying Python (Pandas, Seaborn), SQL, MongoDB, Power Query, DAX, and VBA Macros on projects including land price prediction and X-ray image classification (CNN).</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-period" style="color:#a78bfa">Feb 2021 – Jun 2021</div>
    <div class="job-title">Data Science &amp; Machine Learning Training</div>
    <div class="job-company">Excellence Technology, Mohali</div>
    <ul class="points">
      <li>Engineered Python-based ML projects using TensorFlow, OpenCV, and NumPy, building deployment-ready prototypes with real-world data pipelines and visualizations (Matplotlib) in collaborative team environments using Jupyter, PyCharm, and Anaconda.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-period" style="color:#22d3ee">Jun 2019 – Jul 2019</div>
    <div class="job-title">Core Python Programming Training</div>
    <div class="job-company">Nordia Ventures, Mohali</div>
    <ul class="points">
      <li>Mastered core Python concepts through coding challenges and mini projects, building strong foundations in functions, data structures, and automation for future data science applications.</li>
    </ul>
  </div>

  <h2>Featured Projects</h2>
  <div class="job">
    <div class="job-title">RAG-Powered Agentic AI Assistant</div>
    <div style="font-size: 11px; color: #475569; margin-bottom: 2px;">LangChain, RAG, OpenAI, FAISS, Python, Agentic AI</div>
    <div style="font-size: 12px; color: #334155;">Built an end-to-end Retrieval-Augmented Generation (RAG) pipeline with autonomous multi-step reasoning for business data Q&A.</div>
  </div>
  <div class="job">
    <div class="job-title">Netflix Content Analysis (EDA)</div>
    <div style="font-size: 11px; color: #475569; margin-bottom: 2px;">Python, Pandas, Seaborn, Matplotlib</div>
    <div style="font-size: 12px; color: #334155;">Comprehensive Exploratory Data Analysis of Netflix's catalog to uncover content trends, regional availability, and target demographics over the last decade.</div>
  </div>
  <div class="job">
    <div class="job-title">PMGC Esports Performance Analysis (2020-2025)</div>
    <div style="font-size: 11px; color: #475569; margin-bottom: 2px;">Vanilla JS, HTML5, CSS3, JSON</div>
    <div style="font-size: 12px; color: #334155;">Engineered a custom interactive web dashboard using JSON datasets to visualize 5 years of historical performance metrics.</div>
  </div>
  <div class="job">
    <div class="job-title">Financial KPI Dashboard</div>
    <div style="font-size: 11px; color: #475569; margin-bottom: 2px;">Excel VBA, Power BI, DAX</div>
    <div style="font-size: 12px; color: #334155;">Automated financial reporting tool for real-time KPI tracking and automated data consolidation.</div>
  </div>

  <h2>Core Skills</h2>
  <div style="margin-top:4px">
    <span class="tag">Power BI</span><span class="tag">DAX</span><span class="tag">SQL</span><span class="tag">BigQuery</span>
    <span class="tag">Python</span><span class="tag">Pandas</span><span class="tag">NumPy</span><span class="tag">Scikit-learn</span>
    <span class="tag">Excel VBA</span><span class="tag">ETL</span><span class="tag">Tableau</span><span class="tag">LangChain</span>
    <span class="tag">TensorFlow</span><span class="tag">OpenCV</span><span class="tag">MongoDB</span><span class="tag">Data Modeling</span>
  </div>

  <h2>Generative AI &amp; Automation Tools</h2>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 4px;">
    <div>
      <div style="font-weight:700; font-size:12px; color:#475569; margin-bottom:4px;">Workflow Automation:</div>
      <span class="tag">n8n</span><span class="tag">Microsoft Power Automate</span>
    </div>
    <div>
      <div style="font-weight:700; font-size:12px; color:#475569; margin-bottom:4px;">AI Assistants &amp; LLMs:</div>
      <span class="tag">Google AI Studio</span><span class="tag">Google Antigravity</span><span class="tag">Claude</span>
    </div>
    <div style="grid-column: span 2;">
      <div style="font-weight:700; font-size:12px; color:#475569; margin-bottom:4px;">Productivity &amp; Design:</div>
      <span class="tag">Notion</span><span class="tag">Canva</span><span class="tag">Adobe Photoshop</span><span class="tag">Adobe Firefly</span>
    </div>
  </div>
</body>
</html>`);
    doc.close();
    iframe.contentWindow.focus();
    setTimeout(() => { 
      iframe.contentWindow.print(); 
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 600);
  };

  const projects = [
    {
      title: 'Netflix Content Analysis (EDA)',
      desc: 'Comprehensive Exploratory Data Analysis (EDA) of Netflix\'s content catalog to uncover trends in ratings, genres, and regional availability.',
      tech: ['Python', 'Pandas', 'Seaborn', 'Matplotlib'],
      github: 'https://github.com/ursrahuladhikari/Netflix-Content-Analysis-EDA-',
      highlights: [
        'Analyzed 8,000+ titles using Python to identify shifting content strategies and production trends over the last decade.',
        'Segmented data by country and rating to uncover regional content preferences and target demographics.',
        'Demonstrated strong data wrangling skills by handling missing values and engineering new features for deeper insights.'
      ]
    },
    {
      title: 'Financial KPI Dashboard',
      desc: 'Interactive financial summary dashboard for tracking revenue, expenses, profit and loss, payment methods, departments, quarters, and monthly performance across fiscal views.',
      tech: ['Excel', 'Pivot Charts', 'Slicers', 'Financial Analytics'],
      github: 'https://github.com/ursrahuladhikari/Financial-KPI-Dashboard',
      screenshots: [
        { src: '/projects/financial-kpi-dashboard/default-view.png', label: 'Default financial summary view' },
        { src: '/projects/financial-kpi-dashboard/payment-credit-card.png', label: 'Payment method filter: Credit Card' },
        { src: '/projects/financial-kpi-dashboard/payment-bank-transfer.png', label: 'Payment method filter: Bank Transfer' },
        { src: '/projects/financial-kpi-dashboard/q1-view.png', label: 'Quarter filter: Q1 performance' },
        { src: '/projects/financial-kpi-dashboard/q4-view.png', label: 'Quarter filter: Q4 performance' }
      ],
      highlights: [
        'Built a multi-view financial dashboard with KPI cards for revenue, expense, profit and loss, max revenue, and max expense.',
        'Added slicer-driven analysis for year, month, quarter, department, and payment method to support fast scenario comparisons.',
        'Visualized category mix, departmental revenue vs expense, and monthly profit trends for finance performance review.'
      ]
    },
    {
      title: 'PMGC Esports Performance Analysis (2020-2025)',
      desc: 'In-depth analysis of PUBG Mobile Global Championship (PMGC) tournament data to visualize historical team and player performance metrics.',
      tech: ['Vanilla JS', 'HTML5/CSS3', 'JSON Data Architecture'],
      github: 'https://github.com/ursrahuladhikari/PMGC-Insights-Analysis-2020-2025',
      liveUrl: 'https://pmgc-insights-analysis-2020-2025.vercel.app/',
      highlights: [
        'Engineered a comprehensive, interactive esports web dashboard using Vanilla JavaScript, HTML5, and a custom CSS3 design system.',
        'Implemented dynamic data rendering from custom JSON datasets to visualize 5 years of historical tournament statistics, regional distributions, and map pools.',
        'Designed UX-focused features including dynamic year navigation, chronological timelines, and high-performance particle network animations.'
      ]
    },
    {
      title: 'RAG-Powered Agentic AI Assistant',
      desc: 'Built an end-to-end Retrieval-Augmented Generation (RAG) pipeline using LangChain, FAISS vector store, and OpenAI GPT. Integrated an Agentic AI layer with tool-calling capabilities to enable autonomous multi-step reasoning for business data Q&A.',
      tech: ['LangChain', 'RAG', 'OpenAI', 'FAISS', 'Python', 'Agentic AI'],
      github: 'https://github.com/ursrahuladhikari'
    }
  ];

  const tools = [
    { name: 'Power BI', role: 'Dashboard development, DAX, Power Query, Gateway & Service', exp: '3.5+ yrs', level: 95, icon: <PieChart className="w-5 h-5" /> },
    { name: 'SQL & Databases', role: 'Complex queries, Joins, CTEs, BigQuery, Oracle, MongoDB', exp: '4+ yrs', level: 95, icon: <Database className="w-5 h-5" /> },
    { name: 'Programming (Python, C/C++)', role: 'Data structures, scripting, ETL, automation pipelines', exp: '4 yrs', level: 90, icon: <Terminal className="w-5 h-5" /> },
    { name: 'Excel & VBA', role: 'Macros, Pivot tables, CRM/Inventory Automation', exp: '4 yrs', level: 97, icon: <FileText className="w-5 h-5" /> },
    { name: 'Tableau', role: 'Interactive dashboards, visual analytics, storytelling', exp: '2.5 yrs', level: 86, icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Data Modelling & ETL', role: 'Star Schema, Fact/Dimension Tables, Power Query (M)', exp: '3.5 yrs', level: 92, icon: <Layers className="w-5 h-5" /> },
    { name: 'Machine Learning & AI', role: 'TensorFlow, OpenCV, R, Predictive Modelling', exp: '2+ yrs', level: 75, icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Git & GitHub', role: 'Version control, collaborative workflows, CI/CD pipelines', exp: '3 yrs', level: 85, icon: <Workflow className="w-5 h-5" /> }
  ];

  if (page === 'admin') {
    return <AdminDashboard isDark={dark} onBackToHome={() => { window.location.hash = '#/'; }} />;
  }

  return (
    <div className={`min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 ${dark ? 'bg-[#0f172a] code-bg-dark' : 'bg-[#fafafa]'}`}>
      {/* Preloader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a1a] transition-all duration-700">
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-[#0a0a1a] to-[#0a0a1a]"></div>

          <div className="z-10 text-center flex flex-col items-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#ff1493] tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                {loadingProgress}%
              </h1>
            </div>

            <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#06b6d4] to-[#ff1493] shadow-[0_0_10px_rgba(255,20,147,0.8)] transition-all duration-75"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>

            <div className="h-12 flex items-center justify-center">
              <div className={`mono text-[#06b6d4] text-sm uppercase tracking-widest transition-opacity duration-300 ${loadingProgress === 100 ? 'opacity-100 font-bold' : 'animate-pulse opacity-70'}`}>
                {loadingProgress === 100 ? 'Ready.' : 'Initializing Data...'}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Full-page mouse-reactive particle canvas */}
      <ParticleCanvas />
      {/* Scroll-synchronized hover-responsive background grid */}
      <PageGraphOverlay dark={dark} />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes logoBar {
          0%, 100% { transform: scaleY(0.35); opacity: 0.25; }
          50% { transform: scaleY(1); opacity: 0.7; }
        }
        .logo-bar { animation: logoBar var(--dur, 1.6s) ease-in-out infinite; animation-delay: var(--delay, 0s); transform-origin: bottom; }
      `}</style>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
        <aside className={`absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8 -mt-2">
              <img src="/logo.png" alt="RA Logo" className="h-20 w-auto object-contain" />
              <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full text-hot-pink">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-4 font-mono text-sm">
              {['Home', 'About', 'Projects', 'Resume', 'Tools'].map(item => (
                <button
                  key={item}
                  onClick={() => scrollToId(item === 'Home' ? '' : item.toLowerCase())}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-[#ff1493] transition-colors font-medium"
                >
                  <span className="text-[#db2777]">/</span> {item.toLowerCase()}
                </button>
              ))}
              <button
                onClick={() => { window.location.hash = '#/freelance'; setDrawerOpen(false); }}
                className="w-full text-left py-3 px-4 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-[#ff1493] transition-colors font-medium"
              >
                <span className="text-[#db2777]">/</span> freelance
              </button>
            </nav>
          </div>
        </aside>
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-40 px-6 py-4 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 border-b border-black/8 dark:border-white/10 shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="relative flex items-center group cursor-pointer" style={{ height: '2rem', width: '11rem' }} onClick={() => scrollToId('')}>

            {/* Bars clipped to header height — cannot overflow below the nav line */}
            <div className="absolute pointer-events-none" style={{
              top: '-1rem', bottom: '-1rem', left: 0, width: '11rem',
              overflow: 'hidden', zIndex: 0,
              display: 'flex', alignItems: 'flex-end',
            }}>
              {/* Red bars — left side */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100%', marginLeft: '0.5rem' }}>
                {[
                  { h: '40%', dur: '1.8s', delay: '0s'   },
                  { h: '70%', dur: '1.3s', delay: '0.2s' },
                  { h: '30%', dur: '2.0s', delay: '0.4s' },
                  { h: '55%', dur: '1.5s', delay: '0.1s' },
                  { h: '80%', dur: '1.7s', delay: '0.3s' },
                  { h: '45%', dur: '1.2s', delay: '0.5s' },
                ].map((b, i) => (
                  <div key={i} className="logo-bar" style={{
                    width: '1.5px', height: b.h, borderRadius: '1px',
                    background: 'linear-gradient(to top, #cc1010, #ff4444)',
                    boxShadow: '0 0 3px rgba(220,30,30,0.5)',
                    '--dur': b.dur, '--delay': b.delay,
                  } as any} />
                ))}
              </div>

              {/* Blue bars — right side */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '100%', marginLeft: '3rem' }}>
                {[
                  { h: '60%', dur: '1.6s', delay: '0.15s' },
                  { h: '35%', dur: '1.9s', delay: '0.35s' },
                  { h: '75%', dur: '1.4s', delay: '0s'    },
                  { h: '50%', dur: '2.1s', delay: '0.25s' },
                  { h: '85%', dur: '1.6s', delay: '0.45s' },
                  { h: '40%', dur: '1.3s', delay: '0.1s'  },
                ].map((b, i) => (
                  <div key={i} className="logo-bar" style={{
                    width: '1.5px', height: b.h, borderRadius: '1px',
                    background: 'linear-gradient(to top, #0066cc, #22d3ee)',
                    boxShadow: '0 0 3px rgba(34,211,238,0.4)',
                    '--dur': b.dur, '--delay': b.delay,
                  } as any} />
                ))}
              </div>
            </div>

            {/* Logo — top margin, legs overflow below */}
            <img
              src="/logo.png"
              alt="RA Logo"
              className="group-hover:scale-105 transition-transform origin-left"
              style={{
                position: 'absolute',
                top: '-2.4rem',
                left: 0,
                height: '9.45rem',
                transform: 'rotate(-2deg)',
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(1.7) contrast(1.25) saturate(1.3) drop-shadow(0 0 18px rgba(6,182,212,0.7)) drop-shadow(0 0 8px rgba(220,30,30,0.5))',
                zIndex: 1,
              }}
            />
          </div>

          <nav className="flex items-center gap-2 sm:gap-6">
            <ul className="hidden md:flex items-center gap-8 font-mono text-sm">
              {['Home', 'About', 'Projects', 'Resume', 'Tools'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => scrollToId(item === 'Home' ? '' : item.toLowerCase())}
                    className="font-medium text-slate-800 hover:text-[#ff1493] dark:text-slate-300 dark:hover:text-[#ff1493] transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li className="relative group">
                <button className="font-medium text-slate-800 hover:text-[#ff1493] dark:text-slate-300 dark:hover:text-[#ff1493] transition-colors flex items-center gap-1">
                  More <ChevronRight size={14} className="rotate-90 group-hover:-rotate-90 transition-transform" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-36 bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-[#ff1493]/10">
                  <button onClick={() => { window.location.hash = '#/freelance'; }} className="block w-full text-left px-5 py-3 text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700 hover:text-[#ff1493] transition-colors font-medium">
                    Freelance
                  </button>
                </div>
              </li>
            </ul>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />

            <button onClick={() => setDark(!dark)} className="p-2.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 hover:text-[#ff1493] dark:hover:text-[#ff1493]">
              {dark ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button onClick={() => setDrawerOpen(true)} className="md:hidden p-2.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#ff1493]">
              <Menu size={18} />
            </button>
          </nav>
        </div>
      </header>

      {page === 'freelance' ? (
        <Freelance isDark={dark} onBackToHome={() => { window.location.hash = '#/'; }} />
      ) : (
        <>
          {/* Hero */}
          <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-20 lg:pb-0 lg:min-h-screen flex flex-col justify-center px-6 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#ff1493]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center w-full mb-16 fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-900/20 text-[#ff1493] mono text-xs font-bold shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              </span>
              "status": "Available for Projects"
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="fade-up delay-100">
              <div className="inline-block px-3 py-1 mb-6 rounded-md bg-pink-900/20 border border-pink-500/30 text-[#ff1493] mono text-sm shadow-[0_0_10px_rgba(255,20,147,0.15)] backdrop-blur-sm">
                $ whoami
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
                Rahul <br /><span className="text-gradient">Adhikari</span>
              </h1>
              <div className="mono text-lg md:text-2xl text-slate-700 dark:text-slate-400 mb-8 h-8 px-1">
                <span>{typewriterText}</span>
                <span className="terminal-cursor"></span>
              </div>
              <p className="text-slate-800 dark:text-slate-400 text-lg max-w-lg mb-10 leading-relaxed fade-up delay-100">
                Data Analyst & Power BI Specialist. I turn complex datasets into intuitive dashboards and clean pipelines to fuel business growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 fade-up delay-200">
                <button onClick={() => scrollToId('projects')} className="px-8 py-4 bg-pink-gradient rounded-lg text-white font-bold pink-glow hover:scale-105 transition-transform text-center shadow-lg">
                  Explore My Work
                </button>
                <button onClick={() => scrollToId('resume')} className="px-8 py-4 glass-card rounded-lg font-bold hover:text-[#ff1493] transition-colors text-center">
                  View Resume
                </button>
              </div>
            </div>

            {/* Decorative Terminal Element */}
            <div className="hidden md:block relative justify-self-end w-max md:scale-90 lg:scale-100 origin-right">

              {/* Floating Query Panel (Behind) */}
              <div className="absolute -bottom-6 -left-4 glass-card bg-[#0f172a] border border-[#ff1493]/30 px-6 py-3 rounded-xl -rotate-6 shadow-2xl z-0">
                <span className="mono font-bold text-[#ff1493] text-[15px]">SELECT * FROM excellence;</span>
              </div>

              {/* Main Terminal Box (Front) */}
              <div className="relative glass-card bg-slate-900/95 backdrop-blur-xl border border-[#ff1493]/40 rounded-xl p-6 md:p-8 shadow-[0_0_40px_rgba(255,20,147,0.15)] z-10 hover:border-[#ff1493]/60 transition-colors animate-float">
                <div className="flex space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mono text-[#4ade80] text-xs lg:text-sm leading-relaxed tracking-wide whitespace-nowrap">
                  <p className="text-slate-300">{`{`}</p>
                  <div className="pl-6">
                    <p><span className="text-slate-300">"name"</span>: "Rahul Adhikari",</p>
                    <p><span className="text-slate-300">"role"</span>: "Data Analyst",</p>
                    <p><span className="text-slate-300">"stack"</span>: ["Power BI", "SQL", "Python", "Gen AI", "AI/ML"],</p>
                    <p><span className="text-slate-300">"automation"</span>: ["Excel (VBA)", "ETL", "Data Transformation"],</p>
                    <p><span className="text-slate-300">"mission"</span>: "Scaling data excellence",</p>
                    <p><span className="text-slate-300">"uptime_target"</span>: "99.9%"</p>
                  </div>
                  <p className="text-slate-300">{`}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="w-full border-y border-[#ff1493]/20 bg-[#ff1493]/5 overflow-hidden flex py-4 whitespace-nowrap">
        <div className="flex animate-marquee min-w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {['POWER BI', 'DAX', 'DATA MODELLING', 'ETL', 'SQL', 'BIGQUERY', 'PYTHON', 'TABLEAU', 'MACHINE LEARNING', 'EXCEL VBA', 'PANDAS', 'TENSORFLOW', 'STAR SCHEMA', 'TROUBLESHOOTING'].map((skill, j) => (
                <React.Fragment key={`${i}-${j}`}>
                  <span className="mx-6 text-sm font-bold text-slate-500 dark:text-slate-400 mono tracking-widest">{skill}</span>
                  <span className="text-[#ff1493] opacity-50">•</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 relative">
        {/* Light-mode tinted background panel */}
        <div className="absolute inset-0 bg-white/40 dark:bg-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="mono text-[#ff1493] text-sm mb-2">// Featured Projects</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-slate-100">What I've Built</h2>
            </div>
            <a href="https://github.com/ursrahuladhikari" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#ff1493] font-bold hover:underline transition-all">
              Browse Github <ChevronRight size={18} />
            </a>
          </div>

          {/* Horizontal scroll container */}
          <div className="overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#06b6d4 transparent' }}>
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {projects.map((project, i) => (
                <NodeGraphCard
                  key={i}
                  className="group flex-shrink-0 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-shadow"
                  style={{ width: '340px' }}
                >
                  <div className="p-8 flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100 group-hover:text-[#06b6d4] transition-colors">{project.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{project.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-[10px] font-bold text-cyan-700 dark:text-[#06b6d4] border border-cyan-300 dark:border-cyan-700/50 transition-all duration-300 hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_12px_#06b6d4] hover:scale-110 cursor-default">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setProjectModal(project)}
                        className="px-5 py-2.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:scale-105 transition-transform shadow-md hover:bg-cyan-500"
                      >
                        Details
                      </button>
                      <a href={project.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#06b6d4] hover:border-[#06b6d4] transition-colors">
                        <Github size={18} />
                      </a>
                    </div>
                  </div>
                </NodeGraphCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {projectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setProjectModal(null)} />
          <div className="relative glass-card rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scale-in border-[#ff1493]/30">
            <button onClick={() => setProjectModal(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#ff1493] transition-colors"><X size={20} /></button>
            <h3 className="text-2xl font-bold mb-4 pr-10">{projectModal.title}</h3>
            <ProjectSlideshow images={projectModal.screenshots} title={projectModal.title} />
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{projectModal.desc}</p>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mono">Project Highlights</h4>
              <ul className="space-y-2">
                {projectModal.highlights ? projectModal.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff1493] pink-glow mt-1.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                )) : (
                  <>
                    <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1493] pink-glow" /> Advanced data processing with {projectModal.tech[0]}</li>
                    <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1493] pink-glow" /> Interactive visualizations and reporting</li>
                  </>
                )}
              </ul>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {projectModal.liveUrl && (
                <a href={projectModal.liveUrl} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] hover:bg-[#06b6d4]/20 hover:border-[#06b6d4]/60 rounded-lg font-bold text-center transition-all shadow-sm">View Live Demo</a>
              )}
              <a href={projectModal.github} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-pink-gradient text-white rounded-lg font-bold text-center hover:opacity-90 transition-opacity">View Source Code</a>
            </div>
          </div>
        </div>
      )}

      {/* Resume Section */}
      <section id="resume" className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div>
              <div className="mono text-[#ff1493] text-sm mb-2">// Experience</div>
              <h2 className="text-4xl md:text-5xl font-black mb-2">Career Journey</h2>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-pink-gradient text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-all">
                <FileText size={18} /> Download CV
              </button>
              <a href="https://shorturl.at/IvKAz" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-red-600 border border-red-500 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)] hover:shadow-[0_0_25px_rgba(239,68,68,0.9)] hover:scale-105 transition-all">
                PDF
              </a>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="mb-16 relative">
            {/* L-shaped top-left corner */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#06b6d4]" />
            {/* L-shaped bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#ff1493]" />
            <div className="px-8 py-6">
              <div className="mono text-[#ff1493] text-xs mb-3">// Professional Summary</div>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                Results-driven Data Analyst with 3+ years of experience transforming raw data into strategic insights through Power BI, SQL, Python, and advanced Excel automation. Proven track record of building scalable dashboards, end-to-end ETL pipelines, and AI-driven analytics solutions across finance, e-commerce, and research domains.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mt-3">
                Adept at bridging technical complexity with business clarity — delivering data products that drive measurable growth, reduce operational friction, and empower stakeholder decision-making at scale.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {[
              {
                title: 'Data Analyst – Admin Executive',
                company: 'Market Maven Research',
                location: 'Bengaluru, Karnataka',
                period: 'Feb 2024 - Feb 2026',
                points: [
                  'Directed CRM operations for 100+ sales team members, improving efficiency and lead assignment accuracy.',
                  'Developed centralized Master Sheets to track clients, payments, complaints, and service upgrades.',
                  'Designed monthly performance dashboards and sales presentations for stakeholder decision-making.'
                ]
              },
              {
                title: 'Market Research & Data Analyst',
                company: 'TRIO Clothing’s',
                location: 'Kathmandu, Nepal',
                period: 'Oct 2022 - Jan 2024',
                points: [
                  'Conducted research on fashion trends across India and Nepal for product development strategy.',
                  'Recommended cost-effective raw material sourcing locations, optimizing procurement costs.',
                  'Analyzed competitors and seasonal trends to guide startup’s market positioning.'
                ]
              },
              {
                title: 'Power BI Developer & Data Analyst',
                company: 'Freelancing',
                period: 'Apr 2022 – Aug 2024',
                points: [
                  'Engineered scalable data models and automated workflows using Power BI, SQL, and Python.',
                  'Created interactive dashboards for executives using Power BI, Tableau, and Google Data Studio.',
                  'Integrated multi-source data (BigQuery, IBM Cloud, APIs) reducing errors by 95%.'
                ]
              }
            ].slice(0, showFullJourney ? undefined : 2).map((job, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0">
                <div className="md:grid md:grid-cols-5 md:gap-8 items-start relative">
                  <div className="hidden md:block col-span-1 text-right pt-1">
                    <span className="text-sm font-bold text-[#ff1493] mono">{job.period}</span>
                  </div>
                  <div className="col-span-4 relative pl-8 md:border-l border-slate-400 dark:border-slate-700">
                    {/* Mobile continuous line */}
                    <div className="absolute left-0 top-0 bottom-[-3rem] w-px bg-slate-400 dark:bg-slate-700 md:hidden" />

                    <div className="absolute left-[-5px] md:left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-[#06b6d4] ring-4 ring-cyan-100 dark:ring-slate-900 z-10" />

                    <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between md:hidden">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <span className="text-sm font-bold text-[#ff1493] mono">{job.period}</span>
                    </div>
                    <h3 className="hidden md:block text-2xl font-bold mb-1">{job.title}</h3>

                    <p className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-bold text-slate-500 mb-4 mono">
                      {job.company}
                      {job.location && <span className="text-xs font-normal italic text-slate-400 dark:text-slate-500 ml-1">, {job.location}</span>}
                    </p>
                    <ul className="space-y-3">
                      {job.points.map((p, i) => (
                        <li key={i} className="text-slate-800 dark:text-slate-400 text-sm leading-relaxed flex gap-3">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#ff1493] pink-glow shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Internship & Training */}
          {showFullJourney && (
            <div className="mt-12 fade-up">
              <div className="flex items-center gap-3 mb-10">
                <div className="mono text-[#06b6d4] text-sm">// Internship &amp; Training</div>
                <div className="h-px flex-1 bg-gradient-to-r from-[#06b6d4]/40 to-transparent" />
              </div>
              <div className="space-y-12">
                {[
                  {
                    title: '3 Months Internship – Data Analytics Program',
                    company: 'Labmentix',
                    period: 'Jan 2022 – Apr 2022',
                    color: '#06b6d4',
                    points: [
                      'Completed hands-on Data Analytics & AI internships focused on real-world projects using SQL, Excel, Power BI, Tableau, and Python, with mentorship-driven learning and practical reporting.',
                      'Built end-to-end dashboards and analytics solutions, applying Python (Pandas, Seaborn), SQL, MongoDB, Power Query, DAX, and VBA Macros on projects including land price prediction and X-ray image classification (CNN).'
                    ]
                  },
                  {
                    title: 'Data Science & Machine Learning Training',
                    company: 'Excellence Technology, Mohali',
                    period: 'Feb 2021 – Jun 2021',
                    color: '#a78bfa',
                    points: [
                      'Engineered Python-based ML projects using TensorFlow, OpenCV, and NumPy, building deployment-ready prototypes with real-world data pipelines and visualizations (Matplotlib) in collaborative team environments using Jupyter, PyCharm, and Anaconda.'
                    ]
                  },
                  {
                    title: 'Core Python Programming Training',
                    company: 'Nordia Ventures, Mohali',
                    period: 'Jun 2019 – Jul 2019',
                    color: '#22d3ee',
                    points: [
                      'Mastered core Python concepts through coding challenges and mini projects, building strong foundations in functions, data structures, and automation for future data science applications.'
                    ]
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-0">
                    <div className="md:grid md:grid-cols-5 md:gap-8 items-start relative">
                      <div className="hidden md:block col-span-1 text-right pt-1">
                        <span className="text-sm font-bold mono" style={{ color: item.color }}>{item.period}</span>
                      </div>
                      <div className="col-span-4 relative pl-8 md:border-l border-slate-300 dark:border-slate-700">
                        <div className="absolute left-0 top-0 bottom-[-3rem] w-px md:hidden" style={{ background: item.color + '60' }} />
                        <div className="absolute left-[-5px] md:left-[-5px] top-2 w-2.5 h-2.5 rounded-full ring-4 ring-cyan-100 dark:ring-slate-900 z-10" style={{ background: item.color }} />
                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between md:hidden">
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <span className="text-sm font-bold mono" style={{ color: item.color }}>{item.period}</span>
                        </div>
                        <h3 className="hidden md:block text-xl font-bold mb-1">{item.title}</h3>
                        <p className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-bold text-slate-500 mb-4 mono">{item.company}</p>
                        <ul className="space-y-3">
                          {item.points.map((p, i) => (
                            <li key={i} className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed flex gap-3">
                              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: item.color }} />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowFullJourney(!showFullJourney)}
              className="group flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[#06b6d4] border border-[#06b6d4]/30 hover:border-[#ff1493]/50 hover:text-[#ff1493] transition-all bg-cyan-900/10 hover:bg-pink-900/10 dark:bg-cyan-900/20 dark:hover:bg-pink-900/20 shadow-sm"
            >
              {showFullJourney ? 'Show Less' : 'View Full Experience'}
              <ArrowRight size={18} className={`transition-transform duration-300 ${showFullJourney ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
            </button>
          </div>

        </div>
      </section>

      {/* Tools & Skills */}
      <section id="tools" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="mono text-[#ff1493] text-sm mb-2">// Core Toolbox</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Tech Stack</h2>
        </div>

        <div ref={skillsRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {tools.map((tool, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg glass-card text-[#ff1493] group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{tool.name}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-500 mono mt-1">{tool.role}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#ff1493]">{tool.exp}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-gradient transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_#ff1493]"
                  style={{ width: skillsVisible ? `${tool.level}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Generative AI & Automation Tools — AI Ecosystem */}
      <section id="ai-tools" className="py-24 px-0 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <div className="mono text-[#ff1493] text-sm mb-2">// Modern Workflow</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Generative AI &amp; Automation Tools</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base">
            Leveraging cutting-edge AI platforms and no-code automation tools to build smarter, faster workflows.
          </p>
        </div>

        {(() => {
          const toolCategories = [
            {
              label: 'AI Assistants & LLMs',
              shortLabel: 'AI Assistants',
              color: '#ff1493',
              icon: <BrainCircuit className="w-5 h-5" />,
              summary: 'Large language models for reasoning, coding & conversation',
              tools: [
                { name: 'Google AI Studio', badge: 'Gemini', description: 'Prototyping with Gemini models for data & content tasks.', useCases: ['Model prototyping', 'Prompt engineering', 'API testing'], bestFor: 'Developers building Gemini-powered applications.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg' },
                { name: 'Claude (Anthropic)', badge: 'LLM', description: 'Advanced reasoning, document analysis & code generation.', useCases: ['Code refactoring', 'Large context parsing', 'Writing'], bestFor: 'Complex reasoning tasks requiring high contextual awareness.', logo: 'https://cdn.simpleicons.org/anthropic?viewbox=auto' },
                { name: 'ChatGPT', badge: 'OpenAI', description: 'Versatile conversational AI for analysis and task automation.', useCases: ['Data analysis', 'Automation scripting', 'General queries'], bestFor: 'Everyday task automation and quick code snippets.', logo: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128' },
                { name: 'Meta AI', badge: 'Multi-modal', description: 'Intelligent assistant for social integration and creative generation.', useCases: ['Image generation', 'Conversational AI', 'Social tools'], bestFor: 'Integrated multimodal workflows.', logo: 'https://cdn.simpleicons.org/meta?viewbox=auto' },
                { name: 'Cursor', badge: 'IDE', description: 'AI-native code editor designed for pair programming with LLMs.', useCases: ['Pair programming', 'Codebase chatting', 'Auto-completion'], bestFor: 'Developers seeking maximum coding efficiency.', logo: 'https://cdn.simpleicons.org/cursor?viewbox=auto' },
                { name: 'Google Antigravity', badge: 'Agentic', description: 'AI-powered agentic coding & rapid development assistant.', useCases: ['Autonomous task execution', 'Complex planning', 'Full-stack dev'], bestFor: 'Advanced autonomous agentic workflows.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg' },
              ]
            },
            {
              label: 'Data Generation & Aug',
              shortLabel: 'Data Gen',
              color: '#f59e0b',
              icon: <Database className="w-5 h-5" />,
              summary: 'Synthetic data, notebooks & augmentation pipelines',
              tools: [
                { name: 'DataRobot', badge: 'Enterprise', description: 'End-to-end AI platform for predictive modeling and generation.', useCases: ['Predictive modeling', 'MLOps', 'Automated ML'], bestFor: 'Enterprise teams deploying ML models at scale.', logo: 'https://www.google.com/s2/favicons?domain=datarobot.com&sz=128' },
                { name: 'Mostly.ai', badge: 'Synthetic', description: 'Synthetic data generation for privacy-safe AI training.', useCases: ['Privacy compliance', 'Test data generation', 'Data augmentation'], bestFor: 'Organizations handling sensitive PII data.', logo: 'https://www.google.com/s2/favicons?domain=mostly.ai&sz=128' },
                { name: 'Google Colab', badge: 'Compute', description: 'Interactive notebook for high-performance data computation.', useCases: ['GPU-accelerated training', 'Data EDA', 'Prototyping'], bestFor: 'Data scientists needing immediate access to GPU compute.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg' },
                { name: 'Jupyter Notebook', badge: 'Environment', description: 'Open-source web application for interactive computing.', useCases: ['Data visualization', 'Machine learning', 'Statistical modeling'], bestFor: 'Local and interactive exploratory data analysis.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg' },
                { name: 'Universal Data', badge: 'Augment', description: 'Scalable data augmentation and labeling infrastructure.', useCases: ['Data labeling', 'Dataset expansion', 'Quality control'], bestFor: 'Teams needing high-quality labeled datasets.', logo: 'https://www.google.com/s2/favicons?domain=universaldatatool.com&sz=128' },
              ]
            },
            {
              label: 'Data Prep & Query',
              shortLabel: 'Data Prep',
              color: '#10b981',
              icon: <Layers className="w-5 h-5" />,
              summary: 'Natural language SQL, cleaning & data wrangling',
              tools: [
                { name: 'ChatCSV', badge: 'Utility', description: 'Natural language interface for spreadsheet manipulation.', useCases: ['Rapid EDA', 'CSV querying', 'Data filtering'], bestFor: 'Non-technical stakeholders needing quick data answers.', logo: 'https://www.google.com/s2/favicons?domain=chatcsv.co&sz=128' },
                { name: 'Tomato.ai', badge: 'Automation', description: 'Automated data cleaning and voice transformation tools.', useCases: ['Voice masking', 'Audio processing', 'Data standardization'], bestFor: 'Call centers and voice data processors.', logo: 'https://www.google.com/s2/favicons?domain=tomato.ai&sz=128' },
                { name: 'SQLthroughAI', badge: 'SQL', description: 'Generating complex SQL queries from plain English prompts.', useCases: ['Query generation', 'Database exploration', 'Syntax correction'], bestFor: 'Analysts looking to speed up ad-hoc reporting.', logo: 'https://www.google.com/s2/favicons?domain=sqlthroughai.com&sz=128' },
                { name: 'DBSensei', badge: 'Database', description: 'AI-powered database schema understanding and querying.', useCases: ['Schema analysis', 'Query optimization', 'Data mapping'], bestFor: 'Database administrators and data engineers.', logo: 'https://www.google.com/s2/favicons?domain=dbsensei.com&sz=128' },
              ]
            },
            {
              label: 'Insights & Analytics',
              shortLabel: 'Analytics',
              color: '#06b6d4',
              icon: <BarChart3 className="w-5 h-5" />,
              summary: 'Web analytics, predictive models & AI-driven insights',
              tools: [
                { name: 'Google Analytics', badge: 'Analytics', description: 'Comprehensive web traffic and user behavior tracking.', useCases: ['Traffic monitoring', 'Conversion tracking', 'User journey mapping'], bestFor: 'Marketing teams optimizing web performance.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg' },
                { name: 'Adobe Analytics', badge: 'Marketing', description: 'Enterprise-grade marketing and customer journey insights.', useCases: ['Omnichannel tracking', 'Predictive analytics', 'Customer segmentation'], bestFor: 'Large enterprises with complex multi-channel presences.', logo: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128' },
                { name: 'Julius AI', badge: 'Reporting', description: 'Advanced data analysis and automated reporting specialist.', useCases: ['Data visualization', 'Automated insights', 'Statistical testing'], bestFor: 'Analysts who want a conversational copilot for charting.', logo: 'https://www.google.com/s2/favicons?domain=julius.ai&sz=128' },
                { name: 'Akkio', badge: 'Predictive', description: 'No-code predictive analytics and AI data modeling.', useCases: ['Lead scoring', 'Churn prediction', 'Forecasting'], bestFor: 'Agencies and teams needing quick predictive models without coding.', logo: 'https://www.google.com/s2/favicons?domain=akkio.com&sz=128' },
                { name: 'Halo.com', badge: 'Q&A', description: 'AI-driven Q&A interface for organizational data insights.', useCases: ['Internal knowledge base', 'Data democratisation', 'Natural language BI'], bestFor: 'Business users querying company databases.', logo: 'https://www.google.com/s2/favicons?domain=haloagents.ai&sz=128' },
              ]
            },
            {
              label: 'AI Frameworks & BI',
              shortLabel: 'Frameworks',
              color: '#6366f1',
              icon: <Terminal className="w-5 h-5" />,
              summary: 'BI platforms, dashboarding & embedded analytics',
              tools: [
                { name: 'Dash Plotly', badge: 'Framework', description: 'Python framework for building analytical web applications.', useCases: ['Interactive dashboards', 'Data apps', 'Python analytics'], bestFor: 'Teams that want custom analytical apps using Python.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/plotly/plotly-original.svg' },
                { name: 'Tableau AI', badge: 'BI', description: 'Intelligent visual analytics and automated insights.', useCases: ['Dashboard generation', 'Data storytelling', 'Automated insights'], bestFor: 'Data analysts looking to accelerate dashboard creation.', logo: 'https://www.google.com/s2/favicons?domain=tableau.com&sz=128' },
                { name: 'Einstein Copilot', badge: 'Enterprise', description: 'Salesforce-integrated AI for CRM and data automation.', useCases: ['CRM automation', 'Sales forecasting', 'Customer insights'], bestFor: 'Salesforce-driven sales and marketing operations.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/salesforce/salesforce-original.svg' },
                { name: 'ThoughtSpot', badge: 'Search', description: 'Search and AI-driven analytics for real-time insights.', useCases: ['Natural language search', 'Live analytics', 'Embedded BI'], bestFor: 'Organizations prioritizing self-service analytics.', logo: 'https://www.google.com/s2/favicons?domain=thoughtspot.com&sz=128' },
                { name: 'Sisense', badge: 'Embedded', description: 'Embedding advanced analytics into software and workflows.', useCases: ['Embedded analytics', 'Custom BI apps', 'API-driven data'], bestFor: 'Product teams embedding BI into their own SaaS platforms.', logo: 'https://www.google.com/s2/favicons?domain=sisense.com&sz=128' },
              ]
            },
            {
              label: 'Workflow & Productivity',
              shortLabel: 'Workflow',
              color: '#a78bfa',
              icon: <Workflow className="w-5 h-5" />,
              summary: 'Automation, design & productivity AI tools',
              tools: [
                { name: 'n8n', badge: 'Automation', description: 'Self-hosted workflow automation & API orchestration.', useCases: ['API integration', 'Data pipelines', 'Trigger-based workflows'], bestFor: 'Technical teams wanting flexible, code-friendly automation.', logo: 'https://cdn.simpleicons.org/n8n?viewbox=auto' },
                { name: 'Notion AI', badge: 'Docs', description: 'AI-powered knowledge management and documentation.', useCases: ['Content summarization', 'Brainstorming', 'Writing assistance'], bestFor: 'Teams using Notion for centralized workspace management.', logo: 'https://cdn.simpleicons.org/notion?viewbox=auto' },
                { name: 'Canva AI', badge: 'Design', description: 'AI-assisted design for reports and presentations.', useCases: ['Presentation generation', 'Image editing', 'Marketing assets'], bestFor: 'Marketers and analysts creating visual presentations.', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg' },
                { name: 'Adobe Firefly', badge: 'GenAI', description: 'Generative AI for creative visual asset creation.', useCases: ['Image generation', 'Text effects', 'Vector recoloring'], bestFor: 'Designers needing commercially safe AI imagery.', logo: 'https://www.google.com/s2/favicons?domain=firefly.adobe.com&sz=128' },
              ]
            },
          ];

          const iconTools3D = [
            // Group 1: Coding & Development
            { name: 'Python', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" className="w-11 h-11 sm:w-13 sm:h-13 object-contain" alt="Python" />, glowColor: 'rgba(55, 115, 165, 0.35)' },
            { name: 'VS Code', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" className="w-11 h-11 sm:w-13 sm:h-13 object-contain" alt="VS Code" />, glowColor: 'rgba(0, 122, 204, 0.35)' },
            { name: 'Cursor', icon: <img src="https://cdn.simpleicons.org/cursor?viewbox=auto" className="w-11 h-11 sm:w-13 sm:h-13 object-contain dark:invert" alt="Cursor" />, glowColor: 'rgba(100, 100, 100, 0.35)' },
            { name: 'Jupyter', icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg" className="w-11 h-11 sm:w-13 sm:h-13 object-contain" alt="Jupyter" />, glowColor: 'rgba(243, 118, 38, 0.35)' },
            { name: 'Google Colab', icon: <img src="https://cdn.simpleicons.org/googlecolab?viewbox=auto" className="w-11 h-11 sm:w-13 sm:h-13 object-contain" alt="Google Colab" />, glowColor: 'rgba(249, 115, 22, 0.35)' },

            // Group 2: AI & Automation
            { name: 'Antigravity', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 22C3 15 6 4 12 4s9 11 10 18h-3.5c-.8-5-2.5-12-6.5-12s-5.7 7-6.5 12H2z" fill="url(#antigravity-rainbow)" />
                <defs>
                  <linearGradient id="antigravity-rainbow" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="25%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="75%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(59, 130, 246, 0.4)' },
            { name: 'ChatGPT', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13 text-[#10a37f]" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 .001.001z"/>
              </svg>
            ), glowColor: 'rgba(16, 163, 127, 0.35)' },
            { name: 'Claude', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 100 100" fill="#D97757" xmlns="http://www.w3.org/2000/svg">
                <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
              </svg>
            ), glowColor: 'rgba(217, 119, 87, 0.35)' },
            { name: 'n8n', icon: <img src="https://cdn.simpleicons.org/n8n?viewbox=auto" className="w-11 h-11 sm:w-13 sm:h-13 object-contain" alt="n8n" />, glowColor: 'rgba(255, 110, 78, 0.35)' },

            // Group 3: Data Analysis & Business Intelligence
            { name: 'Power BI', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="13.5" width="5" height="10.5" rx="1.5" fill="url(#pbi-left)" />
                <rect x="8" y="7" width="5" height="17" rx="1.5" fill="url(#pbi-middle)" />
                <rect x="14.5" y="0.5" width="5" height="23.5" rx="1.5" fill="url(#pbi-right)" />
                <defs>
                  <linearGradient id="pbi-left" x1="4" y1="13.5" x2="4" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFE082" />
                    <stop offset="100%" stopColor="#F2C811" />
                  </linearGradient>
                  <linearGradient id="pbi-middle" x1="10.5" y1="7" x2="10.5" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F5B041" />
                    <stop offset="100%" stopColor="#F29F05" />
                  </linearGradient>
                  <linearGradient id="pbi-right" x1="17" y1="0.5" x2="17" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F0B27A" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(242, 191, 0, 0.35)' },
            { name: 'Tableau', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* 1. Center Cross (Red/Orange, Large) */}
                <rect x="45" y="25" width="10" height="50" rx="1.5" fill="#E31815" />
                <rect x="25" y="45" width="50" height="10" rx="1.5" fill="#E31815" />

                {/* 2. Top Cross (Orange, Medium) */}
                <rect x="47" y="5" width="6" height="20" rx="1" fill="#F29F05" />
                <rect x="40" y="12" width="20" height="6" rx="1" fill="#F29F05" />

                {/* 3. Bottom Cross (Orange-Red, Medium) */}
                <rect x="47" y="75" width="6" height="20" rx="1" fill="#E31815" />
                <rect x="40" y="82" width="20" height="6" rx="1" fill="#E31815" />

                {/* 4. Left Cross (Blue, Medium) */}
                <rect x="12" y="40" width="6" height="20" rx="1" fill="#1F77B4" />
                <rect x="5" y="47" width="20" height="6" rx="1" fill="#1F77B4" />

                {/* 5. Right Cross (Blue, Medium) */}
                <rect x="82" y="40" width="6" height="20" rx="1" fill="#1F77B4" />
                <rect x="75" y="47" width="20" height="6" rx="1" fill="#1F77B4" />

                {/* 6. Top-Left Cross (Green, Small) */}
                <rect x="23" y="20" width="4" height="14" rx="0.8" fill="#59A14F" />
                <rect x="18" y="25" width="14" height="4" rx="0.8" fill="#59A14F" />

                {/* 7. Top-Right Cross (Teal, Small) */}
                <rect x="73" y="20" width="4" height="14" rx="0.8" fill="#499894" />
                <rect x="68" y="25" width="14" height="4" rx="0.8" fill="#499894" />

                {/* 8. Bottom-Left Cross (Light Green, Small) */}
                <rect x="23" y="66" width="4" height="14" rx="0.8" fill="#8CD17D" />
                <rect x="18" y="71" width="14" height="4" rx="0.8" fill="#8CD17D" />

                {/* 9. Bottom-Right Cross (Light Orange, Small) */}
                <rect x="73" y="66" width="4" height="14" rx="0.8" fill="#F28E2B" />
                <rect x="68" y="71" width="14" height="4" rx="0.8" fill="#F28E2B" />
              </svg>
            ), glowColor: 'rgba(227, 24, 55, 0.3)' },
            { name: 'Excel', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="3" fill="#107C41" />
                <path d="M7 6h10v2H7zM7 11h10v2H7zM7 16h10v2H7z" fill="#FFFFFF" opacity="0.25" />
                <path d="M8.5 7.5l7 9M15.5 7.5l-7 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ), glowColor: 'rgba(16, 124, 65, 0.35)' },
            { name: 'Adobe Analytics', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L1.5 22h4.8l2.2-4.8h7l2.2 4.8h4.8L12 2zm0 6.5l2.5 5.5h-5L12 8.5z" fill="url(#adobe-a-grad)" filter="drop-shadow(0 2px 5px rgba(255, 0, 0, 0.4))" />
                <defs>
                  <linearGradient id="adobe-a-grad" x1="0" y1="2" x2="24" y2="22">
                    <stop offset="0%" stopColor="#FF4B4B" />
                    <stop offset="100%" stopColor="#FF0000" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(255, 0, 0, 0.35)' },
            { name: 'Google Analytics', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18h3v-4H4v4zm5 0h3V7H9v11zm5 0h3v-7h-3v7zm5 0h3V3h-3v15z" fill="url(#ga-grad)" />
                <defs>
                  <linearGradient id="ga-grad" x1="13.5" y1="3" x2="13.5" y2="18" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F9AB00" />
                    <stop offset="100%" stopColor="#E65100" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(249, 171, 0, 0.35)' },

            // Group 4: Productivity & Collaboration
            { name: 'Notion', icon: <img src="https://cdn.simpleicons.org/notion?viewbox=auto" className="w-11 h-11 sm:w-13 sm:h-13 object-contain dark:invert" alt="Notion" />, glowColor: 'rgba(150, 150, 150, 0.2)' },

            // Group 5: Creative & Design Tools
            { name: 'Canva', icon: <img src="https://www.vectorlogo.zone/logos/canva/canva-icon.svg" className="w-11 h-11 sm:w-13 sm:h-13 object-contain" alt="Canva" />, glowColor: 'rgba(0, 196, 204, 0.35)' },
            { name: 'Photoshop', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="url(#ps-text-grad)" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" filter="drop-shadow(0 2px 4px rgba(0, 200, 255, 0.4))">Ps</text>
                <defs>
                  <linearGradient id="ps-text-grad" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#80E5FF" />
                    <stop offset="100%" stopColor="#007BFF" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(0, 200, 255, 0.35)' },
            { name: 'Illustrator', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="url(#ai-text-grad)" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" filter="drop-shadow(0 2px 4px rgba(255, 154, 0, 0.4))">Ai</text>
                <defs>
                  <linearGradient id="ai-text-grad" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#FFE082" />
                    <stop offset="100%" stopColor="#FF9A00" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(255, 154, 0, 0.35)' },
            { name: 'Lightroom', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="url(#lr-text-grad)" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" filter="drop-shadow(0 2px 4px rgba(49, 168, 255, 0.4))">Lr</text>
                <defs>
                  <linearGradient id="lr-text-grad" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#B3E5FC" />
                    <stop offset="100%" stopColor="#31A8FF" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(49, 168, 255, 0.35)' },
            { name: 'Firefly', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="url(#ff-text-grad)" fontSize="16" fontWeight="900" fontFamily="system-ui, sans-serif" filter="drop-shadow(0 2px 4px rgba(255, 0, 122, 0.4))">Ff</text>
                <defs>
                  <linearGradient id="ff-text-grad" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#FF0F00" />
                    <stop offset="40%" stopColor="#FF007A" />
                    <stop offset="100%" stopColor="#7B00FF" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(255, 15, 0, 0.35)' },
            { name: 'CorelDRAW', icon: (
              <svg className="w-11 h-11 sm:w-13 sm:h-13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C7.58 2 4 5.58 4 10c0 3.2 2.5 6.2 5 8.5v1.5h6v-1.5c2.5-2.3 5-5.3 5-8.5 0-4.42-3.58-8-8-8z" fill="url(#corel-grad)" />
                <rect x="10.5" y="21.5" width="3" height="2" rx="0.5" fill="#7A7A7A" />
                <line x1="9.5" y1="20" x2="11" y2="21.5" stroke="#7A7A7A" strokeWidth="0.5" />
                <line x1="14.5" y1="20" x2="13" y2="21.5" stroke="#7A7A7A" strokeWidth="0.5" />
                <defs>
                  <linearGradient id="corel-grad" x1="12" y1="2" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8BEB34" />
                    <stop offset="100%" stopColor="#0E932E" />
                  </linearGradient>
                </defs>
              </svg>
            ), glowColor: 'rgba(14, 147, 46, 0.35)' }
          ];

          return (
            <div className="w-full flex flex-col items-center">
              {/* ── AI Ecosystem Canvas (centered inside max-w-7xl) ── */}
              <div className="max-w-7xl mx-auto px-4 w-full flex justify-center">
                <AiEcosystem categories={toolCategories} dark={dark} />
              </div>

              {/* ── 3D Icon Marquee (full width, edge-to-edge) ── */}
              <div className="w-full mt-6 overflow-hidden flex py-6 whitespace-nowrap relative">
                {/* Soft gradient masks on left and right edges for a premium fading look */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#fafafa] dark:from-[#0f172a] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#fafafa] dark:from-[#0f172a] to-transparent z-10 pointer-events-none" />

                <div className="flex animate-marquee min-w-max">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      {iconTools3D.map((tool, j) => (
                        <div key={`${i}-${j}`} className="relative group mx-3.5 sm:mx-5 flex items-center justify-center">
                          {/* Glow behind the icon on hover */}
                          <div 
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none w-20 h-20"
                            style={{ background: `radial-gradient(circle, ${tool.glowColor} 0%, transparent 70%)` }}
                          />
                          
                          {/* The Icon itself, scaling and floating on hover */}
                          <div className="relative z-10 transition-all duration-500 group-hover:scale-115 group-hover:-translate-y-2 cursor-pointer filter drop-shadow-md hover:drop-shadow-xl">
                            {tool.icon}
                          </div>
                          
                          {/* Tool Name Tooltip */}
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-slate-900/90 dark:bg-slate-800/90 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10 z-20">
                            {tool.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Certifications & Achievements Section */}
      <CertificationSection />

{/* About Me Section (Moved to Bottom) */}
      <section id="about" className="relative w-full py-24 overflow-hidden bg-transparent z-10">
        {/* Full-width animated background wavy lines */}
        <WavyLinesCanvas />
        
        {/* Centered content container */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/20 text-[#06b6d4] mono text-xs font-bold shadow-sm backdrop-blur-sm mb-4">
              $ cat about_me.md
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              About <span className="text-gradient">Me</span>
            </h2>
            <p className="text-slate-800 dark:text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed text-justify md:text-center">
              Driven by curiosity and strategic thinking, I bridge the gap between data and decision-making to create measurable business impact.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-5 flex flex-col items-center text-center fade-up delay-100">
              <div className="relative w-[280px] sm:w-[320px] h-[350px] sm:h-[400px] mb-4 group select-none flex items-center justify-center">
                {/* Back glowing ambient light with dynamic pulse (deep blue matching the background) */}
                <div className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-72 h-72 rounded-full bg-[#1e40af]/15 blur-3xl pointer-events-none z-0 animate-pulse" />
                
                {/* Submerged transparent cutout image with circular edge-blending mask to prevent cropping */}
                <img
                  src="/rahul-about-nobg.png"
                  alt="Rahul Adhikari"
                  className="w-full h-full object-cover relative z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    WebkitMaskImage: 'radial-gradient(ellipse at 50% 25%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0) 92%)',
                    maskImage: 'radial-gradient(ellipse at 50% 25%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0) 92%)',
                    filter: 'drop-shadow(0 0 25px rgba(29,78,216,0.25)) drop-shadow(0 0 10px rgba(99,102,241,0.15))'
                  }}
                />
                
                {/* Dark oval vignette overlay to blend photo edges organically */}
                <div 
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background: `radial-gradient(ellipse at 50% 25%, rgba(${dark ? '15,23,42' : '250,250,250'},0) 30%, rgba(${dark ? '15,23,42' : '250,250,250'},0.9) 70%, rgba(${dark ? '15,23,42' : '250,250,250'},1) 94%)`
                  }}
                />

                {/* Glowing ash/debris canvas overlay */}
                <AboutDebrisCanvas />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Rahul Adhikari</h3>
              <p className="text-sm font-bold text-[#06b6d4] tracking-wide mb-6">Data Analyst &amp; BI Specialist</p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: <Linkedin size={18} />, href: 'https://linkedin.com/in/irahuladhikari', label: 'LinkedIn' },
                { icon: <Github size={18} />, href: 'https://github.com/ursrahuladhikari', label: 'GitHub' },
                { icon: <Mail size={18} />, href: 'mailto:irahuladhikari@gmail.com', label: 'Email' },
                { icon: <Instagram size={18} />, href: 'https://instagram.com/ursrahuladhikari', label: 'Instagram' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={social.label}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-[#06b6d4] dark:hover:text-[#06b6d4] hover:border-[#06b6d4]/40 dark:hover:border-[#06b6d4]/40 transition-all hover:scale-110 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Who I Am & Details */}
          <div className="lg:col-span-7 space-y-6 fade-up delay-200">
            {/* Who I Am Card */}
            <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-4 text-[#06b6d4]">
                <User size={20} />
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Who I Am</h4>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 text-justify">
                I'm <strong className="font-bold text-slate-900 dark:text-slate-100">Rahul Adhikari</strong>, a data-driven professional based in <span className="text-[#06b6d4] font-bold">Bengaluru, India</span>. With over 3.5 years of hands-on experience, I specialize in building end-to-end data solutions — from crafting complex SQL queries and designing star-schema data models to building interactive Power BI dashboards that drive real business decisions.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                My toolkit spans <span className="text-[#ff1493] font-bold">Power BI, DAX, SQL, Python, BigQuery</span>, and <span className="text-[#ff1493] font-bold">Generative AI / ML</span>. I'm passionate about automation, ETL pipelines, and turning messy datasets into clean, actionable insights. Whether it's designing a KPI dashboard for stakeholders or building an ML model, I bring precision and a product mindset to every project.
              </p>
            </div>

            {/* Location & Experience Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[#06b6d4] mb-2">
                  <MapPin size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mono">Location</span>
                </div>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">Bengaluru, India</p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[#06b6d4] mb-2">
                  <Briefcase size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mono">Experience</span>
                </div>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">3.5+ Years Professional</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=irahuladhikari@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[180px] py-3 px-5 rounded-xl bg-pink-gradient text-white text-xs sm:text-sm font-bold hover:scale-102 transition-transform text-center shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Mail size={18} className="shrink-0" /> Let's Work Together
              </a>
              
              <a
                href="https://wa.me/917737006542"
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[180px] py-3 px-5 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-500 text-xs sm:text-sm font-bold hover:scale-102 transition-all text-center flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle size={18} className="shrink-0" /> WhatsApp
              </a>

              <a
                href="/Rahul Adhikari_Data Analyst_BI Analyst.pdf"
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[180px] py-3 px-5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold hover:scale-102 transition-all text-center flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <FileText size={18} className="shrink-0" /> Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left — Logo & name */}
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="RA Logo" className="h-12 w-auto object-contain opacity-80" />
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">Rahul Adhikari</p>
              </div>
            </div>

            {/* Right — Design info & copyright */}
            <div className="text-center md:text-right">
              <div className="text-xs text-slate-400 font-mono tracking-wider mb-1">
                DESIGNED & DEVELOPED WITH PRECISION
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                © {new Date().getFullYear()} Rahul Adhikari. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )}

      {/* Cookie Consent Banner */}
      <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] transition-all duration-700 ease-out w-[calc(100%-2rem)] max-w-sm ${cookieConsent === 'pending' ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}`}>
        <div className="glass-card bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-pink-gradient" />
          <div className="pl-3 mb-4">
            <h4 className="text-base font-bold mb-1.5 flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Shield size={16} className="text-[#06b6d4]" />
              Privacy Preferences
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-left">
              This site uses local storage to ensure you get the best browsing experience, such as remembering your viewing theme.
            </p>
          </div>
          <div className="flex items-center gap-3 pl-3">
            <button 
              onClick={rejectCookies}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={acceptCookies}
              className="flex-1 px-3 py-2 rounded-lg bg-pink-gradient text-white text-xs font-bold pink-glow hover:scale-105 transition-transform shadow-md"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
