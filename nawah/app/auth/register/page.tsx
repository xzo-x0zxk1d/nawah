'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, GraduationCap, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student'|'teacher'|''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { setError('الرجاء اختيار طالب أو معلم'); return; }
    setLoading(true); setError('');

    const userId = `user_${Date.now()}`;
    const newUser = { id: userId, name, email, role, password_hash: btoa(password) };

    try {
      // Save to Supabase
      const { error: dbErr } = await supabase.from('users').insert(newUser);
      if (dbErr && dbErr.code === '23505') { setError('هذا البريد الإلكتروني مسجل مسبقاً'); setLoading(false); return; }
      if (dbErr) throw dbErr;
    } catch {
      // Offline fallback: save locally
    }

    // Always save locally too for session
    const localUser = { id: userId, name, email, role, password };
    const local = JSON.parse(localStorage.getItem('nawah_users') || '[]');
    local.push(localUser);
    localStorage.setItem('nawah_users', JSON.stringify(local));
    localStorage.setItem('nawah_current_user', JSON.stringify(localUser));
    router.push('/subjects');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-nawah-teal rounded-full opacity-30" />
            <div className="absolute inset-2 border-2 border-nawah-teal rounded-full opacity-60" />
            <div className="absolute inset-4 bg-nawah-teal rounded-full" />
          </div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>إنشاء حساب جديد</h1>
          <p className="text-slate-400 mt-2">انضم إلى منصة نواة التعليمية مجاناً</p>
        </div>

        <div className="nawah-card rounded-2xl p-8 border border-nawah-teal/15">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الكامل</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="الاسم الكامل"
                className="w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="example@nawah.sa"
                className="w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">أنا...</label>
              <div className="grid grid-cols-2 gap-3">
                {([['student','طالب',<GraduationCap key="s" size={28}/>],['teacher','معلم',<BookOpen key="t" size={28}/>]] as const).map(([val,label,icon]) => (
                  <button key={val} type="button" onClick={() => setRole(val)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role===val ? 'border-nawah-teal bg-nawah-teal/10 text-nawah-teal' : 'border-nawah-600 text-slate-400 hover:border-nawah-teal/50'}`}>
                    {icon}
                    <span className="font-bold text-sm" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <div className="w-5 h-5 border-2 border-nawah-900/40 border-t-nawah-900 rounded-full animate-spin" /> : <><UserPlus size={18} /><span>إنشاء الحساب</span></>}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-6">
            لديك حساب بالفعل?{' '}
            <Link href="/auth/login" className="text-nawah-teal hover:underline font-medium">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
