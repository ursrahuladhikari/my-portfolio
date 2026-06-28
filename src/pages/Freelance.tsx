import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  User,
  Mail,
  ArrowLeft,
  Sparkles,
  Database,
  Cpu,
  Globe,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// Zod Validation Schema
const freelanceFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  service: z.string().min(1, 'Please select a service'),
  budgetAmount: z.string().min(1, 'Please enter a budget amount'),
  budgetCurrency: z.string().min(1, 'Please select a currency'),
  description: z.string().min(10, 'Please describe your project in at least 10 characters')
});

type FreelanceFormValues = z.infer<typeof freelanceFormSchema>;

// Fallback Exchange Rates (USD as base)
const fallbackRates: Record<string, number> = {
  USD: 1,
  INR: 83.55,
  NPR: 133.65,
  EUR: 0.93,
  GBP: 0.79,
  AED: 3.67
};

// Currency to Country Code Mapping (for high-quality SVG flag icons)
const currencyCountryCodes: Record<string, string> = {
  USD: 'US',
  INR: 'IN',
  NPR: 'NP',
  EUR: 'EU',
  GBP: 'GB',
  AED: 'AE'
};

// Currency Display Labels
const currencyLabels: Record<string, string> = {
  USD: 'USD',
  INR: 'INR',
  NPR: 'NPR (NRs)',
  EUR: 'EUR',
  GBP: 'GBP',
  AED: 'AED'
};

// ── 3D ANIMATED BACKGROUND GRID COMPONENT ──
interface ThreeDGridBgProps {
  isDark: boolean;
}

const ThreeDGridBg: React.FC<ThreeDGridBgProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let speed = 0.45;
    let offsetZ = 0;
    const gridSpacingZ = 35;

    const draw = () => {
      // Background clear color based on theme
      ctx.fillStyle = isDark ? '#0f172a' : '#fafafa';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse parallax tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const horizon = height * 0.5 + mouseRef.current.y * 60;
      const centerX = width / 2 + mouseRef.current.x * 120;
      
      offsetZ -= speed;
      if (offsetZ <= -gridSpacingZ) {
        offsetZ = 0;
      }

      const focalLength = 280;
      const planeOffset = 160; // 3D height offset for floor/ceiling
      const maxZ = 450;
      const minZ = 8;

      // 3D Perspective Projection helper
      const project = (x3d: number, y3d: number, z3d: number) => {
        const scale = focalLength / (z3d || 1);
        return {
          x: centerX + x3d * scale,
          y: horizon + y3d * scale
        };
      };

      // 1. Draw Longitudinal Lines (depth lines radiating from horizon)
      const numCols = 22;
      const colSpacing = 55;
      
      for (let i = -numCols; i <= numCols; i++) {
        const x3d = i * colSpacing;

        // Floor line projection
        const fNear = project(x3d, planeOffset, minZ);
        const fFar = project(x3d, planeOffset, maxZ);

        // Ceiling line projection
        const cNear = project(x3d, -planeOffset, minZ);
        const cFar = project(x3d, -planeOffset, maxZ);

        ctx.lineWidth = 1;

        // Floor Grid Lines (Cyan glow)
        ctx.strokeStyle = isDark ? 'rgba(6, 182, 212, 0.07)' : 'rgba(6, 182, 212, 0.035)';
        ctx.beginPath();
        ctx.moveTo(fNear.x, fNear.y);
        ctx.lineTo(fFar.x, fFar.y);
        ctx.stroke();

        // Ceiling Grid Lines (Pink glow)
        ctx.strokeStyle = isDark ? 'rgba(255, 20, 147, 0.035)' : 'rgba(255, 20, 147, 0.015)';
        ctx.beginPath();
        ctx.moveTo(cNear.x, cNear.y);
        ctx.lineTo(cFar.x, cFar.y);
        ctx.stroke();
      }

      // 2. Draw Transverse Lines (horizontal grid lines moving forward)
      const numRows = 20;
      for (let i = 0; i < numRows; i++) {
        const z3d = i * gridSpacingZ + offsetZ;
        if (z3d < minZ) continue;

        const scale = focalLength / z3d;
        // Fade out lines near the horizon (far away)
        const opacity = Math.min(1, (z3d - minZ) / 60) * Math.max(0, 1 - z3d / maxZ);

        const leftX = centerX - (numCols * colSpacing) * scale;
        const rightX = centerX + (numCols * colSpacing) * scale;

        // Floor transverse line
        const fy = horizon + planeOffset * scale;
        ctx.strokeStyle = isDark 
          ? `rgba(6, 182, 212, ${opacity * 0.11})` 
          : `rgba(6, 182, 212, ${opacity * 0.05})`;
        ctx.beginPath();
        ctx.moveTo(leftX, fy);
        ctx.lineTo(rightX, fy);
        ctx.stroke();

        // Ceiling transverse line
        const cy = horizon - planeOffset * scale;
        ctx.strokeStyle = isDark 
          ? `rgba(255, 20, 147, ${opacity * 0.06})` 
          : `rgba(255, 20, 147, ${opacity * 0.025})`;
        ctx.beginPath();
        ctx.moveTo(leftX, cy);
        ctx.lineTo(rightX, cy);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// ── SUCCESS CANVAS ANIMATION COMPONENT ──
interface SuccessAnimationProps {
  isDark: boolean;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 350);
    let height = (canvas.height = 200);

    interface Particle {
      x: number;
      y: number;
      angle: number;
      radius: number;
      speed: number;
      color: string;
      size: number;
    }

    const particles: Particle[] = [];
    const colors = ['#06b6d4', '#6366f1', '#ff1493'];

    const createParticle = (): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 110 + Math.random() * 40;
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        angle: angle,
        radius: distance,
        speed: 1.2 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 1.8
      };
    };

    for (let i = 0; i < 40; i++) {
      particles.push(createParticle());
    }

    let ripples: number[] = [];
    let pulseRatio = 0;

    const draw = () => {
      // Clear canvas with a theme-adaptive trailing fade color
      ctx.fillStyle = isDark ? 'rgba(13, 13, 21, 0.12)' : 'rgba(245, 245, 250, 0.12)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Glow aura
      pulseRatio += 0.04;
      const coreRadius = 22 + Math.sin(pulseRatio) * 2;
      
      const gradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius * 1.6);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      gradient.addColorStop(0.4, 'rgba(99, 102, 241, 0.18)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core border
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ripples
      ripples = ripples.map(r => r + 1.8).filter(r => r < 90);
      ripples.forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 20, 147, ${Math.max(0, 1 - r / 90) * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Particles
      particles.forEach((p, index) => {
        p.radius -= p.speed;
        p.angle += 0.035;
        p.x = Math.cos(p.angle) * p.radius;
        p.y = Math.sin(p.angle) * p.radius;

        if (p.radius <= coreRadius) {
          if (Math.random() > 0.7) ripples.push(coreRadius);
          particles[index] = createParticle();
          return;
        }

        // Connection lines
        ctx.beginPath();
        ctx.moveTo(cx + p.x, cy + p.y);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = `rgba(99, 102, 241, ${Math.max(0, 1 - p.radius / 130) * (isDark ? 0.06 : 0.12)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Particle
        ctx.beginPath();
        ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Checkmark
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 1);
      ctx.lineTo(cx - 1.5, cy + 5.5);
      ctx.lineTo(cx + 7.5, cy - 3.5);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className={`w-full flex items-center justify-center relative rounded-2xl overflow-hidden border shadow-inner mb-4 transition-all duration-300 ${
      isDark ? 'bg-[#0a0a12]/60 border-white/5' : 'bg-slate-50 border-slate-200'
    }`} style={{ height: '200px' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ── iOS-STYLE SLIDE TO SEND BUTTON ──
interface SlideToSendProps {
  onSlideComplete: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  isDark: boolean;
}

const SlideToSend: React.FC<SlideToSendProps> = ({ onSlideComplete, isSubmitting, isSuccess, isDark }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragX, setDragX] = useState(0);       // kept in sync for progress calc only
  const [isDragging, setIsDragging] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const thumbControls = useAnimation();          // Framer Motion controls all x movement
  const thumbSize = 46;
  const pad = 5;

  const getMaxX = () => (trackRef.current?.clientWidth ?? 320) - thumbSize - pad * 2;

  // ── Apple-smooth reset when validation fails ──
  useEffect(() => {
    if (isLocked && !isSubmitting && !isSuccess) {
      const t = setTimeout(async () => {
        // Phase 1: spring back to start with Apple UIKit physics
        await thumbControls.start({
          x: 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 26,
            mass: 0.85,
          }
        });
        // Phase 2: reset state only after animation completes
        setIsLocked(false);
        setDragX(0);
      }, 500);   // brief pause at end before snap-back
      return () => clearTimeout(t);
    }
  }, [isLocked, isSubmitting, isSuccess]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked || isSubmitting) return;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isLocked || isSubmitting) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const raw = e.clientX - rect.left - thumbSize / 2 - pad;
    const maxX = getMaxX();
    const clamped = Math.max(0, Math.min(raw, maxX));
    // Instant position during active drag — no spring
    thumbControls.set({ x: clamped });
    setDragX(clamped);

    if (clamped >= maxX * 0.85) {
      thumbControls.set({ x: maxX });
      setDragX(maxX);
      setIsLocked(true);
      setIsDragging(false);
      setTimeout(() => onSlideComplete(), 180);
    }
  };

  const handlePointerUp = () => {
    if (isLocked || isSubmitting) return;
    setIsDragging(false);
    setDragX(0);
    // Apple-smooth spring snap-back on release
    thumbControls.start({
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 420,
        damping: 32,
        mass: 0.7,
      }
    });
  };

  const progress = dragX / Math.max(1, getMaxX());
  const textOpacity = Math.max(0, 1 - progress * 2.8);

  return (
    <div
      ref={trackRef}
      className="relative w-full select-none overflow-hidden"
      style={{
        height: '58px',
        borderRadius: '999px',
        background: isDark
          ? 'linear-gradient(180deg, #1c2a4a 0%, #162038 100%)'
          : 'linear-gradient(180deg, #dde4ed 0%, #ccd4df 100%)',
        boxShadow: isDark
          ? 'inset 0 2px 6px rgba(0,0,0,0.55), inset 0 -1px 2px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.4)'
          : 'inset 0 2px 5px rgba(0,0,0,0.08), inset 0 -1px 2px rgba(255,255,255,0.7), 0 1px 4px rgba(0,0,0,0.06)',
        border: isDark
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid rgba(0,0,0,0.08)',
        transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* "Slide To Send" text — centered, shimmer animation, fades as thumb moves */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: textOpacity,
          transition: 'opacity 0.25s ease',
        }}
      >
        <span
          className={isDark ? 'slide-shimmer-dark' : 'slide-shimmer-light'}
          style={{
            fontSize: '15px',
            letterSpacing: '0.08em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            fontWeight: 300,
            animationPlayState: isSubmitting ? 'paused' : 'running',
          }}
        >
          {isSubmitting ? 'Sending…' : 'Slide To Send'}
        </span>
      </div>

      {/* White glassy circle thumb — all motion via Framer controls */}
      <motion.div
        className="absolute flex items-center justify-center z-10 touch-none"
        animate={thumbControls}
        style={{
          top: pad,
          left: pad,
          width: thumbSize,
          height: thumbSize,
          borderRadius: '50%',
          background: isLocked && isSuccess
            ? 'linear-gradient(145deg, #d1fae5 0%, #a7f3d0 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #d8dfe8 100%)',
          boxShadow: isDragging
            ? isDark
              ? '0 4px 18px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3)'
              : '0 4px 18px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)'
            : isLocked && isSuccess
              ? '0 3px 12px rgba(16,185,129,0.4)'
              : isDark
                ? '0 3px 12px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25)'
                : '0 3px 10px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)',
          cursor: isLocked || isSubmitting ? 'default' : 'grab',
          // Only non-motion properties transition via CSS
          transition: 'box-shadow 0.25s ease, background 0.35s ease',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {isSubmitting ? (
          <div
            className="rounded-full animate-spin"
            style={{
              width: 18, height: 18,
              border: '2.5px solid rgba(100,116,139,0.25)',
              borderTopColor: '#64748b',
            }}
          />
        ) : isLocked && isSuccess ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4.5 10.5L8.5 14.5L15.5 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          // Double forward chevron
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M2 2L8 8L2 14" stroke={isDark ? '#6b7fa3' : '#8494a7'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 2L16 8L10 14" stroke={isDark ? '#8fa3be' : '#a0b0c0'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </motion.div>
    </div>
  );
};

// ── MAIN FREELANCE PAGE COMPONENT ──
interface FreelanceProps {
  isDark: boolean;
  onBackToHome: () => void;
}

export const Freelance: React.FC<FreelanceProps> = ({ isDark, onBackToHome }) => {
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Custom dropdown state
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  
  // Live exchange rates state (initialized with fallback rates)
  const [rates, setRates] = useState<Record<string, number>>(fallbackRates);

  // Fetch live exchange rates on mount
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          // Filter rates to only include our supported currencies
          const filteredRates: Record<string, number> = {};
          Object.keys(fallbackRates).forEach(cur => {
            filteredRates[cur] = data.rates[cur] || fallbackRates[cur];
          });
          setRates(filteredRates);
        }
      })
      .catch(err => {
        console.warn("Failed to fetch live exchange rates, using fallback rates:", err);
      });
  }, []);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FreelanceFormValues>({
    resolver: zodResolver(freelanceFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      service: '',
      budgetAmount: '',
      budgetCurrency: 'USD',
      description: ''
    }
  });

  const budgetAmount = watch('budgetAmount');
  const budgetCurrency = watch('budgetCurrency');

  // Real-time INR conversion calculator
  const getConvertedINR = () => {
    const amt = parseFloat(budgetAmount);
    if (isNaN(amt) || amt <= 0) return null;
    if (!rates[budgetCurrency] || !rates['INR']) return null;
    
    // Formula: Amount * (USD_to_INR_rate / USD_to_SelectedCurrency_rate)
    const inrVal = amt * (rates['INR'] / rates[budgetCurrency]);
    return inrVal.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR'
    });
  };

  const inrValue = getConvertedINR();

  const onSubmit = async (data: FreelanceFormValues) => {
    setIsSubmitting(true);
    
    // Calculate final INR value for submission schema
    const amt = parseFloat(data.budgetAmount);
    let finalInr = '';
    if (!isNaN(amt) && rates[data.budgetCurrency] && rates['INR']) {
      const calculated = amt * (rates['INR'] / rates[data.budgetCurrency]);
      finalInr = calculated.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
      });
    }

    const submissionData = {
      ...data,
      budgetINR: finalInr,
      rateSource: rates === fallbackRates ? 'fallback' : 'live_api'
    };

    try {
      // Timeout guard — Firestore hangs silently if database doesn't exist
      const firestoreWrite = addDoc(collection(db, 'freelance-inquiries'), {
        ...submissionData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out — check Firestore setup')), 15000)
      );
      await Promise.race([firestoreWrite, timeout]);
      setSubmittedData(submissionData);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setIsSubmitting(false);
      // isSuccess remains false → triggers the spring-reset animation
    }
  };

  // Framer Motion Animation Variants for Staggered Entrance
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const }
    }
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-350 overflow-hidden relative flex flex-col justify-between font-sans ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* 3D Animated Background Grid Tunnel */}
      <ThreeDGridBg isDark={isDark} />

      {/* Background Decorative Glows */}
      <div className={`absolute top-1/4 left-1/4 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none transition-opacity duration-500 z-10 ${
        isDark ? 'bg-cyan-500/5 opacity-100' : 'bg-cyan-500/3 opacity-40'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none transition-opacity duration-500 z-10 ${
        isDark ? 'bg-pink-500/5 opacity-100' : 'bg-pink-500/3 opacity-40'
      }`} />

      {/* Header Back Button */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-24 pb-4 z-10">
        <button
          onClick={onBackToHome}
          className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono transition-all cursor-pointer ${
            isDark 
              ? 'border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-[#ff1493]/30' 
              : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 hover:border-[#ff1493]/30'
          }`}
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          BACK TO PORTFOLIO
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto w-full px-6 flex-1 flex items-center z-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
          
          {/* Left Column: Title, Subtitle, and Core Pillars (Staggered Animation) */}
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col justify-center space-y-8"
          >
            {/* Typography */}
            <div className="space-y-4 text-center lg:text-left">
              <motion.div 
                variants={listItemVariants}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 mb-2 rounded-full border font-mono text-[10px] uppercase tracking-wider ${
                  isDark 
                    ? 'border-cyan-500/30 bg-cyan-950/10 text-[#06b6d4]' 
                    : 'border-cyan-500/20 bg-cyan-500/5 text-[#0891b2]'
                }`}
              >
                <Sparkles size={8} className="animate-pulse" />
                Collaborate
              </motion.div>
              <motion.h1
                variants={listItemVariants}
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r ${
                  isDark 
                    ? 'from-white via-slate-100 to-slate-400' 
                    : 'from-slate-900 via-slate-800 to-slate-600'
                }`}
              >
                Let's Build Something <br />
                <span className="text-gradient font-black">Extraordinary</span>
              </motion.h1>
              <motion.p
                variants={listItemVariants}
                className={`text-sm max-w-md mx-auto lg:mx-0 leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                High-performance data modeling, intelligent scripting automation, and clean web applications tailored to your business goals.
              </motion.p>
            </div>

            {/* Value Pillars */}
            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              {[
                { icon: <Database size={16} className="text-[#06b6d4]" />, title: 'Data & Analytics', desc: 'Power BI, DAX modeling, SQL, BigQuery pipelines.' },
                { icon: <Cpu size={16} className="text-purple-400" />, title: 'Automation & Scripting', desc: 'Python automation, Excel VBA, API integration.' },
                { icon: <Globe size={16} className="text-pink-400" />, title: 'Web & AI Solutions', desc: 'React, Next.js UI, custom RAG, and AI Agent workflows.' }
              ].map((pillar, idx) => (
                <motion.div
                  key={idx}
                  variants={listItemVariants}
                  className="flex items-start gap-3 text-left"
                >
                  <div className={`p-2 rounded-lg mt-0.5 shadow-sm border ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                  }`}>
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{pillar.title}</h4>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{pillar.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Sleek Glassmorphic Form Card */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className={`w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden border transition-all duration-300 ${
                isDark 
                  ? 'bg-[#0b1528]/80 border-white/10 backdrop-blur-md' 
                  : 'bg-white border-slate-200 shadow-slate-200/50'
              }`}
            >
              {/* Colored top gradient border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#06b6d4] via-purple-500 to-[#ff1493]" />
              
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="inquiry-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 mb-2 rounded-full border font-mono text-[10px] uppercase tracking-wider ${
                        isDark 
                          ? 'border-[#ff1493]/30 bg-[#ff1493]/10 text-[#ff1493]' 
                          : 'border-[#ff1493]/20 bg-[#ff1493]/5 text-[#db2777]'
                      }`}>
                        <Sparkles size={8} className="animate-pulse" />
                        Inquiry Portal
                      </div>
                      <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Start a Project</h2>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Briefly outline your needs and I'll get back to you shortly.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input
                            type="text"
                            placeholder="John Doe"
                            {...register('fullName')}
                            className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff1493]/20 transition-all duration-300 ${
                              isDark 
                                ? 'bg-black/40 border-white/10 text-slate-100 placeholder-slate-600 focus:border-[#ff1493]/60' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#ff1493]/60'
                            } ${errors.fullName ? 'border-red-500/50 focus:border-red-500' : ''}`}
                          />
                        </div>
                        {errors.fullName && <span className="text-[10px] text-red-400 font-mono">{errors.fullName.message}</span>}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input
                            type="email"
                            placeholder="johndoe@example.com"
                            {...register('email')}
                            className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff1493]/20 transition-all duration-300 ${
                              isDark 
                                ? 'bg-black/40 border-white/10 text-slate-100 placeholder-slate-600 focus:border-[#ff1493]/60' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#ff1493]/60'
                            } ${errors.email ? 'border-red-500/50 focus:border-red-500' : ''}`}
                          />
                        </div>
                        {errors.email && <span className="text-[10px] text-red-400 font-mono">{errors.email.message}</span>}
                      </div>

                      {/* Service Dropdown */}
                      <div className="flex flex-col gap-1.5">
                        <label className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Required Service</label>
                        <select
                          {...register('service')}
                          className={`w-full border rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff1493]/20 transition-all duration-300 ${
                            isDark 
                              ? 'bg-[#0d0d15] border-white/10 text-slate-300 focus:border-[#ff1493]/60' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-[#ff1493]/60'
                          } ${errors.service ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        >
                          <option value="">Select a service type...</option>
                          <option value="Data & Analytics">Data &amp; Analytics (BI / Power BI / SQL)</option>
                          <option value="Automation & Scripting">Automation &amp; Scripting (Python / Excel VBA)</option>
                          <option value="Web & AI Solutions">Web &amp; AI Solutions (React / Next.js / LLM)</option>
                          <option value="Other">Other Consulting / Custom Request</option>
                        </select>
                        {errors.service && <span className="text-[10px] text-red-400 font-mono">{errors.service.message}</span>}
                      </div>

                      {/* Budget Currency & Amount Inputs */}
                      <div className="flex flex-col gap-1.5">
                        <label className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Estimated Budget</label>
                        <div className="flex gap-2 relative">
                          {/* Custom Currency Selector Button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                              className={`w-24 border rounded-xl py-2.5 px-3 text-xs flex items-center justify-between gap-1.5 focus:outline-none focus:ring-1 focus:ring-[#ff1493]/20 transition-all duration-300 cursor-pointer ${
                                isDark 
                                  ? 'bg-[#0d0d15] border-white/10 text-slate-300 focus:border-[#ff1493]/60' 
                                  : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-[#ff1493]/60'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <img 
                                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${currencyCountryCodes[budgetCurrency]}.svg`} 
                                  className="w-5 h-3.5 object-cover rounded-sm shrink-0 border border-white/10" 
                                  alt={budgetCurrency}
                                />
                                <span>{budgetCurrency}</span>
                              </div>
                              <span className="text-[9px] text-slate-500">▼</span>
                            </button>
                            
                            {/* Custom Currency Dropdown Menu */}
                            <AnimatePresence>
                              {isCurrencyDropdownOpen && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyDropdownOpen(false)} />
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className={`absolute left-0 mt-1.5 w-36 border rounded-xl shadow-2xl z-50 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar ${
                                      isDark ? 'bg-[#0d0d15] border-white/10' : 'bg-white border-slate-200 shadow-slate-100'
                                    }`}
                                  >
                                    {Object.keys(rates).map(cur => (
                                      <button
                                        key={cur}
                                        type="button"
                                        onClick={() => {
                                          setValue('budgetCurrency', cur);
                                          setIsCurrencyDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                                          isDark 
                                            ? 'hover:bg-white/5 text-slate-300' 
                                            : 'hover:bg-slate-50 text-slate-700'
                                        } ${budgetCurrency === cur ? 'text-[#ff1493] font-bold' : ''}`}
                                      >
                                        <img 
                                          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${currencyCountryCodes[cur]}.svg`} 
                                          className="w-5 h-3.5 object-cover rounded-sm shrink-0 border border-white/10" 
                                          alt={cur}
                                        />
                                        <span>{currencyLabels[cur] || cur}</span>
                                      </button>
                                    ))}
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>

                          <input
                            type="number"
                            placeholder="Amount (e.g. 500)"
                            {...register('budgetAmount')}
                            className={`flex-1 border rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff1493]/20 transition-all duration-300 ${
                              isDark 
                                ? 'bg-black/40 border-white/10 text-slate-100 placeholder-slate-600 focus:border-[#ff1493]/60' 
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#ff1493]/60'
                            } ${errors.budgetAmount ? 'border-red-500/50 focus:border-red-500' : ''}`}
                          />
                        </div>
                        {errors.budgetAmount && <span className="text-[10px] text-red-400 font-mono">{errors.budgetAmount.message}</span>}

                        {/* Real-time INR Conversion Output */}
                        <AnimatePresence>
                          {inrValue && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 mt-1.5 pl-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Approx.</span>
                              <img 
                                src="https://purecatamphetamine.github.io/country-flag-icons/3x2/IN.svg" 
                                className="w-4 h-3.0 object-cover rounded-sm mx-0.5 inline-block align-middle border border-emerald-500/20" 
                                alt="INR" 
                              />
                              <span className="font-bold text-emerald-500">{inrValue} INR</span>
                              <span className={`${isDark ? 'text-slate-500' : 'text-slate-400'}`}>(as of today's date)</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Project Description */}
                      <div className="flex flex-col gap-1.5">
                        <label className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Project Brief</label>
                        <textarea
                          rows={3}
                          placeholder="Describe your project goals, timelines, or data sources..."
                          {...register('description')}
                          className={`w-full border rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff1493]/20 transition-all duration-300 resize-none ${
                            isDark 
                              ? 'bg-black/40 border-white/10 text-slate-100 placeholder-slate-600 focus:border-[#ff1493]/60' 
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#ff1493]/60'
                          } ${errors.description ? 'border-red-500/50 focus:border-red-500' : ''}`}
                        />
                        {errors.description && <span className="text-[10px] text-red-400 font-mono">{errors.description.message}</span>}
                      </div>

                      {/* iOS-style Slide to Send */}
                      <SlideToSend
                        isDark={isDark}
                        isSubmitting={isSubmitting}
                        isSuccess={isSuccess}
                        onSlideComplete={handleSubmit(onSubmit)}
                      />
                    </form>
                  </motion.div>
                ) : (
                  /* ── SUCCESS SCREEN ── */
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                    className="text-center py-4 flex flex-col items-center justify-center space-y-4"
                  >
                    <SuccessAnimation isDark={isDark} />

                    <div className="space-y-1.5">
                      <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Inquiry Sent Successfully!</h3>
                      <p className={`text-xs leading-relaxed max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Thank you, <span className="text-gradient font-bold">{submittedData?.fullName}</span>. Your project brief has been securely transmitted. I will follow up via email shortly.
                      </p>
                    </div>

                    <button
                      onClick={onBackToHome}
                      className={`px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform cursor-pointer text-xs w-full sm:w-auto ${
                        isDark ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                    >
                      Return Home
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Custom Styles for Scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes slide-shimmer {
          0%   { background-position: 150% center; }
          100% { background-position: -50% center; }
        }
        .slide-shimmer-dark,
        .slide-shimmer-light {
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: slide-shimmer 2.2s linear infinite;
        }
        .slide-shimmer-dark {
          background-image: linear-gradient(
            90deg,
            rgba(255,255,255,0.35) 0%,
            rgba(255,255,255,0.35) 30%,
            rgba(255,255,255,0.95) 50%,
            rgba(255,255,255,0.35) 70%,
            rgba(255,255,255,0.35) 100%
          );
        }
        .slide-shimmer-light {
          background-image: linear-gradient(
            90deg,
            rgba(60,72,90,0.4) 0%,
            rgba(60,72,90,0.4) 30%,
            rgba(30,40,60,0.95) 50%,
            rgba(60,72,90,0.4) 70%,
            rgba(60,72,90,0.4) 100%
          );
        }
      `}</style>

      {/* Footer */}
      <footer className={`w-full border-t py-6 px-6 z-10 text-center text-[10px] font-mono uppercase tracking-wider ${
        isDark ? 'border-white/5 text-slate-600' : 'border-slate-200 text-slate-400'
      }`}>
        © {new Date().getFullYear()} Rahul Adhikari. All rights reserved.
      </footer>
    </div>
  );
};
