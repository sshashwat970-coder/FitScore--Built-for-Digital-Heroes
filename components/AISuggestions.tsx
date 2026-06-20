import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface Suggestion {
  skill: string;
  before: string;
  after: string;
}

interface AISuggestionsProps {
  jdText: string;
  missingSkills: string[];
}

export default function AISuggestions({ jdText, missingSkills }: AISuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    if (!jdText) return;
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
    <div className="flex flex-col gap-6 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-400 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold text-slate-100">AI Tailoring Suggestions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Optimize resume bullet points to highlight missing skills.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleGetSuggestions}
          disabled={loading || missingSkills.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-900 bg-teal-400 hover:bg-teal-350 disabled:opacity-50 disabled:hover:bg-teal-400 rounded-md shadow-sm transition-all shrink-0 cursor-pointer"
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
          <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
          <p className="text-sm text-slate-400">Analyzing skills gaps and generating tailor-made recommendations...</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-slate-950/40 border border-amber-500/20 text-slate-300 rounded-md text-sm leading-relaxed">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="flex flex-col gap-6">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex flex-col gap-3 p-5 bg-slate-950/40 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-450 border border-teal-500/20">
                  Target Skill: {suggestion.skill}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Recommendation #{index + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1.5 p-3.5 bg-slate-950/40 rounded border border-slate-850">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Original Bullet (Before)
                  </span>
                  <p className="text-xs text-slate-400 italic">
                    "{suggestion.before}"
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 p-3.5 bg-teal-950/10 rounded border border-teal-550/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-450">
                    Suggested Rewrite (After)
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    "{suggestion.after}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-xs text-slate-500">
            {missingSkills.length === 0 
              ? "All key skills are already covered in your resume! No suggestions needed." 
              : "Click 'Get AI Suggestions' above to generate optimized bullet points using Gemini."}
          </p>
        </div>
      )}
    </div>
  );
}
