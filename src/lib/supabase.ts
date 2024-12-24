// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadToSupabase(file: Buffer, filename: string) {
  const { data, error } = await supabase.storage
    .from('pdfs')
    .upload(filename, file, {
      contentType: 'application/pdf',
      upsert: false
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('pdfs')
    .getPublicUrl(filename);

  return publicUrl;
}