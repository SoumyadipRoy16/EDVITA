// app/api/save-pdf/route.ts
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { uploadToSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `allocation_${Date.now()}.pdf`;

        if (process.env.NODE_ENV === 'production') {
            const url = await uploadToSupabase(buffer, filename);
            return NextResponse.json({ success: true, filepath: url });
        } else {
            const filepath = path.join(process.cwd(), 'public', 'pdfs', filename);
            await writeFile(filepath, buffer);
            return NextResponse.json({ success: true, filepath: `/pdfs/${filename}` });
        }
    } catch (error) {
        console.error('Error saving PDF:', error);
        return NextResponse.json({ error: 'Failed to save PDF' }, { status: 500 });
    }
}