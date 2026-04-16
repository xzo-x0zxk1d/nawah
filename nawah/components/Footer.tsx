import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-nawah-800 border-t border-nawah-teal/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 relative">
                <div className="absolute inset-0 border-2 border-nawah-teal rounded-full" />
                <div className="absolute inset-[4px] bg-nawah-teal rounded-full" />
              </div>
              <span className="text-lg font-black text-white" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
                نواة
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              منصة تعليمية تفاعلية للطلاب السعوديين. العلم يبدأ من نواة الفضول.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              روابط سريعة
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {[
                { href: '/subjects', label: 'المواد الدراسية' },
                { href: '/lab', label: 'المختبر الافتراضي' },
                { href: '/activities', label: 'الأنشطة' },
                { href: '/wheel', label: 'عجلة الأنشطة' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-nawah-teal transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              سياسات
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-nawah-teal transition-colors">سياسة الاستخدام</Link></li>
              <li><Link href="/terms" className="hover:text-nawah-teal transition-colors">الشروط والأحكام</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-nawah-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} منصة نواة</p>
          <p className="text-nawah-teal/80">صنع بواسطة فيصل تركي ردن الدويش</p>
        </div>
      </div>
    </footer>
  );
}
