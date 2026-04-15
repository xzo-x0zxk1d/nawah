'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, GraduationCap, BookOpen } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) { setError('الرجاء اختيار طالب أو معلم'); return; }
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('nawah_users') || '[]');
      const exists = users.find((u: { email: string }) => u.email === email);
      if (exists) { setError('هذا البريد الإلكتروني مسجل مسبقاً'); setLoading(false); return; }
      const newUser = { id: Date.now(), name, email, password, role };
      users.push(newUser);
      localStorage.setItem('nawah_users', JSON.stringify(users));
      localStorage.setItem('nawah_current_user', JSON.stringify(newUser));
      router.push('/subjects');
    }, 800);
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
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
            إنشاء حساب جديد
          </h1>
          <p className="text-slate-400 mt-2">انضم إلى منصة نواة التعليمية مجاناً</p>
        </div>

        <div className="nawah-card rounded-2xl p-8 border border-nawah-teal/15">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="الاسم الكامل"
                className="w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@nawah.sa"
                className="w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all"
              />
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">أنا...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    role === 'student'
                      ? 'border-nawah-teal bg-nawah-teal/10 text-nawah-teal'
                      : 'border-nawah-600 text-slate-400 hover:border-nawah-teal/50'
                  }`}
                >
                  <GraduationCap size={28} />
                  <span className="font-bold text-sm" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>طالب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    role === 'teacher'
                      ? 'border-nawah-teal bg-nawah-teal/10 text-nawah-teal'
                      : 'border-nawah-600 text-slate-400 hover:border-nawah-teal/50'
                  }`}
                >
                  <BookOpen size={28} />
                  <span className="font-bold text-sm" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>معلم</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-nawah-900/40 border-t-nawah-900 rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>إنشاء الحساب</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            لديك حساب بالفعل؟{' '}
            <Link href="/auth/login" className="text-nawah-teal hover:underline font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
