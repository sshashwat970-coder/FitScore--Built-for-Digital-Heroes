import React from 'react';

interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JDInput({ value, onChange }: JDInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="jd-text" className="text-sm font-semibold text-slate-300 font-heading">
        Job Description
      </label>
      <textarea
        id="jd-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        rows={12}
        className="w-full rounded-md border border-moss-700/30 bg-ink-0/60 p-4 text-sm text-slate-100 placeholder-slate-550 focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500 transition-colors resize-none leading-relaxed font-sans"
      />
    </div>
  );
}
