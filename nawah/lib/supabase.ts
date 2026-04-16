import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Annotation {
  id?: string;
  user_id: string;
  subject: string;
  grade: string;
  page: number;
  type: 'stroke' | 'note';
  data: string; // JSON-stringified stroke or note
  created_at?: string;
}

export interface LessonPlan {
  id?: string;
  user_id: string;
  title: string;
  subject: string;
  grade: string;
  objective: string;
  items: string; // JSON-stringified array
  created_at?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function getAnnotations(userId: string, subject: string, grade: string, page: number) {
  const { data, error } = await supabase
    .from('annotations')
    .select('*')
    .eq('user_id', userId)
    .eq('subject', subject)
    .eq('grade', grade)
    .eq('page', page);
  if (error) console.error('getAnnotations error:', error);
  return data ?? [];
}

export async function saveAnnotation(annotation: Annotation) {
  const { data, error } = await supabase
    .from('annotations')
    .upsert(annotation, { onConflict: 'id' })
    .select()
    .single();
  if (error) console.error('saveAnnotation error:', error);
  return data;
}

export async function deleteAnnotation(id: string) {
  const { error } = await supabase.from('annotations').delete().eq('id', id);
  if (error) console.error('deleteAnnotation error:', error);
}

export async function getLessonPlans(userId: string) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) console.error('getLessonPlans error:', error);
  return data ?? [];
}

export async function saveLessonPlan(plan: LessonPlan) {
  const { data, error } = await supabase
    .from('lesson_plans')
    .insert(plan)
    .select()
    .single();
  if (error) console.error('saveLessonPlan error:', error);
  return data;
}

export async function deleteLessonPlan(id: string) {
  const { error } = await supabase.from('lesson_plans').delete().eq('id', id);
  if (error) console.error('deleteLessonPlan error:', error);
}

export async function upsertUser(user: { id: string; name: string; email: string; role: string }) {
  const { error } = await supabase.from('users').upsert(user, { onConflict: 'id' });
  if (error) console.error('upsertUser error:', error);
}
