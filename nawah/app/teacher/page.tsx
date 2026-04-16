'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Save, BookOpen, FlaskConical, Star, GraduationCap, CheckCircle, Loader2 } from 'lucide-react';

interface LessonItem { id: string; type:'book'|'lab'|'activity'; title:string; value:string; }
interface LessonPlan { id?:string; user_id:string; title:string; subject:string; grade:string; objective:string; items:string; created_at?:string; }

const SUBJECTS = ['العلوم','الرياضيات','اللغة العربية','الدراسات الاجتماعية'];
const GRADES   = ['الصف الرابع','الصف الخامس','الصف السادس','الصف السابع','الصف الثامن','الصف التاسع'];

function getUser() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('nawah_current_user')||'null'); } catch { return null; }
}

export default function TeacherPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [creating, setCreating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState(GRADES[0]);
  const [objective, setObjective] = useState('');
  const [items, setItems] = useState<LessonItem[]>([]);

  const user = getUser();
  const userId = user?.id ?? 'guest';

  const loadPlans = useCallback(async () => {
    setLoadingPlans(true);
    try {
      const res = await fetch(`/api/lesson-plans?user_id=${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch {
      // Offline fallback
      try {
        const raw = localStorage.getItem(`nawah_plans_${userId}`);
        if (raw) setPlans(JSON.parse(raw));
      } catch {}
    } finally { setLoadingPlans(false); }
  }, [userId]);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const addItem = (type: LessonItem['type']) => setItems(prev=>[...prev,{id:Date.now().toString(),type,title:'',value:''}]);
  const updateItem = (id:string, field:'title'|'value', val:string) => setItems(prev=>prev.map(it=>it.id===id?{...it,[field]:val}:it));
  const removeItem = (id:string) => setItems(prev=>prev.filter(it=>it.id!==id));

  const savePlan = async () => {
    if (!title) return;
    setSaving(true);
    const plan: LessonPlan = { user_id:userId, title, subject, grade, objective, items:JSON.stringify(items) };
    try {
      const res = await fetch('/api/lesson-plans',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(plan)});
      const saved = await res.json();
      const updated = [saved,...plans];
      setPlans(updated);
      localStorage.setItem(`nawah_plans_${userId}`, JSON.stringify(updated));
    } catch {
      const fallback = [{...plan,id:Date.now().toString(),created_at:new Date().toISOString()},...plans];
      setPlans(fallback);
      localStorage.setItem(`nawah_plans_${userId}`, JSON.stringify(fallback));
    }
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setCreating(false); setTitle(''); setObjective(''); setItems([]); }, 1400);
    setSaving(false);
  };

  const deletePlan = async (id:string) => {
    try { await fetch(`/api/lesson-plans?id=${id}`,{method:'DELETE'}); } catch {}
    const updated = plans.filter(p=>p.id!==id);
    setPlans(updated);
    localStorage.setItem(`nawah_plans_${userId}`, JSON.stringify(updated));
  };

  const inputCls = 'w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm';
  const typeIcon = (type:string) => type==='book'?<BookOpen size={15} className="text-nawah-teal"/>:type==='lab'?<FlaskConical size={15} className="text-purple-400"/>:<Star size={15} className="text-yellow-400"/>;
  const typeLabel = (type:string) => type==='book'?'صفحة من الكتاب':type==='lab'?'تجربة افتراضية':'نشاط';

  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 bg-nawah-teal/10 border border-nawah-teal/30 rounded-full text-nawah-teal text-sm mb-2">👩‍🏫 لوحة المعلم</span>
            <h1 className="text-3xl font-black text-white" style={{fontFamily:'Noto Kufi Arabic, serif'}}>خطط دروسي</h1>
          </div>
          <button onClick={()=>{setCreating(true);setTitle('');setObjective('');setItems([]);}} className="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl">
            <Plus size={18}/>خطة درس جديدة
          </button>
        </div>

        {creating && (
          <div className="nawah-card rounded-2xl p-6 border border-nawah-teal/20 mb-8">
            <h2 className="text-xl font-black text-white mb-5" style={{fontFamily:'Noto Kufi Arabic, serif'}}>إنشاء خطة درس جديدة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div><label className="block text-xs text-slate-400 mb-1.5">عنوان الدرس</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="مثال: حالات المادة" className={inputCls}/></div>
              <div><label className="block text-xs text-slate-400 mb-1.5">الهدف العام</label><input value={objective} onChange={e=>setObjective(e.target.value)} placeholder="الطالب يفهم..." className={inputCls}/></div>
              <div><label className="block text-xs text-slate-400 mb-1.5">المادة</label><select value={subject} onChange={e=>setSubject(e.target.value)} className={inputCls}>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></div>
              <div><label className="block text-xs text-slate-400 mb-1.5">الصف</label><select value={grade} onChange={e=>setGrade(e.target.value)} className={inputCls}>{GRADES.map(g=><option key={g}>{g}</option>)}</select></div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-300">عناصر الدرس</label>
                <div className="flex gap-2">
                  {([['book','+ كتاب'],['lab','+ تجربة'],['activity','+ نشاط']] as const).map(([type,lbl])=>(
                    <button key={type} onClick={()=>addItem(type)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-nawah-700 text-slate-300 hover:text-nawah-teal hover:bg-nawah-600 text-xs transition-all">
                      {typeIcon(type)}{lbl}
                    </button>
                  ))}
                </div>
              </div>
              {items.length===0&&<div className="text-center py-8 text-slate-500 text-sm border border-dashed border-nawah-700 rounded-xl">أضف عناصر للدرس باستخدام الأزرار أعلاه</div>}
              <div className="space-y-3">
                {items.map(item=>(
                  <div key={item.id} className="flex items-center gap-3 bg-nawah-800/60 rounded-xl p-3">
                    <div className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-nawah-700">{typeIcon(item.type)}<span className="text-slate-300">{typeLabel(item.type)}</span></div>
                    <input value={item.title} onChange={e=>updateItem(item.id,'title',e.target.value)} placeholder="العنوان" className="flex-1 bg-transparent border-b border-nawah-600 pb-1 text-white text-sm placeholder-slate-500 focus:border-nawah-teal outline-none"/>
                    <input value={item.value} onChange={e=>updateItem(item.id,'value',e.target.value)} placeholder={item.type==='book'?'رقم الصفحة':'الوصف'} className="w-28 bg-transparent border-b border-nawah-600 pb-1 text-white text-sm placeholder-slate-500 focus:border-nawah-teal outline-none"/>
                    <button onClick={()=>removeItem(item.id)} className="text-slate-500 hover:text-red-400"><Trash2 size={15}/></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={savePlan} disabled={!title||saving} className={`btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 ${saved?'bg-green-500':''}`}>
                {saving?<Loader2 size={15} className="animate-spin"/>:saved?<CheckCircle size={15}/>:<Save size={15}/>}
                {saved?'تم الحفظ!':'حفظ الخطة'}
              </button>
              <button onClick={()=>setCreating(false)} className="btn-outline px-6 py-2.5 rounded-xl text-sm">إلغاء</button>
            </div>
          </div>
        )}

        {loadingPlans ? (
          <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-nawah-teal"/></div>
        ) : plans.length===0&&!creating ? (
          <div className="text-center py-20">
            <GraduationCap size={56} className="text-slate-600 mx-auto mb-4"/>
            <p className="text-slate-400 text-lg mb-2">لا توجد خطط دروس بعد</p>
            <p className="text-slate-500 text-sm">ابدأ بإنشاء خطة درسك الأولى!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map(plan=>{
              const planItems: LessonItem[] = (() => { try { return JSON.parse(plan.items||'[]'); } catch { return []; } })();
              return (
                <div key={plan.id} className="nawah-card rounded-2xl p-5 border border-nawah-700/40">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-white font-bold text-lg" style={{fontFamily:'Noto Kufi Arabic, serif'}}>{plan.title}</h3>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-nawah-teal/10 text-nawah-teal">{plan.subject}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-400/10 text-purple-400">{plan.grade}</span>
                      </div>
                      {plan.objective&&<p className="text-slate-400 text-sm mb-3">🎯 {plan.objective}</p>}
                      <div className="flex flex-wrap gap-2">
                        {planItems.map((item,i)=>(
                          <div key={i} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-nawah-800 text-slate-400">
                            {typeIcon(item.type)}{item.title||typeLabel(item.type)}
                          </div>
                        ))}
                      </div>
                      {plan.created_at&&<p className="text-xs text-slate-600 mt-3">{new Date(plan.created_at).toLocaleDateString('ar-SA')}</p>}
                    </div>
                    <button onClick={()=>plan.id&&deletePlan(plan.id)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
