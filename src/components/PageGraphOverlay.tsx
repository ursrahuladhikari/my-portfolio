import React, { useEffect, useRef, useState } from 'react';

interface PageGraphOverlayProps {
  dark: boolean;
}

export const PageGraphOverlay: React.FC<PageGraphOverlayProps> = ({ dark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const [scrollY, setScrollY] = useState(0);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    // Monitor scroll position
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      // Only render grid after scrolling past the hero section (approx 400px)
      setShowGrid(currentScroll > 350);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!showGrid) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const gridSpacing = 48; // Square grid size in pixels

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mouseRef.current.active;

      // Get 3D section elements in viewport space
      const certsEl = document.getElementById('certifications');
      const aiEl = document.getElementById('ai-tools');
      const certsRect = certsEl?.getBoundingClientRect();
      const aiRect = aiEl?.getBoundingClientRect();

      // Establish vertical bands where 3D elements exist
      const bands: { top: number; bottom: number }[] = [];
      const padding = 15; // padding above and below to clear grid lines completely
      if (certsRect) {
        bands.push({ top: certsRect.top - padding, bottom: certsRect.bottom + padding });
      }
      if (aiRect) {
        bands.push({ top: aiRect.top - padding, bottom: aiRect.bottom + padding });
      }

      // Check if a Y coordinate falls within any 3D section band
      const isYIn3DBand = (y: number) => {
        return bands.some(b => y >= b.top && y <= b.bottom);
      };

      // Color palette based on theme
      const baseGridColor = dark 
        ? 'rgba(51, 65, 85, 0.04)' // Slate 700 very faint
        : 'rgba(203, 213, 225, 0.12)'; // Slate 300 very faint

      const scrollOffset = window.scrollY;
      const startY = -(scrollOffset % gridSpacing);
      const startX = 0;

      // 1. Draw static background grid (horizontal lines)
      for (let y = startY; y < canvas.height; y += gridSpacing) {
        // If the horizontal line is inside a 3D band, don't draw it at all (skip it)
        if (isYIn3DBand(y)) continue;
        
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = baseGridColor;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 1. Draw static background grid (vertical lines, breaking them where they cross 3D bands)
      const sortedBands = [...bands].sort((a, b) => a.top - b.top);
      for (let x = startX; x < canvas.width; x += gridSpacing) {
        let currentY = 0;
        
        for (const band of sortedBands) {
          if (band.top > currentY) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = baseGridColor;
            ctx.moveTo(x, currentY);
            ctx.lineTo(x, Math.min(canvas.height, band.top));
            ctx.stroke();
          }
          currentY = Math.max(currentY, band.bottom);
        }
        if (currentY < canvas.height) {
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = baseGridColor;
          ctx.moveTo(x, currentY);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
      }

      // 2. Draw hover-responsive glow grid lines (only if mouse is not over 3D sections)
      if (mouseActive) {
        const isMouseIn3DBand = bands.some(b => my >= b.top && my <= b.bottom);

        if (!isMouseIn3DBand) {
          ctx.lineWidth = 1.2;

          // Glowing radial gradient centered at mouse
          const glowRadius = 240;
          const glow = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
          if (dark) {
            glow.addColorStop(0, 'rgba(6, 182, 212, 0.22)'); // Cyan glow
            glow.addColorStop(0.4, 'rgba(167, 139, 250, 0.08)'); // Purple glow
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            glow.addColorStop(0, 'rgba(255, 20, 147, 0.18)'); // Pink glow
            glow.addColorStop(0.5, 'rgba(6, 182, 212, 0.06)'); // Cyan glow
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }
          ctx.strokeStyle = glow;

          // Draw only lines in proximity to speed up rendering
          const minX = Math.floor((mx - glowRadius) / gridSpacing) * gridSpacing;
          const maxX = Math.ceil((mx + glowRadius) / gridSpacing) * gridSpacing;
          const minY = Math.floor((my - glowRadius - startY) / gridSpacing) * gridSpacing + startY;
          const maxY = Math.ceil((my + glowRadius - startY) / gridSpacing) * gridSpacing + startY;

          // Proximity vertical lines (broken/faded around 3D bands)
          for (let x = Math.max(0, minX); x <= Math.min(canvas.width, maxX); x += gridSpacing) {
            const startLineY = Math.max(0, my - glowRadius);
            const endLineY = Math.min(canvas.height, my + glowRadius);
            let currentY = startLineY;
            
            for (const band of sortedBands) {
              if (band.top > currentY) {
                ctx.beginPath();
                ctx.moveTo(x, currentY);
                ctx.lineTo(x, Math.min(endLineY, band.top));
                ctx.stroke();
              }
              currentY = Math.max(currentY, band.bottom);
            }
            if (currentY < endLineY) {
              ctx.beginPath();
              ctx.moveTo(x, currentY);
              ctx.lineTo(x, endLineY);
              ctx.stroke();
            }
          }

          // Proximity horizontal lines (skipped inside 3D bands)
          for (let y = Math.max(startY, minY); y <= Math.min(canvas.height, maxY); y += gridSpacing) {
            if (isYIn3DBand(y)) continue;
            ctx.beginPath();
            ctx.moveTo(Math.max(0, mx - glowRadius), y);
            ctx.lineTo(Math.min(canvas.width, mx + glowRadius), y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showGrid, dark]);

  if (!showGrid || !dark) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none z-0"
      style={{ mixBlendMode: dark ? 'screen' : 'multiply' }}
    />
  );
};
