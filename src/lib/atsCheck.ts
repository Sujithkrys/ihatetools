// Pure, client-side keyword/formatting checks for the Resume & Job Match Checker.
// Deliberately limited to signals that are well-documented and defensible without
// claiming to replicate any specific company's real ATS software.

const GENERIC_STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "of", "to", "in", "on", "for",
  "with", "at", "by", "from", "as", "is", "are", "was", "were", "be", "been",
  "being", "this", "that", "these", "those", "it", "its", "we", "you", "your",
  "our", "will", "can", "may", "should", "would", "could", "have", "has",
  "had", "do", "does", "did", "not", "no", "so", "than", "then", "also",
  "into", "about", "across", "per", "etc",
]);

const JOB_AD_STOPWORDS = new Set([
  "experience", "years", "year", "team", "teams", "work", "working", "role",
  "company", "strong", "ability", "abilities", "responsible", "responsibilities",
  "requirements", "required", "preferred", "please", "including", "must",
  "knowledge", "skills", "skill", "job", "position", "candidate", "candidates",
  "opportunity", "including", "across", "environment", "environments",
  "help", "helping", "new", "join", "looking", "apply", "excellent", "good",
  "plus", "related", "similar", "etc", "within", "other", "various",
]);

const SECTION_HEADERS: { label: string; pattern: RegExp }[] = [
  { label: "Experience", pattern: /\b(work experience|professional experience|employment history|experience)\b/i },
  { label: "Education", pattern: /\beducation\b/i },
  { label: "Skills", pattern: /\b(technical skills|core skills|skills)\b/i },
  { label: "Summary", pattern: /\b(summary|profile|objective)\b/i },
];

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9+#./-]/g, "");
}

// Very light stemming so "manage / managing / managed" line up without a real NLP dependency.
function stem(word: string): string {
  const w = word.toLowerCase();
  if (w.length > 6 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 5 && w.endsWith("ied")) return w.slice(0, -3) + "y";
  if (w.length > 5 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 5 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

export interface KeywordTerm {
  term: string;
  source: "list" | "frequency";
}

// Phrases that typically introduce a list of actual skills/tools, e.g.
// "experience with React, TypeScript, and Next.js" -> ["React", "TypeScript", "Next.js"]
const TRIGGER_PHRASES = [
  /experience (?:with|in|using)/i,
  /knowledge of/i,
  /proficien(?:cy|t) (?:with|in)/i,
  /familiarity with/i,
  /familiar with/i,
  /skilled in/i,
  /expertise in/i,
  /background in/i,
  /working with/i,
];

const LEADING_STOPWORDS = /^(and|or|a|an|the|to|of|in|with|using)\s+/i;

function cleanPhrase(raw: string): string {
  let p = raw.trim().replace(/[.:;!?]+$/, "").trim();
  // strip a leading stopword that leaks in from "and Next.js" style splits
  let prev;
  do {
    prev = p;
    p = p.replace(LEADING_STOPWORDS, "").trim();
  } while (p !== prev);
  return p;
}

/**
 * Extracts candidate keywords/skills from a job description using two signals:
 * 1. Lists that directly follow a trigger phrase like "experience with X, Y, and Z",
 *    which is how most job postings actually enumerate real skills/tools.
 * 2. Frequently repeated significant words across the whole text, as a fallback.
 */
export function extractKeywords(jobText: string, maxTerms = 20): KeywordTerm[] {
  const listPhrases = new Map<string, number>();
  const lines = jobText.split(/\n+/);

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[\s\-*•·▪]+/, "").trim();
    if (!line) continue;

    for (const trigger of TRIGGER_PHRASES) {
      const match = trigger.exec(line);
      if (!match) continue;

      // Take the text after the trigger phrase, up to the end of the line/sentence.
      const tail = line.slice(match.index + match[0].length);
      const sentenceEnd = tail.search(/[.;](?:\s|$)/);
      const listText = sentenceEnd === -1 ? tail : tail.slice(0, sentenceEnd);

      const parts = listText.split(/,|\s+\/\s+|\band\b|\bor\b/i);
      for (const part of parts) {
        const cleaned = cleanPhrase(part);
        if (!cleaned) continue;
        const wordCount = cleaned.split(/\s+/).length;
        if (wordCount === 0 || wordCount > 3) continue;
        if (cleaned.length < 2 || cleaned.length > 30) continue;
        const key = cleaned.toLowerCase();
        if (GENERIC_STOPWORDS.has(key) || JOB_AD_STOPWORDS.has(key)) continue;
        listPhrases.set(cleaned, (listPhrases.get(cleaned) ?? 0) + 1);
      }
    }
  }

  const wordFreq = new Map<string, number>();
  const words = jobText.split(/\s+/);
  for (const raw of words) {
    const w = normalizeWord(raw);
    if (w.length < 3) continue;
    if (GENERIC_STOPWORDS.has(w) || JOB_AD_STOPWORDS.has(w)) continue;
    if (/^\d+$/.test(w)) continue;
    wordFreq.set(w, (wordFreq.get(w) ?? 0) + 1);
  }

  const listTerms: KeywordTerm[] = Array.from(listPhrases.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => ({ term, source: "list" as const }));

  const seen = new Set(listTerms.map((t) => t.term.toLowerCase()));
  const freqTerms: KeywordTerm[] = Array.from(wordFreq.entries())
    .filter(([w, count]) => count >= 2 && !seen.has(w))
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => ({ term, source: "frequency" as const }));

  return [...listTerms, ...freqTerms].slice(0, maxTerms);
}

export interface KeywordMatchResult {
  matched: string[];
  missing: string[];
}

export function matchKeywords(resumeText: string, terms: KeywordTerm[]): KeywordMatchResult {
  const resumeLower = resumeText.toLowerCase();
  const resumeStems = new Set(
    resumeText.split(/\s+/).map((w) => stem(normalizeWord(w))).filter(Boolean)
  );

  const matched: string[] = [];
  const missing: string[] = [];

  for (const { term } of terms) {
    const termLower = term.toLowerCase();
    const isPhrase = termLower.includes(" ");
    let found = false;

    if (isPhrase) {
      found = resumeLower.includes(termLower);
    } else {
      found = resumeStems.has(stem(termLower));
    }

    if (found) matched.push(term);
    else missing.push(term);
  }

  return { matched, missing };
}

export interface SectionCheckResult {
  label: string;
  found: boolean;
}

export function checkSectionHeaders(resumeText: string): SectionCheckResult[] {
  return SECTION_HEADERS.map(({ label, pattern }) => ({
    label,
    found: pattern.test(resumeText),
  }));
}

export function hasContactInfo(resumeText: string): { email: boolean; phone: boolean } {
  const email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText);
  const phone = /(\+?\d[\d\-\s().]{7,}\d)/.test(resumeText);
  return { email, phone };
}

export interface AtsCheckResult {
  matchScore: number;
  matched: string[];
  missing: string[];
  sections: SectionCheckResult[];
  contact: { email: boolean; phone: boolean };
}

export function runAtsCheck(resumeText: string, jobText: string): AtsCheckResult {
  const terms = extractKeywords(jobText);
  const { matched, missing } = matchKeywords(resumeText, terms);
  const total = matched.length + missing.length;
  const matchScore = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return {
    matchScore,
    matched,
    missing,
    sections: checkSectionHeaders(resumeText),
    contact: hasContactInfo(resumeText),
  };
}
