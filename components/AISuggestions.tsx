import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Check } from 'lucide-react';

interface Suggestion {
  skill: string;
  before: string;
  after: string;
}

interface AISuggestionsProps {
  jdText: string;
  missingSkills: string[];
  resumeText: string;
  onApplySuggestion?: (before: string, after: string) => void;
}

export default function AISuggestions({ 
  jdText, 
  missingSkills, 
  resumeText,
  onApplySuggestion 
}: AISuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    if (!jdText || !resumeText) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const res = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jdText,
          missingSkills,
          resumeText
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setError('AI suggestions are temporarily unavailable — your match score above is unaffected.');
      }
    } catch (err: any) {
      console.error(err);
      setError('AI suggestions are temporarily unavailable — your match score above is unaffected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 glass border border-moss-700/15 rounded-xl shadow-lg mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-moss-750">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-moss-500 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-heading">AI Tailoring Suggestions</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Optimize resume bullet points to highlight missing skills.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGetSuggestions}
          disabled={loading || missingSkills.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-moss-600 hover:bg-moss-500 disabled:opacity-50 disabled:hover:bg-moss-600 rounded-md shadow-sm transition-all shrink-0 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Get AI Suggestions
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-moss-500" />
          <p className="text-sm text-slate-400 font-sans">Analyzing skills gaps and generating tailor-made recommendations...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-slate-950/40 border border-amber-500/20 text-slate-350 rounded-md text-sm leading-relaxed font-sans">
          <AlertCircle className="h-5 w-5 text-amber-550 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="flex flex-col gap-6">
          {suggestions.map((suggestion, index) => {
            const beforeClean = suggestion.before.trim();
            const afterClean = suggestion.after.trim();
            
            const isApplied = afterClean && resumeText.includes(afterClean);
            const hasBefore = beforeClean && resumeText.toLowerCase().includes(beforeClean.toLowerCase());
            
            return (
              <div key={index} className="flex flex-col gap-3 p-5 glass-soft border border-moss-700/15 rounded-lg shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-moss-700/15 text-moss-500 border border-moss-700/25 self-start">
                    Target Skill: {suggestion.skill}
                  </span>
                  
                  {isApplied ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-moss-500 bg-moss-500/10 px-2.5 py-1 rounded border border-moss-500/20">
                      <Check className="h-3.5 w-3.5" />
                      Applied
                    </span>
                  ) : hasBefore ? (
                    <button
                      type="button"
                      onClick={() => onApplySuggestion?.(suggestion.before, suggestion.after)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-moss-600 hover:bg-moss-500 rounded transition-colors shadow-sm cursor-pointer self-start"
                    >
                      Apply Rewrite
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-950/40 px-2.5 py-1 rounded border border-slate-900 self-start">
                      Original Text Modified
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1.5 p-3.5 bg-slate-950/60 rounded border border-slate-900/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                      Original Bullet (Before)
                    </span>
                    <p className="text-xs text-slate-400 italic font-sans leading-relaxed">
                      "{suggestion.before}"
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 p-3.5 bg-moss-950/15 rounded border border-moss-500/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-moss-500 font-sans">
                      Suggested Rewrite (After)
                    </span>
                    <p className="text-xs text-slate-200 font-medium font-sans leading-relaxed">
                      "{suggestion.after}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-xs text-slate-500 font-sans">
            {missingSkills.length === 0 
              ? "All key skills are already covered in your resume! No suggestions needed." 
              : "Click 'Get AI Suggestions' above to generate optimized bullet points using Gemini."}
          </p>
        </div>
      )}
    </div>
  );
}
