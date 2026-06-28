import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
}

export const ConstellationBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60;
    const connectionDistance = 120;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Draw and update particles
      particles.forEach((p, idx) => {
        // Apply slight mouse pull (parallax)
        const dx = mouseRef.current.x - canvas.width / 2;
        const dy = mouseRef.current.y - canvas.height / 2;
        
        // Dynamic position offset based on mouse offset (parallax)
        const offsetX = dx * 0.02;
        const offsetY = dy * 0.02;

        let px = p.x + offsetX;
        let py = p.y + offsetY;

        // Wrap around bounds
        if (px < 0) p.x = canvas.width;
        if (px > canvas.width) p.x = 0;
        if (py < 0) p.y = canvas.height;
        if (py > canvas.height) p.y = 0;

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Pulse opacity
        p.alpha += p.pulseSpeed;
        if (p.alpha > 0.8 || p.alpha < 0.2) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`; // Cyan stars
        ctx.fill();

        // Connect lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const px2 = p2.x + offsetX;
          const py2 = p2.y + offsetY;

          const dist = Math.sqrt((px - px2) ** 2 + (py - py2) ** 2);
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px2, py2);
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`; // Purple constellation lines
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 block"
    />
  );
};
