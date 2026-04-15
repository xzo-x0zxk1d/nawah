'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, BookOpen, FlaskConical, Star, GraduationCap, CheckCircle } from 'lucide-react';

interface LessonItem {
  id: string;
  type: 'book' | 'lab' | 'activity';
  title: string;
  value: string;
}

interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  objective: string;
  items: LessonItem[];
  createdAt: string;
}

const SUBJECTS = ['العلوم', 'الرياضيات', 'اللغة العربية', 'الدراسات الاجتماعية'];
const GRADES = ['الصف الرابع', 'الصف الخامس', 'الصف السادس', 'الصف السابع', 'الصف الثامن', 'الصف التاسع'];

export default function TeacherPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [creating, setCreating] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState(GRADES[0]);
  const [objective, setObjective] = useState('');
  const [items, setItems] = useState<LessonItem[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('nawah_lesson_plans');
    if (data) setPlans(JSON.parse(data));
  }, []);

  const addItem = (type: LessonItem['type']) => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), type, title: '', value: '' },
    ]);
  };

  const updateItem = (id: string, field: 'title' | 'value', val: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const savePlan = () => {
    const plan: LessonPlan = {
      id: Date.now().toString(),
      title,
      subject,
      grade,
      objective,
      items,
      createdAt: new Date().toLocaleDateString('ar-SA'),
    };
    const updated = [plan, ...plans];
    setPlans(updated);
    localStorage.setItem('nawah_lesson_plans', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => { setSaved(false); setCreating(false); resetForm(); }, 1500);
  };

  const deletePlan = (id: string) => {
    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem('nawah_lesson_plans', JSON.stringify(updated));
  };

  const resetForm = () => {
    setTitle(''); setObjective(''); setItems([]);
  };

  const inputCls = 'w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm';

  const typeIcon = (type: string) =>
    type === 'book' ? <BookOpen size={15} className="text-nawah-teal" />
    : type === 'lab' ? <FlaskConical size={15} className="text-purple-400" />
    : <Star size={15} className="text-yellow-400" />;

  const typeLabel = (type: string) =>
    type === 'book' ? 'صفحة من الكتاب' : type === 'lab' ? 'تجربة افتراضية' : 'نشاط';

  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 bg-nawah-teal/10 border border-nawah-teal/30 rounded-full text-nawah-teal text-sm mb-2">
              👩‍🏫 لوحة المعلم
            </span>
            <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              خطط دروسي
            </h1>
          </div>
          <button
            onClick={() => { setCreating(true); resetForm(); }}
            className="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl"
          >
            <Plus size={18} />
            خطة درس جديدة
          </button>
        </div>

        {/* Create form */}
        {creating && (
          <div className="nawah-card rounded-2xl p-6 border border-nawah-teal/20 mb-8">
            <h2 className="text-xl font-black text-white mb-5" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              إنشاء خطة درس جديدة
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">عنوان الدرس</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: حالات المادة" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">الهدف العام</label>
                <input value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="الطالب يفهم..." className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">المادة</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls}>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">الصف</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value)} className={inputCls}>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-300">عناصر الدرس</label>
                <div className="flex gap-2">
                  {[
                    { type: 'book' as const, icon: <BookOpen size={14} />, label: '+ كتاب' },
                    { type: 'lab' as const, icon: <FlaskConical size={14} />, label: '+ تجربة' },
                    { type: 'activity' as const, icon: <Star size={14} />, label: '+ نشاط' },
                  ].map((btn) => (
                    <button
                      key={btn.type}
                      onClick={() => addItem(btn.type)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-nawah-700 text-slate-300 hover:text-nawah-teal hover:bg-nawah-600 text-xs transition-all"
                    >
                      {btn.icon} {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {items.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-nawah-700 rounded-xl">
                  أضف عناصر للدرس باستخدام الأزرار أعلاه
                </div>
              )}

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-nawah-800/60 rounded-xl p-3">
                    <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-nawah-700">
                      {typeIcon(item.type)}
                      <span className="text-slate-300">{typeLabel(item.type)}</span>
                    </div>
                    <input
                      value={item.title}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      placeholder="العنوان"
                      className="flex-1 bg-transparent border-b border-nawah-600 pb-1 text-white text-sm placeholder-slate-500 focus:border-nawah-teal outline-none"
                    />
                    <input
                      value={item.value}
                      onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                      placeholder={item.type === 'book' ? 'رقم الصفحة' : 'الرابط أو الوصف'}
                      className="w-28 bg-transparent border-b border-nawah-600 pb-1 text-white text-sm placeholder-slate-500 focus:border-nawah-teal outline-none"
                    />
                    <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={savePlan}
                disabled={!title}
                className={`btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 ${saved ? 'bg-green-500' : ''}`}
              >
                {saved ? <CheckCircle size={16} /> : <Save size={16} />}
                {saved ? 'تم الحفظ!' : 'حفظ الخطة'}
              </button>
              <button onClick={() => setCreating(false)} className="btn-outline px-6 py-2.5 rounded-xl text-sm">
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Plans list */}
        {plans.length === 0 && !creating ? (
          <div className="text-center py-20">
            <GraduationCap size={56} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">لا توجد خطط دروس بعد</p>
            <p className="text-slate-500 text-sm">ابدأ بإنشاء خطة درسك الأولى!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="nawah-card rounded-2xl p-5 border border-nawah-700/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
                        {plan.title}
                      </h3>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-nawah-teal/10 text-nawah-teal">{plan.subject}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-400/10 text-purple-400">{plan.grade}</span>
                    </div>
                    {plan.objective && (
                      <p className="text-slate-400 text-sm mb-3">🎯 {plan.objective}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {plan.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-nawah-800 text-slate-400">
                          {typeIcon(item.type)}
                          {item.title || typeLabel(item.type)}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 mt-3">{plan.createdAt}</p>
                  </div>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
