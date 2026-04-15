'use client';
import Link from 'next/link';
import { BookOpen, FlaskConical, Star, Users, ChevronLeft, ArrowDown } from 'lucide-react';

const whyCards = [
  {
    icon: <BookOpen size={28} />,
    title: 'كتب رسمية',
    desc: 'كتب المناهج السعودية الرسمية بصيغة PDF تفاعلية مع أدوات التعليق والتظليل',
    color: 'from-nawah-teal/20 to-nawah-teal/5',
    border: 'border-nawah-teal/30',
    iconColor: 'text-nawah-teal',
  },
  {
    icon: <FlaskConical size={28} />,
    title: 'تجارب افتراضية',
    desc: 'محاكاة علمية آمنة وتفاعلية لمفاهيم الكيمياء والفيزياء والأحياء',
    color: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-400/30',
    iconColor: 'text-purple-400',
  },
  {
    icon: <Star size={28} />,
    title: 'أنشطة تفاعلية',
    desc: 'اختبارات، ألوان، تحديات وألعاب تعليمية مصممة لجعل التعلم ممتعاً',
    color: 'from-yellow-500/20 to-yellow-500/5',
    border: 'border-yellow-400/30',
    iconColor: 'text-yellow-400',
  },
  {
    icon: <Users size={28} />,
    title: 'أدوات للمعلم',
    desc: 'خطط دروس قابلة للتخصيص، عجلة الأنشطة، وأدوات إدارة الصف',
    color: 'from-coral-500/20 to-red-500/5',
    border: 'border-red-400/30',
    iconColor: 'text-red-400',
  },
];

const stages = [
  {
    title: 'المرحلة الابتدائية',
    grades: ['الصف الرابع', 'الصف الخامس', 'الصف السادس'],
    color: 'border-yellow-400/40 hover:border-yellow-400',
    badge: 'bg-yellow-400/10 text-yellow-400',
  },
  {
    title: 'المرحلة المتوسطة',
    grades: ['الصف السابع', 'الصف الثامن', 'الصف التاسع'],
    color: 'border-nawah-teal/40 hover:border-nawah-teal',
    badge: 'bg-nawah-teal/10 text-nawah-teal',
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-nawah-teal/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Atom visual */}
          <div className="relative w-48 h-48 mx-auto mb-10">
            {/* Nucleus */}
            <div className="absolute inset-[40px] bg-gradient-to-br from-nawah-teal to-nawah-teal-dark rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,201,177,0.5)]">
              <span className="text-nawah-900 font-black text-2xl" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>ن</span>
            </div>
            {/* Orbits */}
            <div className="absolute inset-0 border border-nawah-teal/20 rounded-full animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-4 border border-purple-400/20 rounded-full animate-[spin_5s_linear_infinite_reverse]" />
            <div className="absolute inset-8 border border-yellow-400/20 rounded-full animate-[spin_3s_linear_infinite]" />
            {/* Electrons */}
            {[0, 120, 240].map((deg, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-nawah-teal rounded-full shadow-[0_0_8px_#00c9b1] top-1/2 right-1/2 -mt-1.5 -mr-1.5"
                style={{
                  transform: `rotate(${deg}deg) translateX(-90px)`,
                  animation: `spin 8s linear infinite`,
                }}
              />
            ))}
          </div>

          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 bg-nawah-teal/10 border border-nawah-teal/30 rounded-full text-nawah-teal text-sm font-medium mb-6">
              🎓 منصة تعليمية سعودية متكاملة
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
          >
            منصة{' '}
            <span className="text-gradient-teal">نواة</span>{' '}
            التعليمية
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            العلم يبدأ من{' '}
            <span className="text-nawah-gold font-semibold">نواة الفضول</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/login" className="btn-primary text-lg px-8 py-3.5 rounded-xl flex items-center gap-2">
              <span>تسجيل الدخول</span>
              <ChevronLeft size={18} />
            </Link>
            <Link href="/subjects" className="btn-outline text-lg px-8 py-3.5 rounded-xl">
              تصفح المواد
            </Link>
          </div>

          <div className="mt-16 flex justify-center animate-bounce opacity-50">
            <ArrowDown size={24} className="text-nawah-teal" />
          </div>
        </div>
      </section>

      {/* WHY NAWAH */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
            >
              لماذا <span className="text-gradient-teal">نواة</span>؟
            </h2>
            <p className="text-slate-400 text-lg">كل ما تحتاجه للتعلم في مكان واحد</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyCards.map((card, i) => (
              <div
                key={i}
                className={`nawah-card rounded-2xl p-6 bg-gradient-to-br ${card.color} border ${card.border}`}
              >
                <div className={`${card.iconColor} mb-4`}>{card.icon}</div>
                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAGES */}
      <section className="relative px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-black text-white mb-3"
              style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
            >
              المراحل الدراسية
            </h2>
            <p className="text-slate-400">اختر مرحلتك وابدأ رحلة التعلم</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stages.map((stage, i) => (
              <div
                key={i}
                className={`nawah-card rounded-2xl p-6 border ${stage.color} transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
                  >
                    {stage.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${stage.badge}`}>
                    {stage.grades.length} صفوف
                  </span>
                </div>
                <div className="space-y-2">
                  {stage.grades.map((grade, j) => (
                    <Link
                      key={j}
                      href={`/subjects?grade=${encodeURIComponent(grade)}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-nawah-800/60 hover:bg-nawah-700/60 transition-colors group"
                    >
                      <span className="text-sm text-slate-300">{grade}</span>
                      <ChevronLeft size={16} className="text-slate-500 group-hover:text-nawah-teal transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="nawah-card rounded-3xl p-12 border border-nawah-teal/20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-nawah-teal/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2
                className="text-3xl md:text-4xl font-black text-white mb-4"
                style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
              >
                ابدأ رحلتك التعليمية اليوم
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                سجّل مجاناً وانضم إلى منصة نواة التعليمية
              </p>
              <Link href="/auth/register" className="btn-primary text-lg px-10 py-4 rounded-xl inline-block">
                إنشاء حساب مجاني
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
