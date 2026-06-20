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

    const { jdText, missingSkills } = await req.json();

    if (!jdText) {
      return NextResponse.json({ error: 'Job description is required.', suggestions: [] }, { status: 400 });
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
Review the following Job Description and the list of Missing Skills that were identified as gaps in the candidate's resume.
Generate 3 to 5 concrete, highly specific, and actionable resume bullet-point rewrite suggestions.
Each suggestion should demonstrate how the candidate could incorporate one or more of the missing skills by showing a "Before" (generic version) and "After" (tailored, impact-driven version using the STAR method: Situation, Task, Action, Result) rewrite.

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
    "before": "A plausible generic resume bullet point",
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
    // Graceful degradation for quota exceed, model unavailable, network issue, etc.
    return NextResponse.json({
      error: 'AI suggestions are temporarily unavailable — your match score above is unaffected.',
      suggestions: []
    });
  }
}
