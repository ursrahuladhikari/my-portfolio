import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { certificationsData } from '../../data/certifications';
import { CertificationCard } from './CertificationCard';
import { CarouselControls } from './CarouselControls';
import { PaginationDots } from './PaginationDots';

type DomainType = 'all' | 'ds-ai' | 'analytics-bi' | 'database-cloud' | 'programming';

export const CertificationCarousel: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<DomainType>('all');
  
  // Filter certifications based on selected domain tab
  const filteredCerts = selectedDomain === 'all'
    ? certificationsData
    : certificationsData.filter(c => c.domain === selectedDomain);

  // Start centered on the middle card of the active list
  const [certIdx, setCertIdx] = useState(3);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  // Set up mouse/touch drag tracker
  const dragX = useMotionValue(0);
  const lastWheelTime = useRef(0);

  // Recenter carousel when switching tabs
  useEffect(() => {
    setCertIdx(Math.floor(filteredCerts.length / 2));
  }, [selectedDomain, filteredCerts.length]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const nextSlide = () => {
    setCertIdx(prev => (prev < filteredCerts.length - 1 ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCertIdx(prev => (prev > 0 ? prev - 1 : filteredCerts.length - 1));
  };

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certIdx, filteredCerts.length]);

  // Wheel and Trackpad Scrolling Support
  const handleWheel = (e: React.WheelEvent) => {
    if (filteredCerts.length <= 1) return;
    const now = Date.now();
    // Debounce wheel scroll to prevent wild card skipping (400ms buffer)
    if (now - lastWheelTime.current < 400) return;

    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 20) {
      lastWheelTime.current = now;
      if (e.deltaX > 20 || e.deltaY > 20) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const handleDragEnd = (_event: any, info: any) => {
    if (filteredCerts.length <= 1) return;
    const swipeThreshold = 40;
    const swipeOffset = info.offset.x;

    if (swipeOffset < -swipeThreshold) {
      if (certIdx < filteredCerts.length - 1) {
        setCertIdx(prev => prev + 1);
      } else {
        setCertIdx(0);
      }
    } else if (swipeOffset > swipeThreshold) {
      if (certIdx > 0) {
        setCertIdx(prev => prev - 1);
      } else {
        setCertIdx(filteredCerts.length - 1);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none overflow-visible">
      {/* Category Filter Tab Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5 relative z-20 max-w-5xl mx-auto px-4">
        {[
          { id: 'all', label: 'All' },
          { id: 'ds-ai', label: 'Data Science & AI' },
          { id: 'analytics-bi', label: 'Data Analytics & BI' },
          { id: 'database-cloud', label: 'Database & Cloud' },
          { id: 'programming', label: 'Programming' },
        ].map((tab) => {
          const isSelected = selectedDomain === tab.id;
          const count = tab.id === 'all'
            ? certificationsData.length
            : certificationsData.filter(c => c.domain === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedDomain(tab.id as DomainType)}
              className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer overflow-hidden border ${
                isSelected
                  ? 'text-white border-cyan-500/40 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-mono'
                  : 'text-slate-400 border-slate-800/40 bg-slate-900/20 hover:text-white hover:border-slate-700/60 font-mono'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 pointer-events-none rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.label}
                <span className={`text-[10px] font-mono font-bold transition-colors ${
                  isSelected ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-400'
                }`}>
                  ({count})
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Coverflow Window */}
      <motion.div
        drag={filteredCerts.length > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
        onWheel={handleWheel}
        className="relative h-[260px] sm:h-[340px] w-full flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing z-10"
      >
        {filteredCerts.map((cert, idx) => {
          const isTwoCerts = filteredCerts.length === 2;
          const isOneCert = filteredCerts.length === 1;

          let tx = 0;
          let rotateY = 0;
          let z = 0;
          let scale = 1.0;
          let opacity = 1.0;
          let isActive = idx === certIdx;

          if (isOneCert) {
            isActive = true;
            tx = 0;
            rotateY = 0;
            z = 40;
            scale = 1.05;
            opacity = 1.0;
          } else if (isTwoCerts) {
            isActive = true;
            rotateY = 0;
            z = 0;
            
            if (isMobile) {
              isActive = idx === certIdx;
              if (isActive) {
                tx = 0;
                scale = 1.0;
                opacity = 1.0;
              } else {
                tx = idx === 0 ? -280 : 280;
                scale = 0.85;
                opacity = 0.0;
              }
            } else {
              const offset = isTablet ? 190 : 225;
              tx = idx === 0 ? -offset : offset;
              scale = isTablet ? 0.9 : 1.0;
              opacity = 1.0;
            }
          } else {
            const diff = idx - certIdx;
            const absDiff = Math.abs(diff);
            const dir = diff > 0 ? 1 : -1;

            const isVisible = isDesktop
              ? absDiff <= 3
              : isTablet
              ? absDiff <= 1
              : absDiff === 0;

            if (!isVisible) return null;

            if (isActive) {
              tx = 0;
              rotateY = 0;
              z = 40;
              scale = 1.05;
              opacity = 1.0;
            } else {
              const spacing = isMobile ? 160 : isTablet ? 230 : 300;
              tx = dir * spacing * absDiff;
              rotateY = dir * (absDiff === 1 ? -15 : -22);
              z = absDiff === 1 ? -60 : -130;
              scale = absDiff === 1 ? 0.88 : 0.78;
              opacity = absDiff === 1 ? 0.88 : 0.68;
            }
          }

          const absDiff = Math.abs(idx - certIdx);
          const y = `calc(-50% + ${isTwoCerts && !isMobile ? 0 : absDiff * (isMobile ? 0 : 15)}px)`;
          const filter = isActive || (isTwoCerts && !isMobile) ? 'blur(0px)' : 'blur(1.5px)';

          return (
            <CertificationCard
              key={cert.id}
              cert={cert}
              isActive={isActive}
              onClick={() => {
                if (isTwoCerts && isMobile) {
                  setCertIdx(idx);
                } else if (!isTwoCerts && !isActive) {
                  setCertIdx(idx);
                }
              }}
              x={`calc(-50% + ${tx}px)`}
              y={y}
              z={z}
              rotateY={rotateY}
              scale={scale}
              opacity={opacity}
              filter={filter}
            />
          );
        })}
      </motion.div>

      {/* Navigation Controls (Only show if there are multiple slides to browse) */}
      {filteredCerts.length > 1 && (filteredCerts.length > 2 || isMobile) && (
        <CarouselControls onPrev={prevSlide} onNext={nextSlide}>
          <PaginationDots
            total={filteredCerts.length}
            activeIndex={certIdx}
            onChange={setCertIdx}
          />
        </CarouselControls>
      )}
    </div>
  );
};
