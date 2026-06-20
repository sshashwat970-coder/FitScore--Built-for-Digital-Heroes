import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: 'AI suggestions are temporarily unavailable — your match score above is unaffected (API key missing).',
        suggestions: []
      });
    }

    const { jdText, missingSkills, resumeText } = await req.json();

    if (!jdText) {
      return NextResponse.json({ error: 'Job description is required.', suggestions: [] }, { status: 400 });
    }

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume is required.', suggestions: [] }, { status: 400 });
    }

    if (!missingSkills || !Array.isArray(missingSkills) || missingSkills.length === 0) {
      return NextResponse.json({
        message: 'No missing skills identified to generate suggestions for.',
        suggestions: []
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
You are an expert technical resume writer.
Review the candidate's Resume, the Job Description, and the list of Missing Skills.
Select 3 to 5 actual, specific bullet points or sentences from the candidate's Resume that are generic, lack impact, or can be improved, and rewrite them to incorporate one or more of the missing skills.

CRITICAL: For each suggestion, the "before" field MUST contain the EXACT text of the original bullet point or sentence from the candidate's Resume so it can be automatically replaced. Do not summarize or alter the "before" text. The "after" field must contain the rewritten bullet point incorporating the skill with specific action and quantitative metrics.

Candidate Resume:
"""
${resumeText}
"""

Job Description:
"""
${jdText}
"""

Missing Skills:
${missingSkills.slice(0, 8).join(', ')}

Return ONLY a valid JSON array of objects with the following structure:
[
  {
    "skill": "Name of the missing skill being addressed",
    "before": "The EXACT bullet point or text from the candidate's resume to replace",
    "after": "The rewritten bullet point incorporating the skill with specific action and quantitative metrics"
  }
]
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    let suggestions = [];
    try {
      suggestions = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', text);
      return NextResponse.json({
        error: 'AI suggestions are temporarily unavailable — your match score above is unaffected.',
        suggestions: []
      });
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Error in AI suggestions route:', error);
    return NextResponse.json({
      error: 'AI suggestions are temporarily unavailable — your match score above is unaffected.',
      suggestions: []
    });
  }
}
