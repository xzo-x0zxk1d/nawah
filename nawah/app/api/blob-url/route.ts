import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import { buildBlobPath } from '@/lib/blob';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const grade = searchParams.get('grade');

  if (!subject || !grade) {
    return NextResponse.json({ error: 'subject and grade are required' }, { status: 400 });
  }

  try {
    const blobPath = buildBlobPath(subject, grade);

    // List blobs with the expected prefix to find the exact URL
    const { blobs } = await list({ prefix: blobPath });

    if (!blobs.length) {
      return NextResponse.json({ url: null, message: 'الكتاب غير متوفر بعد' });
    }

    // Return the public URL of the first match
    return NextResponse.json({ url: blobs[0].url });
  } catch (err) {
    console.error('Blob list error:', err);
    return NextResponse.json({ error: 'Failed to fetch blob URL' }, { status: 500 });
  }
}
