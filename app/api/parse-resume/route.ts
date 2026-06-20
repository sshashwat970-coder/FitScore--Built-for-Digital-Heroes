import { NextRequest, NextResponse } from 'next/server';
import { parsePdf, parseDocx } from '@/lib/parseFile';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
      text = await parsePdf(buffer);
    } else if (
      file.name.toLowerCase().endsWith('.docx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await parseDocx(buffer);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Only PDF and DOCX files are supported.' },
        { status: 400 }
      );
    }

    // Basic cleaning of extracted text (e.g. normalize line breaks)
    const cleanedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanedText) {
      return NextResponse.json(
        { error: 'Could not extract text from the file. Please make sure the file contains readable text.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: cleanedText });
  } catch (error: any) {
    console.error('Error in parse-resume route:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while parsing the file.' },
      { status: 500 }
    );
  }
}
