import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easedProgress = progress * (2 - progress); // Ease out quad
      const nextValue = Math.round(easedProgress * score);
      
      setAnimatedScore(nextValue);

      if (currentStep >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let scoreColorClass = 'text-red-400';
  let strokeColor = '#f87171'; // Red-400

  if (animatedScore >= 80) {
    scoreColorClass = 'text-moss-500';
    strokeColor = '#6fa37a'; // Moss-500
  } else if (animatedScore >= 50) {
    scoreColorClass = 'text-amber-500';
    strokeColor = '#cd8a4b'; // Amber-500
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 glass border border-moss-700/15 rounded-xl shadow-lg">
      <div className="relative flex items-center justify-center h-40 w-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="stroke-slate-900"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx="80"
            cy="80"
          />
          <circle
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx="80"
            cy="80"
            className="transition-all duration-75 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold tracking-tight font-heading ${scoreColorClass}`}>
            {animatedScore}%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5 font-sans">
            Fit Score
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
          score >= 80 ? 'text-moss-500 border-moss-700/20 bg-moss-600/5' : 
          score >= 50 ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 
          'text-red-400 border-red-500/20 bg-red-500/5'
        }`}>
          {score >= 80 ? 'Highly Aligned' : score >= 50 ? 'Moderate Fit' : 'Low Alignment'}
        </span>
      </div>
    </div>
  );
}
