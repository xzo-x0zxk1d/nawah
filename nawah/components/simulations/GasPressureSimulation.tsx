'use client';
import { useEffect, useRef, useState } from 'react';

interface Particle { x: number; y: number; vx: number; vy: number; }

const NUM_PARTICLES = 30;

export default function GasPressureSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [volume, setVolume] = useState(80); // percentage of container width
  const volumeRef = useRef(volume);

  useEffect(() => { volumeRef.current = volume; }, [volume]);

  useEffect(() => {
    particlesRef.current = Array.from({ length: NUM_PARTICLES }, () => ({
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 60,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    }));

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const CW = 500, CH = 360;

    const animate = () => {
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = '#0a0f1e';
      ctx.fillRect(0, 0, CW, CH);

      const v = volumeRef.current;
      const containerW = (v / 100) * 380;
      const left = (CW - containerW) / 2;
      const right = left + containerW;
      const top = 50, bottom = 310;

      // Container
      ctx.strokeStyle = '#00c9b1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left, bottom);
      ctx.lineTo(right, bottom);
      ctx.lineTo(right, top);
      ctx.stroke();

      // Pressure label
      const pressure = Math.round(100 / (v / 100));
      ctx.fillStyle = '#00c9b1';
      ctx.font = 'bold 14px serif';
      ctx.textAlign = 'center';
      ctx.fillText(`الضغط: ${pressure} وحدة`, CW / 2, 35);

      // Volume label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px serif';
      ctx.fillText(`الحجم: ${v}%`, CW / 2, CH - 10);

      // Update + draw particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < left + 6) { p.vx = Math.abs(p.vx); p.x = left + 6; }
        if (p.x > right - 6) { p.vx = -Math.abs(p.vx); p.x = right - 6; }
        if (p.y < top + 6) { p.vy = Math.abs(p.vy); p.y = top + 6; }
        if (p.y > bottom - 6) { p.vy = -Math.abs(p.vy); p.y = bottom - 6; }

        // Glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
        grd.addColorStop(0, '#a78bfa88');
        grd.addColorStop(1, '#a78bfa00');
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#a78bfa';
        ctx.fill();
      });

      // Collision flash lines when volume is small
      if (v < 40) {
        ctx.strokeStyle = '#a78bfa33';
        ctx.lineWidth = 1;
        particlesRef.current.forEach((p, i) => {
          particlesRef.current.slice(i + 1).forEach((q) => {
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 50) {
              ctx.globalAlpha = 1 - d / 50;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          });
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const pressureLevel = Math.round(100 / (volume / 100));

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
        تجربة: ضغط الغاز
      </h2>

      <canvas
        ref={canvasRef}
        width={500}
        height={360}
        className="rounded-xl w-full max-w-[500px]"
      />

      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">حجم الوعاء</span>
          <span className="font-bold text-purple-400">{volume}%</span>
        </div>
        <input
          type="range"
          min={20}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-purple-400"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>صغير (ضغط عالٍ)</span>
          <span>كبير (ضغط منخفض)</span>
        </div>
      </div>

      <div className="px-6 py-3 rounded-2xl text-center max-w-md w-full bg-purple-500/10 border border-purple-400/30">
        <div className="text-xl font-black mb-1 text-purple-400" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
          الضغط: {pressureLevel} وحدة
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          {volume < 40
            ? 'الحجم صغير جداً! الجزيئات متقاربة والضغط مرتفع جداً — قانون بويل: P × V = ثابت'
            : volume < 70
            ? 'حجم متوسط، ضغط معتدل. الجزيئات تتصادم بتكرار معتدل.'
            : 'الحجم كبير، الضغط منخفض. الجزيئات لها مساحة كافية للتحرك بحرية.'}
        </p>
      </div>
    </div>
  );
}
