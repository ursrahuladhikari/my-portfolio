import React from 'react';
import { motion } from 'framer-motion';
import type { Certification } from '../../data/certifications';

interface CertificationCardProps {
  cert: Certification;
  isActive: boolean;
  style?: React.CSSProperties;
  onClick: () => void;
  // Rotation/Translation/Filter values animated by parent
  x: string | number;
  y: string | number;
  z: number;
  rotateY: number;
  scale: number;
  opacity: number;
  filter: string;
}

const getIssuerLogo = (logoType: Certification['logoType']) => {
  switch (logoType) {
    case 'google':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      );
    case 'microsoft':
      return (
        <svg viewBox="0 0 23 23" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="10" height="10" fill="#F25022" />
          <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
          <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
          <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
        </svg>
      );
    case 'oracle':
      return (
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0" fill="#F32121" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
        </svg>
      );
    case 'ibm':
      return (
        <svg viewBox="0 0 24 9" className="w-7 h-3.5 shrink-0" fill="#052FAD" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h2.7v.8H0zm0 1.1h2.7v.8H0zm0 1.2h2.7v.8H0zm0 1.2h2.7v.8H0zm0 1.2h2.7v.8H0zm0 1.2h2.7v.8H0zm0 1.2h2.7v.8H0zm0 1.2h2.7v.8H0z M4.1 0h3.5v.8H4.1zm0 1.1h3.5v.8H4.1zm0 1.2h1.1v.8h1.3v-.8H6.5v.8h1.1v-.8H4.1zm0 1.2h1.1v.8h1.3v-.8H6.5v.8h1.1v-.8H4.1zm0 1.2h3.5v.8H4.1zm0 1.2h3.5v.8H4.1zm0 1.2h3.5v.8H4.1zm0 1.2h3.5v.8H4.1z M9 0h2.7v.8H9zm0 1.1h2.7v.8H9zm0 1.2h1.1v.8h.5v-.8h1.1v.8H9zm0 1.2h1.1v.8h.5v-.8h1.1v.8H9zm0 1.2h2.7v.8H9zm0 1.2h2.7v.8H9zm0 1.2h2.7v.8H9zm0 1.2h2.7v.8H9z" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0c-.3 0-.6.1-.8.3C8.4 2.8 4 8.7 4 13.5c0 4.7 3.6 8.5 8 8.5s8-3.8 8-8.5c0-4.8-4.4-10.7-7.2-13.2-.2-.2-.5-.3-.8-.3zm0 2c1.9 2.5 5 7.3 5 11.5 0 3.3-2.2 6-5 6s-5-2.7-5-6c0-4.2 3.1-9 5-11.5z" fill="#00ED64" />
          <path d="M11.5 6h1v12h-1z" fill="#00684A" />
        </svg>
      );
    case 'umich':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3h4.5l3.5 8 3.5-8H18v18h-4V8.5L10.5 16h-1L6 8.5V21H2V3z" fill="#FFCB05" stroke="#00274C" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'ucolorado':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4h6v3H6v4h4v3H6v4h3v3H3V4zm8 0h3v11c0 1.7 1.3 3 3 3s3-1.3 3-3V4h3v11c0 3.3-2.7 6-6 6s-6-2.7-6-6V4z" fill="#CFB87C" />
        </svg>
      );
    case 'skillup':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skillup-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff1493" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path d="M12 2L1 7l11 5 9-4.1V17h2V7L12 2z M4.2 11.2v4.3c0 1.8 3.5 3.5 7.8 3.5s7.8-1.7 7.8-3.5v-4.3L12 14.8l-7.8-3.6z" fill="url(#skillup-card-grad)" />
        </svg>
      );
    default:
      return null;
  }
};

export const CertificationCard: React.FC<CertificationCardProps> = ({
  cert,
  isActive,
  onClick,
  x,
  y,
  z,
  rotateY,
  scale,
  opacity,
  filter,
}) => {
  return (
    <motion.div
      onClick={onClick}
      className={`absolute w-[310px] sm:w-[410px] h-[210px] sm:h-[240px] rounded-[24px] overflow-hidden cursor-pointer select-none transition-shadow duration-500 ${
        isActive
          ? 'shadow-[0_0_50px_rgba(6,182,212,0.25),0_0_20px_rgba(167,139,250,0.15)] z-30'
          : 'shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(167,139,250,0.1)]'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        left: '50%',
        top: '50%',
        WebkitBoxReflect: 'below 6px linear-gradient(transparent 55%, rgba(0, 0, 0, 0.15))',
      }}
      animate={{
        x,
        y,
        z,
        rotateY,
        scale,
        opacity,
        filter,
      }}
      whileHover={
        isActive
          ? {
              y: 'calc(-50% - 10px)',
              scale: 1.03,
              boxShadow: '0 30px 60px rgba(6,182,212,0.4), 0 10px 20px rgba(167,139,250,0.2)',
            }
          : {}
      }
      transition={{
        type: 'spring',
        stiffness: 110,
        damping: 18,
        mass: 0.8,
      }}
    >
      {/* Shine border sweep on active card */}
      {isActive && (
        <motion.div
          className="absolute inset-0 p-[2px] rounded-[24px] pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* Dynamic gradient borders */}
      <div
        className={`absolute inset-0 p-[1px] rounded-[24px] pointer-events-none transition-all duration-700 ${
          isActive
            ? 'bg-gradient-to-br from-cyan-400/40 via-purple-500/20 to-blue-500/40'
            : 'bg-gradient-to-br from-slate-700/20 to-slate-800/10 hover:from-purple-500/20 hover:to-cyan-500/20'
        }`}
      />

      {/* Card Inner Container with Glassmorphism */}
      <div className="absolute inset-[1px] rounded-[23px] bg-[#0b1528]/60 backdrop-blur-md p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
        {/* Soft background glow elements */}
        <div
          className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl transition-all duration-1000 ${
            isActive ? 'bg-cyan-500/15 scale-150' : 'bg-purple-500/5'
          }`}
        />
        <div
          className={`absolute -bottom-12 -left-12 w-24 h-24 rounded-full blur-2xl transition-all duration-1000 ${
            isActive ? 'bg-purple-500/15 scale-150' : 'bg-cyan-500/5'
          }`}
        />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            {/* Header Row (Badge + Logo & Issuer Text) */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-[9px] font-bold text-[#ff1493] bg-[#ff1493]/10 border border-[#ff1493]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {cert.period}
              </span>
              <div className="flex items-center gap-2 max-w-[60%] text-right justify-end">
                {getIssuerLogo(cert.logoType)}
                <span className="text-[10px] font-bold text-slate-300 font-mono truncate">
                  {cert.issuer}
                </span>
              </div>
            </div>

            {/* Certification Title */}
            <h3
              className={`text-sm sm:text-[16px] font-extrabold leading-snug line-clamp-2 mb-3 transition-colors duration-500 ${
                isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-slate-200 group-hover:text-white'
              }`}
            >
              {cert.title}
            </h3>

            {/* Skills Tags (Flat text displaying all keywords) */}
            <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[10px] sm:text-[10.5px] font-medium text-slate-400">
              {cert.skills.map((skill, sIdx) => (
                <span key={sIdx} className="tracking-wide">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Link Row */}
          <div className="relative z-10 flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/40">
            <div
              className={`transition-all duration-500 ease-out ${
                isActive ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
              }`}
            >
              {cert.link && cert.link !== '#' && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-5 py-2 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.3)] whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  Verify Credential ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
