import React from 'react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-moss-700/20 bg-ink-0 text-slate-400 py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-1.5 md:items-start">
            <p className="text-sm font-semibold tracking-tight text-white font-heading">Shashwat Singh</p>
            <a 
              href="mailto:sshashwat970@gmail.com" 
              className="text-xs text-moss-500 hover:text-amber-500 transition-colors font-medium"
            >
              sshashwat970@gmail.com
            </a>
          </div>
          <div className="flex items-center">
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-moss-600 hover:bg-moss-500 transition-colors rounded shadow-md tracking-wide"
            >
              Built for Digital Heroes
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
