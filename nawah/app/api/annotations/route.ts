import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/annotations?user_id=x&subject=y&grade=z&page=n
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  const subject = searchParams.get('subject');
  const grade = searchParams.get('grade');
  const page = searchParams.get('page');

  if (!user_id || !subject || !grade) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  let query = supabase
    .from('annotations')
    .select('*')
    .eq('user_id', user_id)
    .eq('subject', subject)
    .eq('grade', grade);

  if (page) query = query.eq('page', Number(page));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/annotations  body: Annotation
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { data, error } = await supabase
    .from('annotations')
    .upsert(body, { onConflict: 'id' })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/annotations?id=x
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await supabase.from('annotations').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
