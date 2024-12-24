
// app/api/save-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadToSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            console.error('API: No file received in request');
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        console.log('API: File received, size:', file.size, 'bytes');
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `allocation_${Date.now()}.pdf`;
        
        try {
            console.log('API: Attempting to upload to Supabase...');
            const url = await uploadToSupabase(buffer, filename);
            console.log('API: Upload successful, URL:', url);
            return NextResponse.json({ success: true, filepath: url });
        } catch (uploadError: any) {
            console.error('API: Supabase upload error:', uploadError.message);
            return NextResponse.json({ 
                error: 'Supabase upload failed', 
                details: uploadError.message 
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('API: General error:', error.message);
        return NextResponse.json({ 
            error: 'Failed to save PDF',
            details: error.message 
        }, { status: 500 });
    }
}
