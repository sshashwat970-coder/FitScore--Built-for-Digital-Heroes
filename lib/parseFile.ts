import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';
import { pathToFileURL } from 'url';

// Import pdfjs and ensure the worker is traced by Next.js bundler
// @ts-ignore
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
// @ts-ignore
import 'pdfjs-dist/legacy/build/pdf.worker.mjs';

if (typeof window === 'undefined') {
  try {
    const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  } catch (err) {
    console.error('Failed to configure pdfjs worker path:', err);
  }
}

export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const uint8Array = new Uint8Array(buffer);
    const parser = new PDFParse(uint8Array);
    const result = await parser.getText();
    return result.text || '';
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. The file may be corrupted or password-protected.');
  }
}

export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (error: any) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file. The file may be corrupted.');
  }
}
