import Link from 'next/link';
import { FlaskConical, Calculator, BookA, Globe, Music, ChevronLeft } from 'lucide-react';

const subjects = [
  {
    id: 'science',
    name: 'العلوم',
    icon: <FlaskConical size={36} />,
    desc: 'الأحياء، الكيمياء، الفيزياء، وعلوم الأرض',
    color: 'from-nawah-teal/20 to-nawah-teal/5',
    border: 'border-nawah-teal/30 hover:border-nawah-teal',
    badge: 'bg-nawah-teal/10 text-nawah-teal',
    grades: ['grade4', 'grade5', 'grade6', 'grade7', 'grade8', 'grade9'],
    gradeNames: ['4', '5', '6', '7', '8', '9'],
    available: true,
  },
  {
    id: 'math',
    name: 'الرياضيات',
    icon: <Calculator size={36} />,
    desc: 'الجبر، الهندسة، الإحصاء وحساب المثلثات',
    color: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-400/30 hover:border-blue-400',
    badge: 'bg-blue-400/10 text-blue-400',
    grades: ['grade4', 'grade5', 'grade6', 'grade7', 'grade8', 'grade9'],
    gradeNames: ['4', '5', '6', '7', '8', '9'],
    available: true,
  },
  {
    id: 'arabic',
    name: 'اللغة العربية',
    icon: <BookA size={36} />,
    desc: 'القواعد، الأدب، البلاغة والتعبير الكتابي',
    color: 'from-yellow-500/20 to-yellow-500/5',
    border: 'border-yellow-400/30 hover:border-yellow-400',
    badge: 'bg-yellow-400/10 text-yellow-400',
    grades: ['grade4', 'grade5', 'grade6', 'grade7', 'grade8', 'grade9'],
    gradeNames: ['4', '5', '6', '7', '8', '9'],
    available: true,
  },
  {
    id: 'social',
    name: 'الدراسات الاجتماعية',
    icon: <Globe size={36} />,
    desc: 'التاريخ، الجغرافيا، التربية الوطنية',
    color: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-400/30 hover:border-purple-400',
    badge: 'bg-purple-400/10 text-purple-400',
    grades: ['grade4', 'grade5', 'grade6', 'grade7', 'grade8', 'grade9'],
    gradeNames: ['4', '5', '6', '7', '8', '9'],
    available: true,
  },
  {
    id: 'other',
    name: 'مواد أخرى',
    icon: <Music size={36} />,
    desc: 'مواد إضافية قادمة قريباً...',
    color: 'from-slate-500/10 to-slate-500/5',
    border: 'border-slate-500/20',
    badge: 'bg-slate-500/10 text-slate-400',
    grades: [],
    gradeNames: [],
    available: false,
  },
];

const gradeLabels: Record<string, string> = {
  grade4: 'الصف الرابع',
  grade5: 'الصف الخامس',
  grade6: 'الصف السادس',
  grade7: 'الصف السابع',
  grade8: 'الصف الثامن',
  grade9: 'الصف التاسع',
};

export default function SubjectsPage() {
  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-nawah-teal/10 border border-nawah-teal/30 rounded-full text-nawah-teal text-sm mb-5">
            📚 المواد الدراسية
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
            اختر مادتك
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            كتب رسمية، تجارب افتراضية وأنشطة تفاعلية لكل المراحل الدراسية
          </p>
        </div>

        {/* Grid */}
        <div className="space-y-6">
          {subjects.map((subj) => (
            <div
              key={subj.id}
              className={`nawah-card rounded-2xl border ${subj.border} transition-all duration-300 overflow-hidden bg-gradient-to-br ${subj.color}`}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Subject info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${subj.badge} bg-opacity-20 flex-shrink-0`}>
                      {subj.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
                        {subj.name}
                      </h2>
                      <p className="text-slate-400 text-sm">{subj.desc}</p>
                      {!subj.available && (
                        <span className="inline-block mt-2 px-3 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-full">
                          قريباً
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Grades */}
                  {subj.available && subj.grades.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subj.grades.map((grade, i) => (
                        <Link
                          key={grade}
                          href={`/subjects/${subj.id}/${grade}`}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${subj.badge} hover:scale-105 transition-transform text-sm font-bold`}
                        >
                          الصف {subj.gradeNames[i]}
                          <ChevronLeft size={14} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
