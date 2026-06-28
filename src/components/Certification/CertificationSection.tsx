import React from 'react';
import { ConstellationBackground } from './ConstellationBackground';
import { CertificationCarousel } from './CertificationCarousel';

export const CertificationSection: React.FC = () => {
  return (
    <section
      id="certifications"
      className="relative w-full pt-10 pb-20 sm:pt-12 sm:pb-28 overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center border-y border-slate-200 dark:border-slate-800/60"
    >
      {/* Cinematic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] pointer-events-none z-0" />

      {/* Futuristic soft glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none z-0" />

      {/* Constellation Particle Background Canvas */}
      <ConstellationBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Header Elements */}
        <div className="text-center mb-5 sm:mb-6 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ff1493]/30 bg-[#ff1493]/5 text-[#ff1493] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(255,20,147,0.15)]">
            // continuous growth
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Certifications &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">Achievements</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-[15.5px] leading-relaxed px-4 md:px-6 text-center max-w-[1150px]">
            Lifelong learning is not a milestone, it's a process. Through rigorous training, hands-on labs, and formal certifications across cloud environments, business intelligence, database design, and machine learning, I continuously sharpen my skills to deliver state-of-the-art results.
          </p>
        </div>

        {/* 3D IMAX Coverflow Carousel Component */}
        <CertificationCarousel />
      </div>
    </section>
  );
};
