import React from 'react';
import ScoreGauge from './ScoreGauge';
import KeywordChips from './KeywordChips';
import { FileText } from 'lucide-react';

interface ResultsPanelProps {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}

export default function ResultsPanel({
  score,
  matchedSkills,
  missingSkills,
  summary
}: ResultsPanelProps) {
  const totalSkillsCount = matchedSkills.length + missingSkills.length;
  const coveragePercent = totalSkillsCount > 0 
    ? Math.round((matchedSkills.length / totalSkillsCount) * 100) 
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
        <FileText className="h-5 w-5 text-teal-450" />
        <h2 className="text-lg font-bold text-slate-100">Match Analysis</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 shrink-0">
          <ScoreGauge score={score} />
        </div>

        <div className="flex-1 flex flex-col justify-between p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Executive Summary
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {summary}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-850 pt-4 flex flex-col gap-2 text-xs text-slate-400">
            <div className="flex justify-between items-center">
              <span>Overall Skill Coverage:</span>
              <span className="font-semibold text-slate-200">
                {matchedSkills.length} of {totalSkillsCount} skills ({coveragePercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-855 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-teal-450 h-full rounded-full transition-all duration-1000"
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <KeywordChips matchedSkills={matchedSkills} missingSkills={missingSkills} />
    </div>
  );
}
