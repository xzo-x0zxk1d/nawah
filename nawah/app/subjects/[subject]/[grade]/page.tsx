import Link from 'next/link';
import { BookOpen, FlaskConical, Star, ChevronLeft } from 'lucide-react';

const subjectNames: Record<string, string> = {
  science: 'العلوم',
  math: 'الرياضيات',
  arabic: 'اللغة العربية',
  social: 'الدراسات الاجتماعية',
};

const gradeNames: Record<string, string> = {
  grade4: 'الصف الرابع',
  grade5: 'الصف الخامس',
  grade6: 'الصف السادس',
  grade7: 'الصف السابع',
  grade8: 'الصف الثامن',
  grade9: 'الصف التاسع',
};

const units: Record<string, string[]> = {
  science: ['الخلية والكائنات الحية', 'حالات المادة', 'القوى والحركة', 'النظام الشمسي', 'البيئة والتوازن البيئي'],
  math: ['الأعداد والعمليات', 'الجبر', 'الهندسة', 'القياس', 'الإحصاء والاحتمالات'],
  arabic: ['الفهم والاستيعاب', 'القواعد النحوية', 'الأدب', 'التعبير الكتابي', 'المطالعة'],
  social: ['التاريخ الإسلامي', 'الجغرافيا', 'التربية الوطنية', 'الاقتصاد', 'المواطنة'],
};

export default function SubjectGradePage({
  params,
}: {
  params: { subject: string; grade: string };
}) {
  const { subject, grade } = params;
  const subjectName = subjectNames[subject] || subject;
  const gradeName = gradeNames[grade] || grade;
  const unitList = units[subject] || [];

  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/subjects" className="hover:text-nawah-teal transition-colors">المواد</Link>
          <ChevronLeft size={14} />
          <span className="text-white">{subjectName} – {gradeName}</span>
        </div>

        {/* Header */}
        <div className="nawah-card rounded-2xl p-8 border border-nawah-teal/20 mb-8 relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-nawah-teal/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              {subjectName}
            </h1>
            <p className="text-nawah-teal text-lg font-semibold">{gradeName}</p>
          </div>
        </div>

        {/* Main actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link
            href={`/viewer/${subject}/${grade}`}
            className="nawah-card rounded-2xl p-6 border border-nawah-teal/25 hover:border-nawah-teal flex flex-col items-center gap-3 transition-all group"
          >
            <div className="w-14 h-14 bg-nawah-teal/10 rounded-xl flex items-center justify-center group-hover:bg-nawah-teal/20 transition-colors">
              <BookOpen size={28} className="text-nawah-teal" />
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              فتح الكتاب
            </span>
            <p className="text-slate-400 text-sm text-center">تصفح وشرح الكتاب المدرسي</p>
          </Link>

          <Link
            href="/lab"
            className="nawah-card rounded-2xl p-6 border border-purple-400/25 hover:border-purple-400 flex flex-col items-center gap-3 transition-all group"
          >
            <div className="w-14 h-14 bg-purple-400/10 rounded-xl flex items-center justify-center group-hover:bg-purple-400/20 transition-colors">
              <FlaskConical size={28} className="text-purple-400" />
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              التجارب الافتراضية
            </span>
            <p className="text-slate-400 text-sm text-center">محاكاة علمية تفاعلية وآمنة</p>
          </Link>

          <Link
            href="/activities"
            className="nawah-card rounded-2xl p-6 border border-yellow-400/25 hover:border-yellow-400 flex flex-col items-center gap-3 transition-all group"
          >
            <div className="w-14 h-14 bg-yellow-400/10 rounded-xl flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
              <Star size={28} className="text-yellow-400" />
            </div>
            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              الأنشطة والتحديات
            </span>
            <p className="text-slate-400 text-sm text-center">اختبارات وتحديات تفاعلية</p>
          </Link>
        </div>

        {/* Units */}
        <div>
          <h2 className="text-2xl font-black text-white mb-5" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
            وحدات الكتاب
          </h2>
          <div className="space-y-3">
            {unitList.map((unit, i) => (
              <Link
                key={i}
                href={`/viewer/${subject}/${grade}?page=${i * 20 + 1}`}
                className="nawah-card flex items-center justify-between p-5 rounded-xl border border-nawah-600/30 hover:border-nawah-teal/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 bg-nawah-teal/10 rounded-lg flex items-center justify-center text-nawah-teal font-bold text-sm group-hover:bg-nawah-teal/20 transition-colors">
                    {i + 1}
                  </span>
                  <span className="text-white font-medium">{unit}</span>
                </div>
                <ChevronLeft size={18} className="text-slate-500 group-hover:text-nawah-teal transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
