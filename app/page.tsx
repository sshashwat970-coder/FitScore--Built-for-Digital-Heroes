'use client';

import React, { useState } from 'react';
import ResumeInput from '@/components/ResumeInput';
import JDInput from '@/components/JDInput';
import ResultsPanel from '@/components/ResultsPanel';
import AISuggestions from '@/components/AISuggestions';
import SiteFooter from '@/components/SiteFooter';
import { checkMatch, MatchResult } from '@/lib/matchEngine';
import { Briefcase, CheckCircle } from 'lucide-react';

export default function Home() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCheckMatch = () => {
    if (!resumeText.trim() || !jdText.trim()) return;

    setIsCalculating(true);
    // Simulate a brief calculation delay for visual feedback of matching action
    setTimeout(() => {
      const result = checkMatch(resumeText, jdText);
      setMatchResult(result);
      setIsCalculating(false);
      
      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        resultsEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 400);
  };

  const isFormValid = resumeText.trim().length > 0 && jdText.trim().length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white py-6 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/10 p-2 rounded-lg border border-teal-500/20">
              <Briefcase className="h-6 w-6 text-teal-450" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">FitScore</h1>
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
                Made for Digital Heroes
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-350">
              Deterministic Matching Engine v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        
        {/* Intro */}
        <div className="max-w-3xl flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Compare Resume and Job Description
          </h2>
          <p className="text-sm text-slate-650 leading-relaxed">
            Upload your resume in PDF/DOCX format or paste as plain text. Paste the target job description to instantly analyze match percentage, identify key skills gaps, and get optimization rewrite suggestions.
          </p>
        </div>

        {/* Workspace Card */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ResumeInput value={resumeText} onChange={setResumeText} />
            <JDInput value={jdText} onChange={setJdText} />
          </div>

          <div className="flex justify-center border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={handleCheckMatch}
              disabled={!isFormValid || isCalculating}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-teal-600 hover:bg-teal-550 disabled:opacity-50 disabled:hover:bg-teal-600 rounded-lg shadow-md transition-all duration-150 cursor-pointer min-w-[200px]"
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
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
