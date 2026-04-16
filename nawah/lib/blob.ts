/**
 * Blob folder/file naming convention:
 *   math/4.pdf   → 4th grade Math
 *   science/7.pdf → 7th grade Science
 *   arabic/5.pdf  → 5th grade Arabic
 *   geography/9.pdf → 9th grade Geography (social studies)
 *
 * The Vercel Blob store is public-read so we just need the URL.
 * The BLOB_READ_WRITE_TOKEN is used server-side only.
 */

export const SUBJECT_FOLDER_MAP: Record<string, string> = {
  science: 'science',
  math: 'math',
  arabic: 'arabic',
  social: 'geography',
};

export const GRADE_NUMBER_MAP: Record<string, string> = {
  grade1: '1', grade2: '2', grade3: '3',
  grade4: '4', grade5: '5', grade6: '6',
  grade7: '7', grade8: '8', grade9: '9',
};

/**
 * Build the Vercel Blob public URL for a given subject/grade.
 * Pattern: https://<store>.public.blob.vercel-storage.com/<folder>/<number>.pdf
 *
 * We expose this via an API route (/api/blob-url) so the token never leaks to the client.
 */
export function buildBlobPath(subject: string, grade: string): string {
  const folder = SUBJECT_FOLDER_MAP[subject] ?? subject;
  const num = GRADE_NUMBER_MAP[grade] ?? grade.replace('grade', '');
  return `${folder}/${num}.pdf`;
}
