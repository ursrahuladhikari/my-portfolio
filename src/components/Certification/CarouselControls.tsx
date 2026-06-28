import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  children?: React.ReactNode; // Optional dots inserted in the center
}

export const CarouselControls: React.FC<CarouselControlsProps> = ({
  onPrev,
  onNext,
  children,
}) => {
  return (
    <div className="flex items-center justify-center gap-6 mt-8 relative z-20">
      <button
        onClick={onPrev}
        className="p-3 rounded-full bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-cyan-500/30 hover:bg-[#081221] hover:scale-110 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer"
        aria-label="Previous Certification"
      >
        <ChevronLeft size={20} />
      </button>

      {children}

      <button
        onClick={onNext}
        className="p-3 rounded-full bg-slate-900/80 border border-slate-800/60 text-slate-400 hover:text-white hover:border-cyan-500/30 hover:bg-[#081221] hover:scale-110 active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer"
        aria-label="Next Certification"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
