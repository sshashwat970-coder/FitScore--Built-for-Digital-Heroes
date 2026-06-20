import React from 'react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p className="text-sm font-semibold text-white">Shashwat Singh</p>
            <a 
              href="mailto:sshashwat970@gmail.com" 
              className="text-xs text-slate-400 hover:text-teal-400 transition-colors"
            >
              sshashwat970@gmail.com
            </a>
          </div>
          <div className="flex items-center">
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-slate-900 bg-teal-400 hover:bg-teal-350 transition-colors rounded-md font-semibold shadow-sm"
            >
              Built for Digital Heroes
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
