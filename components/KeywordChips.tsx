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
      <div className="flex flex-col gap-3 p-5 glass border border-moss-700/15 rounded-xl shadow-sm">
        <div className="flex items-center justify-between border-b border-moss-750 pb-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 font-heading">
            <CheckCircle2 className="h-4 w-4 text-moss-500 animate-pulse" />
            Matched Skills ({matchedSkills.length})
          </h3>
        </div>
        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
            {matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-moss-700/15 text-moss-500 border border-moss-700/25 hover:bg-moss-700/20 transition-colors"
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
      <div className="flex flex-col gap-3 p-5 glass border border-moss-700/15 rounded-xl shadow-sm">
        <div className="flex items-center justify-between border-b border-moss-750 pb-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 font-heading">
            <XCircle className="h-4 w-4 text-red-400" />
            Missing Skills ({missingSkills.length})
          </h3>
          <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider font-sans">
            Ranked by relevance
          </span>
        </div>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-950/25 transition-colors"
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
