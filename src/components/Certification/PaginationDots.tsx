import React from 'react';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
  onChange: (index: number) => void;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  total,
  activeIndex,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onChange(idx)}
          className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
            idx === activeIndex
              ? 'bg-[#ff1493] w-6 shadow-[0_0_10px_#ff1493]'
              : 'bg-slate-700/60 hover:bg-slate-500 w-2.5'
          }`}
          aria-label={`Go to certification ${idx + 1}`}
        />
      ))}
    </div>
  );
};
