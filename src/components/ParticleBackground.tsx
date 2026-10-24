import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  color?: string;
  theme?: 'dark' | 'light';
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  color = '#007AFF',
  theme = 'dark'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 140
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    const numParticles = Math.min(65, Math.floor(width / 22));
    const particles: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < numParticles; i++) {
      const size = Math.random() * 3 + 1.2;
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size,
        density: Math.random() * 25 + 2,
        opacity: Math.random() * 0.35 + 0.15
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * p.density;
            const directionY = forceDirectionY * force * p.density;

            p.x -= directionX;
            p.y -= directionY;
          } else {
            if (p.x !== p.baseX) {
              p.x -= (p.x - p.baseX) / 20;
            }
            if (p.y !== p.baseY) {
              p.y -= (p.y - p.baseY) / 20;
            }
          }
        } else {
          if (p.x !== p.baseX) {
            p.x -= (p.x - p.baseX) / 25;
          }
          if (p.y !== p.baseY) {
            p.y -= (p.y - p.baseY) / 25;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = theme === 'dark' ? p.opacity : p.opacity * 0.7;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
