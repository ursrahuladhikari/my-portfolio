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
  ChevronRight,
  ArrowRight,
  Shield
} from "lucide-react";

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

const App = () => {
  const [dark, setDark] = useState(true);
  const [projectModal, setProjectModal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullJourney, setShowFullJourney] = useState(false);
  const [showFullCerts, setShowFullCerts] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(null);
  const [activeAiTab, setActiveAiTab] = useState(0);
  const skillsRef = useRef(null);

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
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div class="job-period">Apr 2025 – Present</div>
    <div class="job-title">Data Analyst – Admin Executive</div>
    <div class="job-company">Market Maven Research</div>
    <ul class="points">
      <li>Directed CRM operations for 100+ sales team members, improving efficiency and lead assignment accuracy.</li>
      <li>Developed centralized Master Sheets to track clients, payments, complaints, and service upgrades.</li>
      <li>Designed monthly performance dashboards and sales presentations for stakeholder decision-making.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-period">Aug 2024 – Feb 2025</div>
    <div class="job-title">Market Research &amp; Data Analyst</div>
    <div class="job-company">TRIO Clothing's</div>
    <ul class="points">
      <li>Conducted research on fashion trends across India and Nepal for product development strategy.</li>
      <li>Recommended cost-effective raw material sourcing locations, optimizing procurement costs.</li>
      <li>Analyzed competitors and seasonal trends to guide startup's market positioning.</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-period">Apr 2022 – Aug 2024</div>
    <div class="job-title">Power BI Developer &amp; Data Analyst</div>
    <div class="job-company">Freelance Solutions</div>
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
    <div class="job-title">Esports Performance Analysis (PMGC 2023)</div>
    <div style="font-size: 11px; color: #475569; margin-bottom: 2px;">Power BI, SQL, Data Cleaning</div>
    <div style="font-size: 12px; color: #334155;">In-depth analysis and visualization of PMGC tournament data to track team/player performance metrics.</div>
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
      title: 'Netflix Recommendation System',
      desc: 'Machine learning based recommendation engine using collaborative filtering and content-based approaches.',
      tech: ['Python', 'Pandas', 'Scikit-Learn'],
      github: 'https://github.com/ursrahuladhikari/netflix-recommendation'
    },
    {
      title: 'Financial KPI Dashboard',
      desc: 'Automated financial reporting tool built with Excel VBA and integrated into Power BI for real-time tracking.',
      tech: ['Excel VBA', 'Power BI', 'DAX'],
      github: 'https://github.com/ursrahuladhikari/financial-dashboard'
    },
    {
      title: 'Esports Performance Analysis',
      desc: 'In-depth analysis of PMGC 2023 tournament data using Power BI to visualize team and player metrics.',
      tech: ['Power BI', 'SQL', 'Data Cleaning'],
      github: 'https://github.com/ursrahuladhikari/esports-analysis'
    },
    {
      title: 'RAG-Powered Agentic AI Assistant',
      desc: 'Built an end-to-end Retrieval-Augmented Generation (RAG) pipeline using LangChain, FAISS vector store, and OpenAI GPT. Integrated an Agentic AI layer with tool-calling capabilities to enable autonomous multi-step reasoning for business data Q&A.',
      tech: ['LangChain', 'RAG', 'OpenAI', 'FAISS', 'Python', 'Agentic AI'],
      github: 'https://github.com/ursrahuladhikari'
    }
  ];

  const tools = [
    { name: 'Power BI', role: 'Dashboard development, DAX, Power Query', exp: '3+ yrs', level: 95, icon: <PieChart className="w-5 h-5" /> },
    { name: 'SQL', role: 'Complex queries, Joins, BigQuery, Oracle', exp: '3 yrs', level: 90, icon: <Database className="w-5 h-5" /> },
    { name: 'Python', role: 'ETL, Pandas, NumPy, API integration', exp: '3 yrs', level: 88, icon: <Terminal className="w-5 h-5" /> },
    { name: 'Excel & VBA', role: 'Macros, Pivot tables, Automation', exp: '4 yrs', level: 97, icon: <FileText className="w-5 h-5" /> },
    { name: 'Machine Learning', role: 'TensorFlow, OpenCV, Scikit-learn', exp: '2+ yrs', level: 70, icon: <BrainCircuit className="w-5 h-5" /> }
  ];

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
      `}</style>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
        <aside className={`absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-black tracking-tighter text-gradient">RA.TECH</span>
              <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full text-hot-pink">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-4 font-mono text-sm">
              {['Home', 'Projects', 'Resume', 'Tools', 'Freelance', 'Contact'].map(item => (
                <button
                  key={item}
                  onClick={() => scrollToId(item === 'Home' ? '' : item.toLowerCase())}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-[#ff1493] transition-colors font-medium"
                >
                  <span className="text-[#db2777]">/</span> {item.toLowerCase()}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-40 px-6 py-4 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 border-b border-black/8 dark:border-white/10 shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => scrollToId('')}>
            <span className="text-2xl font-black tracking-tighter text-gradient group-hover:scale-105 transition-transform">
              RA.TECH
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-6">
            <ul className="hidden md:flex items-center gap-8 font-mono text-sm">
              {['Home', 'Projects', 'Resume', 'Tools'].map(item => (
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
                  <button onClick={() => scrollToId('freelance')} className="block w-full text-left px-5 py-3 text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700 hover:text-[#ff1493] transition-colors font-medium">
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
          <div className="relative glass-card rounded-2xl p-8 max-w-2xl w-full shadow-2xl scale-in overflow-hidden border-[#ff1493]/30">
            <button onClick={() => setProjectModal(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-[#ff1493] transition-colors"><X size={20} /></button>
            <h3 className="text-2xl font-bold mb-4 pr-10">{projectModal.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{projectModal.desc}</p>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mono">Project Highlights</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1493] pink-glow" /> Advanced data processing with {projectModal.tech[0]}</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-[#ff1493] pink-glow" /> Interactive visualizations and reporting</li>
              </ul>
            </div>
            <div className="mt-10 flex gap-4">
              <a href={projectModal.github} target="_blank" rel="noreferrer" className="flex-1 py-3 bg-pink-gradient text-white rounded-lg font-bold text-center hover:opacity-90 transition-opacity">View Source</a>
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
                period: 'Apr 2025 – Present',
                points: [
                  'Directed CRM operations for 100+ sales team members, improving efficiency and lead assignment accuracy.',
                  'Developed centralized Master Sheets to track clients, payments, complaints, and service upgrades.',
                  'Designed monthly performance dashboards and sales presentations for stakeholder decision-making.'
                ]
              },
              {
                title: 'Market Research & Data Analyst',
                company: 'TRIO Clothing’s',
                period: 'Aug 2024 – Feb 2025',
                points: [
                  'Conducted research on fashion trends across India and Nepal for product development strategy.',
                  'Recommended cost-effective raw material sourcing locations, optimizing procurement costs.',
                  'Analyzed competitors and seasonal trends to guide startup’s market positioning.'
                ]
              },
              {
                title: 'Power BI Developer & Data Analyst',
                company: 'Freelance Solutions',
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

                    <p className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-bold text-slate-500 mb-4 mono">{job.company}</p>
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

      {/* Generative AI & Automation Tools */}
      <section id="ai-tools" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="mono text-[#ff1493] text-sm mb-2">// Modern Workflow</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Generative AI &amp; Automation Tools</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base">
            Leveraging cutting-edge AI platforms and no-code automation tools to build smarter, faster workflows.
          </p>
        </div>

        {(() => {
          const aiCategories = [
            {
              label: 'Workflow Automation',
              color: '#06b6d4',
              bgLight: 'bg-cyan-50',
              bgDark: 'dark:bg-cyan-900/20',
              badgeBg: 'bg-cyan-100 dark:bg-cyan-900/40',
              badgeBorder: 'border-cyan-300 dark:border-cyan-700/50',
              dotShadow: '0_0_6px_#06b6d4',
              borderActive: 'border-[#06b6d4]',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              tools: [
                { name: 'n8n', desc: 'Self-hosted workflow automation & API orchestration', badge: 'Open Source' },
                { name: 'Microsoft Power Automate', desc: 'Enterprise process automation across the Microsoft 365 ecosystem', badge: 'Enterprise' },
              ]
            },
            {
              label: 'AI Assistants & LLMs',
              color: '#ff1493',
              bgLight: 'bg-pink-50',
              bgDark: 'dark:bg-pink-900/10',
              badgeBg: 'bg-pink-100 dark:bg-pink-900/40',
              badgeBorder: 'border-pink-300 dark:border-pink-700/50',
              dotShadow: '0_0_6px_#ff1493',
              borderActive: 'border-[#ff1493]',
              icon: <BrainCircuit className="w-4 h-4" />,
              tools: [
                { name: 'Google AI Studio', desc: 'Prototyping with Gemini models for data & content tasks', badge: 'Gemini' },
                { name: 'Google Antigravity', desc: 'AI-powered agentic coding & rapid development assistant', badge: 'Agentic' },
                { name: 'Claude (Anthropic)', desc: 'Advanced reasoning, document analysis & code generation', badge: 'LLM' },
              ]
            },
            {
              label: 'Productivity & Design',
              color: '#a78bfa',
              bgLight: 'bg-violet-50',
              bgDark: 'dark:bg-violet-900/10',
              badgeBg: 'bg-violet-100 dark:bg-violet-900/40',
              badgeBorder: 'border-violet-300 dark:border-violet-700/50',
              dotShadow: '0_0_6px_#a78bfa',
              borderActive: 'border-[#a78bfa]',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              tools: [
                { name: 'Notion', desc: 'AI-powered knowledge management, project tracking & docs', badge: 'PKM' },
                { name: 'Canva', desc: 'AI-assisted design for dashboards, reports & presentations', badge: 'Design' },
                { name: 'Adobe Photoshop', desc: 'Professional image editing & visual asset creation', badge: 'Adobe' },
                { name: 'Adobe Firefly', desc: 'Generative AI image creation & creative content automation', badge: 'GenAI' },
              ]
            },
          ];

          const active = aiCategories[activeAiTab];

          return (
            <div className="max-w-3xl mx-auto">
              {/* Tab Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {aiCategories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveAiTab(i)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border ${
                      activeAiTab === i
                        ? 'text-white shadow-lg scale-105'
                        : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                    style={activeAiTab === i ? {
                      background: `linear-gradient(135deg, ${cat.color}cc, ${cat.color})`,
                      borderColor: cat.color,
                      boxShadow: `0 0 20px ${cat.color}55`
                    } : {}}
                  >
                    <span style={activeAiTab === i ? { color: 'white' } : { color: cat.color }}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Active Tab Content */}
              <HexGridCard
                isDark={dark}
                key={activeAiTab}
                className="rounded-2xl border transition-all duration-300"
                style={{ borderColor: `${active.color}40` }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-lg" style={{ background: `${active.color}20`, border: `1px solid ${active.color}40` }}>
                      <span style={{ color: active.color }}>{active.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold" style={{ color: active.color }}>{active.label}</h3>
                    <span className="ml-auto text-xs font-bold text-slate-400 mono">{active.tools.length} tools</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {active.tools.map((tool, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 ${active.bgLight} ${active.bgDark} transition-colors`}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: active.color, boxShadow: `0 0 6px ${active.color}` }} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{tool.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active.badgeBg} border ${active.badgeBorder}`} style={{ color: active.color }}>{tool.badge}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tool.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HexGridCard>
            </div>
          );
        })()}
      </section>


      {/* Certifications & Achievements */}

      <section id="certifications" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="mono text-[#ff1493] text-sm mb-2">// Continuous Learning</div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Certifications & Achievements</h2>
          <p className="text-slate-800 dark:text-slate-400 text-lg leading-relaxed px-4 md:px-12 text-justify md:text-center">
            I believe in lifelong learning — because the mind, like any muscle, evolves and strengthens with consistent effort. Through continuous exploration of data, tools, and emerging technologies, curiosity transforms into meaningful insights, driving growth, innovation, and real-world impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Oracle Cloud Infrastructure Certified Data Science Professional',
              issuer: 'Oracle Learning',
              period: 'Nov 2025 – Nov 2027',
              skills: ['OCI', 'Machine Learning', 'Model Deployment', 'AutoML'],
              link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6DEDAD566435634C9732610078A0BA14BB779CE71FB3B31FF44B09C321E4B35C'
            },
            {
              title: 'Oracle Data Platform Certified Foundations Associate',
              issuer: 'Oracle Learning',
              period: 'Oct 2025 - Oct 2027',
              skills: ['Cloud Data', 'Data Warehousing', 'Oracle Analytics'],
              link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6DEDAD566435634C9732610078A0BA14F19D2E89DFF1FBB03C6F31B765090CC7'
            },
            {
              title: 'Microsoft Power BI Data Analyst Professional Certificate',
              issuer: 'Coursera, Microsoft',
              period: 'Mar 2024 – Oct 2024',
              skills: ['Power BI', 'DAX', 'Data Modeling', 'Power Query'],
              link: 'https://www.coursera.org/account/accomplishments/professional-cert/MPN6DUW07SPF'
            },
            {
              title: 'Google Data Analytics Professional Certificate',
              issuer: 'Google (2023)',
              period: 'Sep 2022 – Sep 2023',
              skills: ['SQL', 'Tableau', 'R Programming', 'Data Cleaning'],
              link: 'https://www.credly.com/badges/12d217ef-371f-4aa7-ab5f-b1453dbf0e45/linked_in_profile'
            },
            {
              title: 'Generative AI for Business Intelligence (BI) Analysts',
              issuer: 'SkillUp EdTech (2025)',
              period: 'Jan 2025 – Mar 2025',
              skills: ['GenAI', 'Prompt Engineering', 'BI Strategy'],
              link: 'https://www.coursera.org/account/accomplishments/specialization/certificate/5UWTG1BH5HBB'
            },
            {
              title: 'Generative AI for Data Scientists',
              issuer: 'IBM, Coursera (2025)',
              period: 'Sep 2024 – Dec 2024',
              skills: ['LLMs', 'LangChain', 'AI Development'],
              link: 'https://www.coursera.org/account/accomplishments/verify/2ZHC0E3DT17M'
            },
            {
              title: 'Introduction to MongoDB',
              issuer: 'MongoDB, Inc (2025)',
              period: 'Mar 2025 – Apr 2025',
              skills: ['NoSQL', 'Document Databases', 'Aggregation'],
              link: 'https://www.coursera.org/account/accomplishments/verify/64OBEYY4E1BO'
            },
            {
              title: 'IBM Applied Data Science Certificate',
              issuer: 'IBM (2023)',
              period: 'Aug 2022 – Jan 2023',
              skills: ['Python', 'Data Analysis', 'Scikit-Learn'],
              link: 'https://www.coursera.org/account/accomplishments/verify/KUG9KCFWU5CR'
            },
            {
              title: 'Relational Database & Design Certification',
              issuer: 'University of Colorado Boulder (2024)',
              period: 'Oct 2024 – Dec 2024',
              skills: ['SQL', 'Database Normalization', 'ER Modeling'],
              link: '#'
            },
            {
              title: 'Python for Everybody Specialization with Honours',
              issuer: 'University of Michigan (2022)',
              period: 'July 2022 – Mar 2023',
              skills: ['Python', 'Data Structures', 'Web Scraping'],
              link: 'https://www.coursera.org/account/accomplishments/verify/CXEVVGTE2ERM'
            }
          ].slice(0, showFullCerts ? undefined : 4).map((cert, idx) => (
            <EvervaultCard key={idx}>
              <div className="group p-6 flex flex-col justify-between min-h-[200px]">
                <div>
                  <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 group-hover:text-[#ff1493] transition-colors pr-4">{cert.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {cert.skills?.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200/80 bg-slate-100 dark:border-slate-600/50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 group-hover:border-[#ff1493]/30 group-hover:text-[#ff1493]/80 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto pt-4 border-t border-slate-200/80 dark:border-slate-700/50">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mono">{cert.issuer}</p>
                  <div className="flex items-center gap-2">
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-white bg-pink-gradient px-3 py-1.5 rounded-full hover:scale-105 transition-transform shadow-sm whitespace-nowrap">
                        Verify ↗
                      </a>
                    )}
                    <span className="text-xs font-bold text-[#ff1493] bg-pink-500/10 px-3 py-1.5 rounded-full whitespace-nowrap border border-pink-500/20 shadow-sm">
                      {cert.period}
                    </span>
                  </div>
                </div>
              </div>
            </EvervaultCard>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowFullCerts(!showFullCerts)}
            className="group flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[#06b6d4] border border-[#06b6d4]/30 hover:border-[#ff1493]/50 hover:text-[#ff1493] transition-all bg-cyan-900/10 hover:bg-pink-900/10 dark:bg-cyan-900/20 dark:hover:bg-pink-900/20 shadow-sm"
          >
            {showFullCerts ? 'Show Less' : 'View Full Certifications'}
            <ArrowRight size={18} className={`transition-transform duration-300 ${showFullCerts ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
          </button>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#1e2530]/60 backdrop-blur-xl border border-slate-700/50 p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/40 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10 tracking-tight">Ready to Scale?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10 text-lg">Available for freelance opportunities and full-time data positions. Let's solve some data challenges together.</p>

          <div className="flex items-center justify-center gap-2 text-slate-400 mb-10 relative z-10 font-medium">
            <MapPin size={18} className="text-[#06b6d4]" />
            <span>Bengaluru, India</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=irahuladhikari@gmail.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition-all shadow-lg text-sm border border-slate-600">
              <Mail size={18} /> Email
            </a>
            <a href="https://wa.me/917737006542" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] px-8 py-4 rounded-lg font-bold hover:scale-105 transition-all shadow-lg text-sm border border-[#25D366]/50">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <div className="flex items-center gap-4">
              <a href="https://linkedin.com/in/irahuladhikari" target="_blank" rel="noreferrer" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm transition-colors border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/ursrahuladhikari" target="_blank" rel="noreferrer" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm transition-colors border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="text-lg font-black text-gradient">RA.TECH</div>
            <p className="text-sm font-medium text-slate-500">© {new Date().getFullYear()} Rahul Adhikari</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono tracking-wider">
            <span>BUILT WITH CODE &</span>
            <div className="w-2 h-2 rounded-full bg-[#ff1493] pink-glow animate-pulse" />
          </div>
        </div>
      </footer>

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
