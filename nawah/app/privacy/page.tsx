export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
          سياسة الاستخدام
        </h1>
        <div className="nawah-card rounded-2xl p-8 border border-nawah-teal/15 space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              1. الغرض من المنصة
            </h2>
            <p>منصة نواة مخصصة حصرياً للأغراض التعليمية للطلاب السعوديين. يُحظر استخدام المنصة لأي غرض آخر.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              2. المحتوى التعليمي
            </h2>
            <p>جميع المواد التعليمية المعروضة على المنصة هي مواد تعليمية آمنة مصممة وفق المناهج السعودية الرسمية. لا تحتوي المنصة على أي محتوى ضار أو مخالف للأنظمة.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              3. حماية البيانات
            </h2>
            <p>يتم تخزين بيانات المستخدم محلياً على جهازه فقط. لا يتم إرسال أي بيانات شخصية لخوادم خارجية.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-nawah-teal mb-3" style={{ fontFamily: 'Noto Kufi Arabic, serif' }}>
              4. حقوق الملكية الفكرية
            </h2>
            <p>الكتب المدرسية المستخدمة هي ملك وزارة التعليم السعودية. يُحظر نسخ أو توزيع أي محتوى من المنصة دون إذن.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
