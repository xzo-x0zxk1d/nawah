'use client';
import { useRef, useState, useEffect } from 'react';

const SEGMENTS = [
  { label: 'سؤال سريع', color: '#00c9b1', emoji: '❓' },
  { label: 'تجربة', color: '#a78bfa', emoji: '🔬' },
  { label: 'تلوين', color: '#fbbf24', emoji: '🎨' },
  { label: 'تحدٍّ', color: '#f87171', emoji: '⚡' },
  { label: 'ناقش زميلك', color: '#34d399', emoji: '💬' },
  { label: 'وقت الإبداع', color: '#f472b6', emoji: '✨' },
  { label: 'اشرح للمعلم', color: '#60a5fa', emoji: '📢' },
  { label: 'جائزة', color: '#fb923c', emoji: '🎁' },
];

export default function WheelPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<(typeof SEGMENTS)[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 10;
    const n = SEGMENTS.length;
    const arc = (Math.PI * 2) / n;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Shadow ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fill();

    // Segments
    SEGMENTS.forEach((seg, i) => {
      const start = angle + i * arc;
      const end = start + arc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = '#0a0f1e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0a0f1e';
      ctx.font = 'bold 13px serif';
      ctx.fillText(seg.label, r - 14, 5);
      ctx.font = '16px serif';
      ctx.fillText(seg.emoji, r - 14, -10);
      ctx.restore();
    });

    // Center circle
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#00c9b1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center label
    ctx.fillStyle = '#00c9b1';
    ctx.font = 'bold 11px serif';
    ctx.textAlign = 'center';
    ctx.fillText('نواة', cx, cy + 4);

    // Arrow (pointer at top)
    ctx.save();
    ctx.translate(cx, 0);
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(-12, 40);
    ctx.lineTo(12, 40);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00c9b1';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setShowResult(false);
    setResult(null);

    const targetVelocity = 0.15 + Math.random() * 0.2;
    velocityRef.current = targetVelocity;

    const animate = () => {
      velocityRef.current *= 0.985;
      angleRef.current += velocityRef.current;

      drawWheel(angleRef.current);

      if (velocityRef.current < 0.002) {
        cancelAnimationFrame(rafRef.current);
        setSpinning(false);

        // Determine winner — pointer is at top (angle = -π/2)
        const arc = (Math.PI * 2) / SEGMENTS.length;
        const normalized = (((-angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));
        const idx = Math.floor(normalized / arc) % SEGMENTS.length;
        const winner = SEGMENTS[(SEGMENTS.length - idx) % SEGMENTS.length];
        setResult(winner);
        setShowResult(true);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-nawah-teal/10 border border-nawah-teal/30 rounded-full text-nawah-teal text-sm mb-4">
            🎡 عجلة الأنشطة
          </span>
          <h1 className="text-4xl font-black text-white mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
            أدر العجلة
          </h1>
          <p className="text-slate-400">دوّر العجلة واكتشف نشاطك العشوائي!</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              className="rounded-full cursor-pointer"
              style={{ maxWidth: '100%' }}
              onClick={spin}
            />
          </div>

          {/* Spin button */}
          <button
            onClick={spin}
            disabled={spinning}
            className={`btn-primary text-xl px-12 py-4 rounded-2xl font-black transition-all ${
              spinning ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 shadow-lg shadow-nawah-teal/30'
            }`}
            style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
          >
            {spinning ? '⏳ تدور...' : '🎯 أدر العجلة'}
          </button>

          {/* Result */}
          {showResult && result && (
            <div
              className="w-full rounded-2xl p-8 text-center border-2 animate-[fadeIn_0.4s_ease]"
              style={{ background: result.color + '15', borderColor: result.color }}
            >
              <div className="text-5xl mb-4">{result.emoji}</div>
              <div
                className="text-3xl font-black mb-2"
                style={{ color: result.color, fontFamily: 'Noto Kufi Arabic, serif' }}
              >
                {result.label}
              </div>
              <p className="text-slate-400 text-sm">
                {result.label === 'سؤال سريع' && 'استعد للإجابة على سؤال من المعلم في 30 ثانية!'}
                {result.label === 'تجربة' && 'اذهب إلى المختبر الافتراضي وجرّب إحدى التجارب!'}
                {result.label === 'تلوين' && 'انتقل إلى نشاط تلوين الخلية!'}
                {result.label === 'تحدٍّ' && 'اختر تحديًا من قائمة أنشطة الفصل!'}
                {result.label === 'ناقش زميلك' && 'شارك زميلك ما تعلمته اليوم في دقيقتين!'}
                {result.label === 'وقت الإبداع' && 'ارسم أو اكتب ما تخيّلته عن الدرس!'}
                {result.label === 'اشرح للمعلم' && 'اشرح للمعلم مفهومًا درسته بأسلوبك!'}
                {result.label === 'جائزة' && '🎉 مبروك! أنت تستحق نقطة إضافية!'}
              </p>
            </div>
          )}
        </div>

        {/* Segments reference */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SEGMENTS.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
              style={{ background: s.color + '12', border: `1px solid ${s.color}33`, color: s.color }}
            >
              <span>{s.emoji}</span>
              <span className="font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
