import { jsPDF } from 'jspdf';

export function exportResumeToPdf(resumeText: string, fileName = 'tailored_resume.pdf') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const margin = 20;
  const maxLineWidth = pageWidth - (margin * 2);
  let y = margin;
  const lineSpacing = 5.5; 
  const paragraphSpacing = 3; 

  const lines = resumeText.split(/\r?\n/);
  
  let isFirstLine = true;
  let isContactInfo = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const lineText = rawLine.trim();

    if (lineText === '') {
      y += paragraphSpacing;
      continue;
    }

    if (y > pageHeight - margin - 5) {
      doc.addPage();
      y = margin;
    }

    // Rule 1: First line is the Candidate's Name
    if (isFirstLine) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      
      const nameWidth = doc.getTextWidth(lineText);
      const xOffset = (pageWidth - nameWidth) / 2;
      doc.text(lineText, xOffset, y);
      y += 8;
      
      isFirstLine = false;
      isContactInfo = true; 
      continue;
    }

    // Rule 2: Contact Info formatting (usually lines containing email, phone, pipe symbol, or links)
    const isContactLine = isContactInfo && (
      lineText.includes('@') || 
      lineText.includes('|') || 
      lineText.includes('http') || 
      lineText.includes('phone') || 
      /^[0-9+()-\s]{8,}$/.test(lineText.replace(/[^0-9+]/g, ''))
    );
    
    if (isContactLine) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate-500
      
      const contactWidth = doc.getTextWidth(lineText);
      const xOffset = (pageWidth - contactWidth) / 2;
      doc.text(lineText, xOffset, y);
      y += 5;
      
      // Check if next line is also contact info, if not terminate contact info section
      const nextLine = lines[i + 1]?.trim() || '';
      const nextIsContact = nextLine.includes('@') || nextLine.includes('|') || nextLine.includes('http') || nextLine.includes('phone') || /^[0-9+()-\s]{8,}$/.test(nextLine.replace(/[^0-9+]/g, ''));
      if (!nextIsContact) {
        isContactInfo = false;
        y += 3;
      }
      continue;
    }

    doc.setTextColor(15, 23, 26); // Slate-900 for high-contrast print

    // Rule 3: Detect Section Headers (uppercase, short, or common keywords)
    const cleanHeaderPattern = /^(EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EDUCATION|PROJECTS|SKILLS|TECHNICAL SKILLS|SUMMARY|PROFESSIONAL SUMMARY|CERTIFICATIONS|ORGANIZATIONS|AWARDS)$/i;
    const isHeader = cleanHeaderPattern.test(lineText) || (lineText.toUpperCase() === lineText && lineText.length < 35 && lineText.length > 2);

    if (isHeader) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      
      if (y > margin + 5) {
        y += 4;
      }
      
      doc.text(lineText.toUpperCase(), margin, y);
      y += 1.5;
      
      doc.setDrawColor(148, 163, 184); // Slate-400 border
      doc.setLineWidth(0.25);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4.5;
      continue;
    }

    // Rule 4: Regular Body Text or Bullet Points
    const isBullet = lineText.startsWith('-') || lineText.startsWith('•') || lineText.startsWith('*');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    let displayLine = lineText;
    let textX = margin;
    let wrapWidth = maxLineWidth;

    if (isBullet) {
      const bulletChar = '•';
      displayLine = lineText.replace(/^[-•*]\s*/, '');
      
      doc.text(bulletChar, margin, y);
      textX = margin + 4; 
      wrapWidth = maxLineWidth - 4;
    }

    const wrappedSegments = doc.splitTextToSize(displayLine, wrapWidth);
    
    for (let j = 0; j < wrappedSegments.length; j++) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      
      doc.text(wrappedSegments[j], textX, y);
      y += lineSpacing;
    }
    
    y += paragraphSpacing - 1.5;
  }

  doc.save(fileName);
}
