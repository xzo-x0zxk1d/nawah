# نواة – المنصة التعليمية

> العلم يبدأ من نواة الفضول

منصة تعليمية تفاعلية للطلاب السعوديين مبنية بـ Next.js 14 + Tailwind CSS.

## الميزات

- 📚 **مشاهد الكتب** – عارض PDF تفاعلي مع أدوات رسم وتظليل وملاحظات
- 🔬 **المختبر الافتراضي** – 3 محاكاة علمية (حالات المادة، ضغط الغاز، نموذج الذرة)
- ⭐ **الأنشطة** – اختيار متعدد، صح/خطأ، تلوين الخلية
- 🎡 **عجلة الأنشطة** – عجلة عشوائية للمعلمين
- 👩‍🏫 **لوحة المعلم** – إنشاء وحفظ خطط الدروس
- 🔐 **تسجيل الدخول** – نظام مصادقة بسيط client-side

## التشغيل المحلي

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## النشر على Vercel

```bash
npm install -g vercel
vercel
```

## إضافة الكتب

ضع ملفات PDF في:
```
/public/books/grade7/science.pdf
/public/books/grade7/math.pdf
/public/books/grade8/science.pdf
...
```

## هيكل المشروع

```
nawah/
├── app/
│   ├── page.tsx              # الصفحة الرئيسية
│   ├── auth/login/           # تسجيل الدخول
│   ├── auth/register/        # إنشاء حساب
│   ├── subjects/             # قائمة المواد
│   ├── subjects/[s]/[g]/     # صفحة المادة والصف
│   ├── viewer/[s]/[g]/       # عارض PDF
│   ├── lab/                  # المختبر الافتراضي
│   ├── activities/           # الأنشطة
│   ├── wheel/                # عجلة الأنشطة
│   └── teacher/              # لوحة المعلم
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PDFViewerClient.tsx
│   └── simulations/
│       ├── MatterSimulation.tsx
│       ├── GasPressureSimulation.tsx
│       └── AtomSimulation.tsx
└── styles/globals.css
```

---
صنع بواسطة **فيصل تركي ردن الدويش**
