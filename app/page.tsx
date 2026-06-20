'use client';

import React, { useState } from 'react';
import ResumeInput from '@/components/ResumeInput';
import JDInput from '@/components/JDInput';
import ResultsPanel from '@/components/ResultsPanel';
import AISuggestions from '@/components/AISuggestions';
import SiteFooter from '@/components/SiteFooter';
import { checkMatch, MatchResult } from '@/lib/matchEngine';
import { exportResumeToPdf } from '@/lib/pdfExporter';
import { Briefcase, CheckCircle, Download } from 'lucide-react';

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCheckMatch = () => {
    if (!resumeText.trim() || !jdText.trim()) return;

    setIsCalculating(true);
    setTimeout(() => {
      const result = checkMatch(resumeText, jdText);
      setMatchResult(result);
      setIsCalculating(false);
      
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        resultsEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 400);
  };

  const handleApplySuggestion = (before: string, after: string) => {
    const index = resumeText.toLowerCase().indexOf(before.toLowerCase());
    if (index !== -1) {
      const updatedText = 
        resumeText.substring(0, index) + 
        after + 
        resumeText.substring(index + before.length);
      
      setResumeText(updatedText);
      
      // Auto-recalculate match scores immediately
      const result = checkMatch(updatedText, jdText);
      setMatchResult(result);
    }
  };

  const handleExportPdf = () => {
    if (!resumeText.trim()) return;
    exportResumeToPdf(resumeText, 'tailored_resume.pdf');
  };

  const isFormValid = resumeText.trim().length > 0 && jdText.trim().length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-ink-0 text-slate-100">
      {/* Header */}
      <header className="bg-ink-0 border-b border-moss-700/15 py-7 shadow-sm z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-moss-700/10 p-2 rounded-lg border border-moss-500/15">
              <Briefcase className="h-6 w-6 text-moss-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white font-heading">FitScore</h1>
              <p className="text-[10px] font-bold tracking-wider uppercase text-moss-500 mt-0.5 font-sans">
                Made for Digital Heroes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-moss-950/40 border border-moss-700/20 text-moss-500/80">
              Engine v1.0
            </span>
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-moss-600 hover:bg-moss-500 transition-colors rounded shadow-sm tracking-wide"
            >
              Built for Digital Heroes
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        
        {/* Intro */}
        <div className="max-w-3xl flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-heading">
            Tailor Your Resume For The Perfect Match
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            Upload your resume (PDF/DOCX) or paste plain text. Compare it against the target job description to instantly analyze match percentage, highlight critical skill gaps, and get optimizations.
          </p>
        </div>

        {/* Workspace Card (Glass container) */}
        <div className="glass rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResumeInput value={resumeText} onChange={setResumeText} />
            <JDInput value={jdText} onChange={setJdText} />
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-moss-700/15 pt-6">
            <button
              type="button"
              onClick={handleCheckMatch}
              disabled={!isFormValid || isCalculating}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-moss-600 hover:bg-moss-500 disabled:opacity-50 disabled:hover:bg-moss-600 rounded-lg shadow-md transition-all cursor-pointer min-w-[200px]"
            >
              {isCalculating ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Check Match
                </>
              )}
            </button>

            {resumeText.trim().length > 0 && (
              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-slate-200 hover:text-white border border-moss-700/40 bg-moss-950/20 hover:bg-moss-700/15 rounded-lg shadow-md transition-all cursor-pointer min-w-[200px]"
              >
                <Download className="h-5 w-5 text-moss-500" />
                Export Resume (PDF)
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        {matchResult && (
          <div id="results-section" className="scroll-mt-6">
            <ResultsPanel
              score={matchResult.score}
              matchedSkills={matchResult.matchedSkills}
              missingSkills={matchResult.missingSkills}
              summary={matchResult.summary}
            />
            
            <AISuggestions 
              jdText={jdText} 
              missingSkills={matchResult.missingSkills} 
              resumeText={resumeText}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
