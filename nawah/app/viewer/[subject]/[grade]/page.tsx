import PDFViewerClient from '@/components/PDFViewerClient';

export default function ViewerPage({
  params,
}: {
  params: { subject: string; grade: string };
}) {
  const pdfPath = `/books/${params.grade}/${params.subject}.pdf`;

  return (
    <div className="min-h-screen pt-16">
      <PDFViewerClient subject={params.subject} grade={params.grade} pdfPath={pdfPath} />
    </div>
  );
}
