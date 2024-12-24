// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadToSupabase(file: Buffer, filename: string) {
    console.log('Supabase: Starting upload for file:', filename);
    
    try {
        const { data, error } = await supabase.storage
            .from('pdfs')
            .upload(filename, file, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (error) {
            console.error('Supabase: Upload error:', error);
            throw error;
        }

        console.log('Supabase: Upload successful, getting public URL');
        const { data: { publicUrl } } = supabase.storage
            .from('pdfs')
            .getPublicUrl(filename);

        console.log('Supabase: Public URL generated:', publicUrl);
        return publicUrl;
    } catch (error: any) {
        console.error('Supabase: Error in upload function:', error);
        throw new Error(`Supabase upload failed: ${error.message}`);
    }
}