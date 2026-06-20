import { skillsTaxonomy, flatSkillsList, skillDisplayMap } from './skillsTaxonomy';

const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at",
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll",
  "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've",
  "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
  "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's",
  "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
  "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll",
  "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
  "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
  "yourself", "yourselves",
  // Boilerplate resume/job terms
  "experience", "work", "role", "team", "skills", "ability", "strong", "knowledge", "required", "responsible", "duties",
  "including", "years", "candidate", "job", "position", "description", "requirements", "qualification", "qualifications", "successful",
  "preferred", "plus", "must", "needed", "highly"
]);

function containsTerm(text: string, term: string): boolean {
  const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  // Enforce boundary only for alphanumeric starts/ends
  const startBoundary = /^[a-zA-Z0-9]/.test(term) ? '\\b' : '';
  const endBoundary = /[a-zA-Z0-9]$/.test(term) ? '\\b' : '';
  const regex = new RegExp(startBoundary + escaped + endBoundary, 'i');
  return regex.test(text);
}

function countTermOccurrences(text: string, term: string): number {
  const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const startBoundary = /^[a-zA-Z0-9]/.test(term) ? '\\b' : '';
  const endBoundary = /[a-zA-Z0-9]$/.test(term) ? '\\b' : '';
  const regex = new RegExp(startBoundary + escaped + endBoundary, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

function getTokens(text: string): string[] {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ');
  const rawWords = normalized
    .replace(/[^a-z0-9+#. -]/g, ' ')
    .split(' ')
    .map(w => w.trim())
    .filter(w => w.length > 1);

  const cleanWords = rawWords.filter(w => !STOPWORDS.has(w));

  const bigrams: string[] = [];
  for (let i = 0; i < cleanWords.length - 1; i++) {
    bigrams.push(`${cleanWords[i]} ${cleanWords[i + 1]}`);
  }

  return [...cleanWords, ...bigrams];
}

export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}

export function checkMatch(resumeText: string, jdText: string): MatchResult {
  const cleanResume = resumeText.trim();
  const cleanJD = jdText.trim();

  if (!cleanResume || !cleanJD) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      summary: "Please provide both a resume and a job description to calculate the match score."
    };
  }

  const lowerResume = cleanResume.toLowerCase();
  const lowerJD = cleanJD.toLowerCase();

  // --- Step 2: Skills Taxonomy Match ---
  const jdTaxonomySkills: { skill: string; occurrences: number }[] = [];

  skillsTaxonomy.forEach(category => {
    category.skills.forEach(skill => {
      const occurrences = countTermOccurrences(lowerJD, skill);
      if (occurrences > 0) {
        jdTaxonomySkills.push({ skill, occurrences });
      }
    });
  });

  const matchedSkillsSet = new Set<string>();
  const missingSkillsWithFreq: { skill: string; occurrences: number }[] = [];

  jdTaxonomySkills.forEach(({ skill, occurrences }) => {
    const displayName = skillDisplayMap[skill.toLowerCase()] || skill;
    if (containsTerm(lowerResume, skill)) {
      matchedSkillsSet.add(displayName);
    } else {
      missingSkillsWithFreq.push({ skill: displayName, occurrences });
    }
  });

  // Sort missing skills by frequency in JD (importance)
  missingSkillsWithFreq.sort((a, b) => b.occurrences - a.occurrences);
  const sortedMissingSkills = missingSkillsWithFreq.map(item => item.skill);

  const totalTaxonomyInJD = jdTaxonomySkills.length;
  const taxonomyMatchCount = matchedSkillsSet.size;
  const taxonomyMatchPercent = totalTaxonomyInJD > 0
    ? (taxonomyMatchCount / totalTaxonomyInJD) * 100
    : 100;

  // --- Step 3: Weighted Lexical Overlap ---
  const jdTokens = getTokens(lowerJD);
  const resumeTokensSet = new Set(getTokens(lowerResume));

  const jdTokenFreqs: Record<string, number> = {};
  jdTokens.forEach(token => {
    jdTokenFreqs[token] = (jdTokenFreqs[token] || 0) + 1;
  });

  let totalJdWeight = 0;
  let matchedJdWeight = 0;

  Object.entries(jdTokenFreqs).forEach(([token, count]) => {
    totalJdWeight += count;
    if (resumeTokensSet.has(token) || containsTerm(lowerResume, token)) {
      matchedJdWeight += count;
    }
  });

  const lexicalOverlapPercent = totalJdWeight > 0
    ? (matchedJdWeight / totalJdWeight) * 100
    : 0;

  // --- Step 4: Final Score Blending ---
  let finalScore = 0;
  if (totalTaxonomyInJD === 0) {
    finalScore = Math.round(lexicalOverlapPercent);
  } else {
    // 60/40 Blend
    finalScore = Math.round((taxonomyMatchPercent * 0.60) + (lexicalOverlapPercent * 0.40));
  }

  finalScore = Math.max(0, Math.min(100, finalScore));

  // Generate plain-English summary
  let summary = "";
  if (finalScore >= 80) {
    const strengthSkills = Array.from(matchedSkillsSet).slice(0, 3);
    summary = `Excellent match! Your resume aligns very well with the requirements.${
      strengthSkills.length > 0 ? ` It shows key strengths in ${strengthSkills.join(', ')}.` : ""
    }`;
  } else if (finalScore >= 50) {
    const strengthSkills = Array.from(matchedSkillsSet).slice(0, 3);
    const gaps = sortedMissingSkills.slice(0, 3);
    
    summary = `Good match, but there are areas for improvement.${
      strengthSkills.length > 0 ? ` You have strengths in ${strengthSkills.join(', ')}, but` : " Your resume is"
    }${gaps.length > 0 ? ` missing critical skills like ${gaps.join(', ')}.` : " missing some requirements."}`;
  } else {
    const gaps = sortedMissingSkills.slice(0, 4);
    summary = `Low match score. Your resume has significant gaps compared to the job description.${
      gaps.length > 0 ? ` Consider incorporating missing skills like ${gaps.join(', ')} to improve alignment.` : ""
    }`;
  }

  return {
    score: finalScore,
    matchedSkills: Array.from(matchedSkillsSet),
    missingSkills: sortedMissingSkills,
    summary
  };
}
