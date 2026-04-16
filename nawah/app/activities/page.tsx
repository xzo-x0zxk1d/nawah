'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, RotateCcw, PlusCircle } from 'lucide-react';

const MCQ_QUESTIONS = [
  {
    q: 'ما هي وحدة بناء الكائنات الحية؟',
    options: ['الذرة', 'الخلية', 'الجزيء', 'النسيج'],
    correct: 1,
    explain: 'الخلية هي الوحدة الأساسية التي تتكون منها جميع الكائنات الحية.',
  },
  {
    q: 'ما الغاز الذي تنتجه النباتات أثناء عملية البناء الضوئي؟',
    options: ['ثاني أكسيد الكربون', 'النيتروجين', 'الأكسجين', 'الهيدروجين'],
    correct: 2,
    explain: 'تنتج النباتات غاز الأكسجين كنتاج ثانوي لعملية البناء الضوئي.',
  },
  {
    q: 'كم عدد كواكب المجموعة الشمسية؟',
    options: ['7', '8', '9', '10'],
    correct: 1,
    explain: 'تحتوي المجموعة الشمسية على 8 كواكب وفق تعريف الاتحاد الفلكي الدولي.',
  },
];

const TF_QUESTIONS = [
  { q: 'القمر كوكب يدور حول الشمس.', answer: false, explain: 'القمر قمر صناعي طبيعي يدور حول الأرض وليس حول الشمس.' },
  { q: 'الماء يتجمد عند درجة صفر مئوية.', answer: true, explain: 'صحيح، الماء النقي يتجمد عند 0°م تحت ضغط جوي قياسي.' },
  { q: 'جميع الكائنات الحية تتكون من خلية واحدة.', answer: false, explain: 'بعض الكائنات وحيدة الخلية مثل الأميبا، لكن معظمها متعدد الخلايا.' },
  { q: 'الضوء يسافر بسرعة أكبر من الصوت.', answer: true, explain: 'سرعة الضوء ≈ 300,000 كم/ثانية، بينما سرعة الصوت ≈ 340 م/ثانية.' },
];

const CELL_PARTS = [
  { id: 'nucleus', label: 'النواة', x: 48, y: 44, color: '#3b82f6', desc: 'مركز التحكم في الخلية' },
  { id: 'membrane', label: 'الغشاء الخلوي', x: 10, y: 76, color: '#10b981', desc: 'يحيط بالخلية ويتحكم في ما يدخل ويخرج' },
  { id: 'mito', label: 'الميتوكوندريا', x: 68, y: 62, color: '#f59e0b', desc: 'مصنع الطاقة في الخلية' },
  { id: 'er', label: 'الشبكة الإندوبلازمية', x: 30, y: 60, color: '#8b5cf6', desc: 'شبكة نقل المواد داخل الخلية' },
  { id: 'vacuole', label: 'الفجوة العصارية', x: 60, y: 30, color: '#ec4899', desc: 'تخزن الماء والمواد الغذائية' },
];

export default function ActivitiesPage() {
  const [mcqTab, setMcqTab] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>(Array(MCQ_QUESTIONS.length).fill(null));
  const [tfAnswers, setTfAnswers] = useState<(boolean | null)[]>(Array(TF_QUESTIONS.length).fill(null));
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [coloredParts, setColoredParts] = useState<Record<string, string>>({});
  const [activeColor, setActiveColor] = useState('#3b82f6');
  const [section, setSection] = useState<'mcq' | 'tf' | 'cell'>('mcq');

  const mcqScore = mcqAnswers.filter((a, i) => a === MCQ_QUESTIONS[i].correct).length;
  const tfScore = tfAnswers.filter((a, i) => a === TF_QUESTIONS[i].answer).length;

  const resetMcq = () => setMcqAnswers(Array(MCQ_QUESTIONS.length).fill(null));
  const resetTf = () => setTfAnswers(Array(TF_QUESTIONS.length).fill(null));

  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm mb-4">
            ⭐ الأنشطة التفاعلية
          </span>
          <h1 className="text-4xl font-black text-white mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
            أنشطتي
          </h1>
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            <Link href="/teacher" className="btn-outline text-sm px-4 py-2 rounded-lg flex items-center gap-2">
              <PlusCircle size={16} />
              إنشاء نشاط جديد
            </Link>
          </div>
        </div>

        {/* Section tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { id: 'mcq', label: 'اختيار من متعدد' },
            { id: 'tf', label: 'صح وخطأ' },
            { id: 'cell', label: 'تلوين الخلية' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSection(t.id as 'mcq' | 'tf' | 'cell')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                section === t.id
                  ? 'bg-yellow-400 text-nawah-900'
                  : 'bg-nawah-800 text-slate-300 border border-nawah-700 hover:border-yellow-400/40'
              }`}
              style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* MCQ */}
        {section === 'mcq' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                النتيجة: <strong className="text-nawah-teal">{mcqScore}/{MCQ_QUESTIONS.length}</strong>
              </span>
              <button onClick={resetMcq} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-nawah-teal transition-colors">
                <RotateCcw size={14} /> إعادة المحاولة
              </button>
            </div>
            {MCQ_QUESTIONS.map((q, qi) => (
              <div key={qi} className="nawah-card rounded-2xl p-6 border border-nawah-700/40">
                <h3 className="text-white font-bold mb-4 text-lg" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
                  {qi + 1}. {q.q}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, oi) => {
                    const chosen = mcqAnswers[qi] === oi;
                    const correct = oi === q.correct;
                    const answered = mcqAnswers[qi] !== null;
                    return (
                      <button
                        key={oi}
                        onClick={() => {
                          const next = [...mcqAnswers];
                          next[qi] = oi;
                          setMcqAnswers(next);
                        }}
                        disabled={answered}
                        className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium transition-all text-right border ${
                          answered
                            ? correct
                              ? 'bg-green-500/15 border-green-500/40 text-green-400'
                              : chosen
                              ? 'bg-red-500/15 border-red-500/40 text-red-400'
                              : 'bg-nawah-800/40 border-nawah-700/30 text-slate-500'
                            : 'bg-nawah-800 border-nawah-700 text-slate-200 hover:border-nawah-teal/50 hover:bg-nawah-700'
                        }`}
                      >
                        {answered && correct && <CheckCircle size={16} className="text-green-400 flex-shrink-0" />}
                        {answered && chosen && !correct && <XCircle size={16} className="text-red-400 flex-shrink-0" />}
                        {(!answered || (!correct && !chosen)) && (
                          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0">
                            {['أ', 'ب', 'ج', 'د'][oi]}
                          </span>
                        )}
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {mcqAnswers[qi] !== null && (
                  <div className={`mt-4 p-3 rounded-xl text-sm ${mcqAnswers[qi] === q.correct ? 'bg-green-500/10 text-green-300' : 'bg-blue-500/10 text-blue-300'}`}>
                    💡 {q.explain}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* True/False */}
        {section === 'tf' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">
                النتيجة: <strong className="text-nawah-teal">{tfScore}/{TF_QUESTIONS.length}</strong>
              </span>
              <button onClick={resetTf} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-nawah-teal transition-colors">
                <RotateCcw size={14} /> إعادة المحاولة
              </button>
            </div>
            {TF_QUESTIONS.map((q, qi) => {
              const answered = tfAnswers[qi] !== null;
              const correct = tfAnswers[qi] === q.answer;
              return (
                <div key={qi} className="nawah-card rounded-2xl p-6 border border-nawah-700/40">
                  <h3 className="text-white font-bold mb-4" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
                    {qi + 1}. {q.q}
                  </h3>
                  <div className="flex gap-3">
                    {[true, false].map((val) => {
                      const chosen = tfAnswers[qi] === val;
                      const isCorrect = val === q.answer;
                      return (
                        <button
                          key={String(val)}
                          onClick={() => {
                            const next = [...tfAnswers];
                            next[qi] = val;
                            setTfAnswers(next);
                          }}
                          disabled={answered}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${
                            answered
                              ? isCorrect
                                ? 'bg-green-500/15 border-green-500/40 text-green-400'
                                : chosen
                                ? 'bg-red-500/15 border-red-500/40 text-red-400'
                                : 'bg-nawah-800/40 border-nawah-700/30 text-slate-500'
                              : 'bg-nawah-800 border-nawah-700 text-slate-200 hover:border-nawah-teal/50'
                          }`}
                          style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
                        >
                          {val ? '✓ صح' : '✗ خطأ'}
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <div className={`mt-4 p-3 rounded-xl text-sm ${correct ? 'bg-green-500/10 text-green-300' : 'bg-orange-500/10 text-orange-300'}`}>
                      {correct ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة.'} {q.explain}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Cell coloring */}
        {section === 'cell' && (
          <div className="nawah-card rounded-2xl p-6 border border-nawah-700/40">
            <h3 className="text-xl font-black text-white mb-6 text-center" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              تلوين أجزاء الخلية
            </h3>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f87171'].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveColor(c)}
                  className={`w-9 h-9 rounded-full transition-all ${activeColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-nawah-800 scale-110' : 'hover:scale-105'}`}
                  style={{ background: c }}
                />
              ))}
            </div>

            <div className="relative mx-auto" style={{ width: 320, height: 280 }}>
              <svg viewBox="0 0 100 88" className="w-full h-full">
                {/* Cell body */}
                <ellipse cx="50" cy="44" rx="45" ry="40" fill={coloredParts['membrane'] || '#1e293b'} stroke="#475569" strokeWidth="0.5" />
                {/* Nucleus */}
                <ellipse cx="50" cy="44" rx="16" ry="14" fill={coloredParts['nucleus'] || '#334155'} stroke="#64748b" strokeWidth="0.5" />
                {/* Mitochondria */}
                <ellipse cx="72" cy="56" rx="10" ry="6" fill={coloredParts['mito'] || '#334155'} stroke="#64748b" strokeWidth="0.4" />
                {/* ER */}
                <path d="M30 52 Q36 44 30 38 Q36 32 30 26" fill="none" stroke={coloredParts['er'] || '#475569'} strokeWidth="2" strokeLinecap="round" />
                <path d="M34 54 Q40 46 34 40 Q40 34 34 28" fill="none" stroke={coloredParts['er'] || '#475569'} strokeWidth="2" strokeLinecap="round" />
                {/* Vacuole */}
                <circle cx="62" cy="30" r="8" fill={coloredParts['vacuole'] || '#334155'} stroke="#64748b" strokeWidth="0.4" />
              </svg>

              {/* Clickable overlays */}
              {CELL_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => {
                    setColoredParts((prev) => ({ ...prev, [part.id]: activeColor }));
                    setSelectedPart(part.id);
                  }}
                  className="absolute w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-crosshair"
                  style={{ left: `${part.x}%`, top: `${part.y}%`, background: activeColor + '44', border: `2px solid ${activeColor}` }}
                  title={part.label}
                />
              ))}
            </div>

            {/* Part info */}
            {selectedPart && (
              <div className="mt-4 p-4 rounded-xl bg-nawah-800/80 border border-nawah-700/50 text-center">
                <div className="font-bold text-white mb-1" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
                  {CELL_PARTS.find((p) => p.id === selectedPart)?.label}
                </div>
                <p className="text-sm text-slate-400">{CELL_PARTS.find((p) => p.id === selectedPart)?.desc}</p>
              </div>
            )}

            {/* Labels list */}
            <div className="mt-5 flex flex-wrap gap-2 justify-center">
              {CELL_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => {
                    setColoredParts((prev) => ({ ...prev, [part.id]: activeColor }));
                    setSelectedPart(part.id);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                  style={{
                    background: coloredParts[part.id] ? coloredParts[part.id] + '22' : 'transparent',
                    borderColor: coloredParts[part.id] || '#475569',
                    color: coloredParts[part.id] || '#94a3b8',
                  }}
                >
                  {part.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setColoredParts({})}
              className="mt-5 w-full py-2.5 rounded-xl text-sm text-slate-400 border border-nawah-700 hover:border-red-400/40 hover:text-red-400 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> مسح الألوان
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
