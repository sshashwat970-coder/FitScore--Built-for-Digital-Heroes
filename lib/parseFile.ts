import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

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
