'use client';
import { useEffect, useRef, useState } from 'react';

const ELEMENTS = [
  { name: 'هيدروجين', symbol: 'H', protons: 1, neutrons: 0, electrons: [1], color: '#60a5fa' },
  { name: 'هيليوم', symbol: 'He', protons: 2, neutrons: 2, electrons: [2], color: '#34d399' },
  { name: 'ليثيوم', symbol: 'Li', protons: 3, neutrons: 4, electrons: [2, 1], color: '#f87171' },
  { name: 'كربون', symbol: 'C', protons: 6, neutrons: 6, electrons: [2, 4], color: '#fbbf24' },
  { name: 'أكسجين', symbol: 'O', protons: 8, neutrons: 8, electrons: [2, 6], color: '#a78bfa' },
  { name: 'صوديوم', symbol: 'Na', protons: 11, neutrons: 12, electrons: [2, 8, 1], color: '#f472b6' },
];

export default function AtomSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef<number[]>([]);
  const [elementIdx, setElementIdx] = useState(0);
  const el = ELEMENTS[elementIdx];

  useEffect(() => {
    angleRef.current = el.electrons.map(() => Math.random() * Math.PI * 2);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const CW = 500, CH = 400;
    const cx = CW / 2, cy = CH / 2;

    const orbits = el.electrons.map((_, i) => 60 + i * 55);
    const speeds = orbits.map((r) => 0.008 + 0.006 / (orbits.indexOf(r) + 1));
    const electronAngles: number[][] = el.electrons.map((count) =>
      Array.from({ length: count }, (_, j) => (j * Math.PI * 2) / count)
    );

    const animate = () => {
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = '#0a0f1e';
      ctx.fillRect(0, 0, CW, CH);

      // Draw orbits
      orbits.forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = el.color + '30';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw nucleus glow
      const nGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36);
      nGlow.addColorStop(0, el.color + 'cc');
      nGlow.addColorStop(0.5, el.color + '44');
      nGlow.addColorStop(1, el.color + '00');
      ctx.beginPath();
      ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.fillStyle = nGlow;
      ctx.fill();

      // Nucleus
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = el.color;
      ctx.fill();

      // Nucleus label
      ctx.fillStyle = '#0a0f1e';
      ctx.font = 'bold 14px serif';
      ctx.textAlign = 'center';
      ctx.fillText(el.symbol, cx, cy + 5);

      // Proton/neutron count
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px serif';
      ctx.fillText(`${el.protons}p  ${el.neutrons}n`, cx, cy + 55);

      // Update and draw electrons
      electronAngles.forEach((angles, shellIdx) => {
        angleRef.current[shellIdx] = (angleRef.current[shellIdx] || 0) + speeds[shellIdx];
        const r = orbits[shellIdx];

        angles.forEach((baseAngle) => {
          const a = baseAngle + angleRef.current[shellIdx];
          const ex = cx + r * Math.cos(a);
          const ey = cy + r * Math.sin(a);

          // Electron glow
          const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 12);
          eg.addColorStop(0, el.color + 'aa');
          eg.addColorStop(1, el.color + '00');
          ctx.beginPath();
          ctx.arc(ex, ey, 12, 0, Math.PI * 2);
          ctx.fillStyle = eg;
          ctx.fill();

          // Electron dot
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#e2e8f0';
          ctx.fill();
        });
      });

      // Shell labels
      orbits.forEach((r, i) => {
        ctx.fillStyle = el.color + '88';
        ctx.font = 'bold 11px serif';
        ctx.textAlign = 'right';
        ctx.fillText(`مستوى ${i + 1} (${el.electrons[i]} e⁻)`, cx - r - 8, cy - 4);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [el]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
        نموذج الذرة
      </h2>

      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        className="rounded-xl w-full max-w-[500px]"
      />

      {/* Element selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {ELEMENTS.map((e, i) => (
          <button
            key={i}
            onClick={() => setElementIdx(i)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              elementIdx === i
                ? 'text-nawah-900 shadow-lg'
                : 'bg-nawah-800 text-slate-300 border border-nawah-700 hover:border-slate-500'
            }`}
            style={elementIdx === i ? { background: e.color } : {}}
          >
            {e.symbol} – {e.name}
          </button>
        ))}
      </div>

      <div
        className="px-6 py-4 rounded-2xl text-center max-w-md w-full"
        style={{ background: el.color + '12', border: `1px solid ${el.color}33` }}
      >
        <div className="text-xl font-black mb-2" style={{ color: el.color, fontFamily: 'Noto Kufi Arabic, serif' }}>
          {el.name} ({el.symbol})
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-nawah-800/60 rounded-lg p-2">
            <div className="text-slate-400 text-xs mb-1">البروتونات</div>
            <div className="font-black text-white text-lg">{el.protons}</div>
          </div>
          <div className="bg-nawah-800/60 rounded-lg p-2">
            <div className="text-slate-400 text-xs mb-1">النيوترونات</div>
            <div className="font-black text-white text-lg">{el.neutrons}</div>
          </div>
          <div className="bg-nawah-800/60 rounded-lg p-2">
            <div className="text-slate-400 text-xs mb-1">الإلكترونات</div>
            <div className="font-black text-white text-lg">{el.protons}</div>
          </div>
        </div>
        <p className="text-slate-400 text-xs mt-3 leading-relaxed">
          الذرة تتكون من نواة تحتوي بروتونات وموجبة الشحنة ونيوترونات محايدة، وإلكترونات سالبة تدور حولها في مستويات طاقة محددة.
        </p>
      </div>
    </div>
  );
}
