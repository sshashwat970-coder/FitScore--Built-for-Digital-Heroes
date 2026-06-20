import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface KeywordChipsProps {
  matchedSkills: string[];
  missingSkills: string[];
}

export default function KeywordChips({ matchedSkills, missingSkills }: KeywordChipsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Matched Skills */}
      <div className="flex flex-col gap-3 p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-pulse" />
            Matched Skills ({matchedSkills.length})
          </h3>
        </div>
        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
            {matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No matching taxonomy skills detected.</p>
        )}
      </div>

      {/* Missing Skills */}
      <div className="flex flex-col gap-3 p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-400" />
            Missing Skills ({missingSkills.length})
          </h3>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            Ranked by relevance
          </span>
        </div>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No missing skills detected. Perfect alignment!</p>
        )}
      </div>
    </div>
  );
}
