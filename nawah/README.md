# نواة – المنصة التعليمية

> العلم يبدأ من نواة الفضول  
> صنع بواسطة فيصل تركي ردن الدويش

---

## المتطلبات

- Node.js 18+
- حساب Vercel (للنشر + Blob)
- حساب Supabase

---

## إعداد Supabase

1. افتح [supabase.com](https://supabase.com) وادخل مشروعك
2. اذهب إلى **SQL Editor** والصق محتوى ملف `supabase-schema.sql` ثم نفّذه
3. سيتم إنشاء الجداول: `users`, `annotations`, `lesson_plans`

---

## إعداد Vercel Blob

رفع ملفات PDF بالتنسيق التالي:

```
math/4.pdf       ← رياضيات الصف الرابع
math/5.pdf       ← رياضيات الصف الخامس
science/7.pdf    ← علوم الصف السابع
arabic/6.pdf     ← عربي الصف السادس
geography/8.pdf  ← اجتماعيات الصف الثامن
```

يمكن الرفع عبر Vercel Dashboard → Storage → Blob → Upload  
أو عبر CLI:
```bash
npx vercel blob upload math/4.pdf ./local-books/math-grade4.pdf
```

---

## متغيرات البيئة

أضف هذه في Vercel Dashboard → Settings → Environment Variables:

```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_x6h5104VtTjmTF9W_...
NEXT_PUBLIC_SUPABASE_URL=https://sivutnpiydsicazezdsе.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

وللتشغيل المحلي، أنشئ ملف `.env.local` بنفس القيم.

---

## تشغيل محلي

```bash
npm install
npm run dev
# افتح http://localhost:3000
```

---

## النشر على Vercel

```bash
# ربط المشروع بـ Vercel
npx vercel

# نشر للإنتاج
npx vercel --prod
```

---

## هيكل المشروع

```
nawah/
├── app/
│   ├── page.tsx                    ← الصفحة الرئيسية
│   ├── layout.tsx                  ← التخطيط العام (RTL)
│   ├── auth/login/page.tsx
│   ├── auth/register/page.tsx
│   ├── subjects/page.tsx
│   ├── subjects/[subject]/[grade]/page.tsx
│   ├── viewer/[subject]/[grade]/page.tsx
│   ├── lab/page.tsx                ← 3 محاكاة علمية
│   ├── activities/page.tsx
│   ├── wheel/page.tsx
│   ├── teacher/page.tsx
│   └── api/
│       ├── blob-url/route.ts       ← يجلب URL من Vercel Blob
│       ├── annotations/route.ts    ← CRUD للتعليقات (Supabase)
│       └── lesson-plans/route.ts   ← CRUD لخطط الدروس (Supabase)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PDFViewerClient.tsx         ← iframe PDF + رسم + Supabase
│   └── simulations/
│       ├── MatterSimulation.tsx
│       ├── GasPressureSimulation.tsx
│       └── AtomSimulation.tsx
├── lib/
│   ├── supabase.ts                 ← Supabase client + helpers
│   └── blob.ts                    ← مسارات Blob
├── styles/globals.css
├── supabase-schema.sql             ← شغّله مرة واحدة في Supabase
└── .env.local                      ← لا يُرفع على GitHub
```

---

## ملاحظات

- ملف `.env.local` لا يُرفع على GitHub تلقائياً (مضمّن في `.gitignore`)
- التوثيق حالياً client-side بسيط — يمكن ترقيته لـ Supabase Auth لاحقاً
- الكتب في Blob هي ملفات PDF عادية — لا توجد قيود على الحجم
