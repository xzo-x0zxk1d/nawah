'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('nawah_users') || '[]');
      const user = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('nawah_current_user', JSON.stringify(user));
        router.push('/subjects');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-2 border-nawah-teal rounded-full opacity-30" />
            <div className="absolute inset-2 border-2 border-nawah-teal rounded-full opacity-60" />
            <div className="absolute inset-4 bg-nawah-teal rounded-full" />
          </div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
            أهلاً بعودتك
          </h1>
          <p className="text-slate-400 mt-2">سجّل دخولك لمواصلة رحلة التعلم</p>
        </div>

        {/* Card */}
        <div className="nawah-card rounded-2xl p-8 border border-nawah-teal/15">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                البريد الإلكتروني
              </label>
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-nawah-800 border border-nawah-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 transition-all pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-nawah-teal transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  <LogIn size={18} />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            ليس لديك حساب؟{' '}
            <Link href="/auth/register" className="text-nawah-teal hover:underline font-medium">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
