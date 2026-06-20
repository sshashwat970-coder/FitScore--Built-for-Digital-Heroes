import React, { useRef, useState } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ResumeInput({ value, onChange }: ResumeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse file');
      }

      onChange(data.text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while uploading the file.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor="resume-text" className="text-sm font-semibold text-slate-300 font-heading">
          Resume Content
        </label>
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-350 hover:text-white border border-moss-700/30 bg-moss-950/20 hover:bg-moss-700/15 rounded-md transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-moss-500" />
          ) : (
            <Upload className="h-3.5 w-3.5 text-moss-500" />
          )}
          {loading ? 'Processing...' : 'Upload PDF or DOCX'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx"
          className="hidden"
        />
      </div>

      <div className="relative">
        <textarea
          id="resume-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste resume content here, or upload a PDF/DOCX file above..."
          rows={12}
          className="w-full rounded-md border border-moss-700/30 bg-ink-0/60 p-4 text-sm text-slate-100 placeholder-slate-550 focus:border-moss-500 focus:outline-none focus:ring-1 focus:ring-moss-500 transition-colors resize-none leading-relaxed font-sans"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-400 mt-1 bg-red-950/30 border border-red-900/50 p-2.5 rounded-md">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
