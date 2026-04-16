'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

type State = 'solid' | 'liquid' | 'gas';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

function getState(temp: number): State {
  if (temp < 35) return 'solid';
  if (temp < 70) return 'liquid';
  return 'gas';
}

const STATE_INFO: Record<State, { ar: string; desc: string; color: string }> = {
  solid: { ar: 'صلب', desc: 'الجزيئات متقاربة جداً وتهتز في مكانها فقط. الشكل والحجم ثابتان.', color: '#60a5fa' },
  liquid: { ar: 'سائل', desc: 'الجزيئات متقاربة لكنها تتحرك بحرية. الحجم ثابت لكن الشكل يتغير.', color: '#34d399' },
  gas: { ar: 'غاز', desc: 'الجزيئات متباعدة وتتحرك بسرعة عالية. لا شكل ولا حجم ثابتان.', color: '#f87171' },
};

const NUM_PARTICLES = 40;
const W = 500, H = 320;

function createParticles(state: State): Particle[] {
  const colors = { solid: '#60a5fa', liquid: '#34d399', gas: '#f87171' };
  return Array.from({ length: NUM_PARTICLES }, (_, i) => {
    const col = Math.floor(i % 8), row = Math.floor(i / 8);
    return {
      x: state === 'solid' ? 60 + col * 50 : Math.random() * (W - 40) + 20,
      y: state === 'solid' ? 60 + row * 55 : Math.random() * (H - 40) + 20,
      vx: (Math.random() - 0.5) * (state === 'gas' ? 6 : state === 'liquid' ? 2 : 0.3),
      vy: (Math.random() - 0.5) * (state === 'gas' ? 6 : state === 'liquid' ? 2 : 0.3),
      r: state === 'solid' ? 9 : state === 'liquid' ? 8 : 6,
      color: colors[state],
    };
  });
}

export default function MatterSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [temp, setTemp] = useState(20);
  const state = getState(temp);
  const info = STATE_INFO[state];

  const initParticles = useCallback(() => {
    particlesRef.current = createParticles(state);
  }, [state]);

  useEffect(() => {
    initParticles();
  }, [state, initParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const speedFactor = state === 'gas' ? 1 + temp / 50 : state === 'liquid' ? 0.5 + temp / 100 : 0.05 + temp / 2000;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0a0f1e';
      ctx.fillRect(0, 0, W, H);

      // Container border
      ctx.strokeStyle = info.color + '44';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, W - 4, H - 4);

      // Update + draw particles
      particlesRef.current.forEach((p) => {
        if (state !== 'solid') {
          p.x += p.vx * speedFactor;
          p.y += p.vy * speedFactor;
          if (p.x < p.r || p.x > W - p.r) p.vx *= -1;
          if (p.y < p.r || p.y > H - p.r) p.vy *= -1;
          p.x = Math.max(p.r, Math.min(W - p.r, p.x));
          p.y = Math.max(p.r, Math.min(H - p.r, p.y));
        } else {
          p.x += (Math.random() - 0.5) * 0.5;
          p.y += (Math.random() - 0.5) * 0.5;
        }

        // Glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        grd.addColorStop(0, info.color + 'aa');
        grd.addColorStop(1, info.color + '00');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = info.color;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state, temp, info.color]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
        تجربة: حالات المادة
      </h2>

      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-xl w-full max-w-[500px]"
        style={{ imageRendering: 'crisp-edges' }}
      />

      <div className="w-full max-w-md space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">الحرارة</span>
            <span className="font-bold" style={{ color: info.color }}>{temp}°C</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full accent-nawah-teal"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>بارد</span>
            <span>ساخن</span>
          </div>
        </div>
      </div>

      {/* State badge */}
      <div
        className="px-6 py-3 rounded-2xl text-center max-w-md w-full"
        style={{ background: info.color + '15', border: `1px solid ${info.color}44` }}
      >
        <div className="text-xl font-black mb-1" style={{ color: info.color, fontFamily: 'Noto Kufi Arabic, serif' }}>
          الحالة: {info.ar}
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{info.desc}</p>
      </div>
    </div>
  );
}
