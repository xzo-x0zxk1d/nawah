export default function TermsPage() {
  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
          الشروط والأحكام
        </h1>
        <div className="nawah-card rounded-2xl p-8 border border-nawah-teal/15 space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>قبول الشروط</h2>
            <p>باستخدامك لمنصة نواة، فإنك توافق على الالتزام بهذه الشروط والأحكام.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>الاستخدام المقبول</h2>
            <p>يجب استخدام المنصة للأغراض التعليمية فقط. يُحظر أي استخدام مسيء أو مخالف للأنظمة السعودية.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>إخلاء المسؤولية</h2>
            <p>منصة نواة غير مسؤولة عن أي محتوى يضيفه المستخدمون في أدوات التعليق أو الملاحظات.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
