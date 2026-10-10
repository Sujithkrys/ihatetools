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
  "deliver", "delivery", "delivering", "iterate", "iterating", "iteration",
  "prioritise", "prioritize", "prioritizing", "prioritising", "ship", "shipping",
  "launch", "launching", "stakeholder", "stakeholders", "drive", "driving",
  "define", "defining", "partner", "partnering", "collaborate", "collaborating",
  "collaboration", "cross-functional", "leadership", "lead", "leading", "leads",
  "manage", "managing", "own", "owning", "ownership", "track", "record",
  "comfortable", "fluent", "hands-on", "deep", "understanding", "equivalent",
  "bachelor", "bachelors", "degree", "field", "someone", "who", "they", "their",
  "them", "while", "where", "when", "what", "how", "why",
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
  /experience (?:with|in|using|building|leading|shipping|managing|driving|owning)/i,
  /(?:deep |working |solid )?(?:knowledge|understanding) of/i,
  /proficien(?:cy|t) (?:with|in)/i,
  /familiarity with/i,
  /familiar with/i,
  /skilled in/i,
  /expertise in/i,
  /expert (?:in|with)/i,
  /background in/i,
  /working with/i,
  /comfortable with/i,
  /fluent in/i,
  /hands-on (?:with|experience)/i,
  /exposure to/i,
  /track record (?:of|with)/i,
];

// Headings that introduce a dense skills/requirements list, where every subsequent
// short line can be treated as a bare phrase list even without a trigger phrase.
const LIST_SECTION_HEADING = /^(requirements?|qualifications?|skills?|what you(?:'|’)ll bring|what we(?:'|’)re looking for|you have|must have|nice to have|responsibilities)s?:?\s*$/i;

const LEADING_STOPWORDS = /^(and|or|a|an|the|to|of|in|with|using)\s+/i;

function cleanPhrase(raw: string): string {
  let p = raw.trim().replace(/[.:;!?]+$/, "").trim();
  // strip a leading stopword that leaks in from "and Next.js" style splits
  let prev;
  do {
    prev = p;
    p = p.replace(LEADING_STOPWORDS, "").trim();
  } while (p !== prev);
  // drop stray unmatched brackets left over from splitting mid-parenthetical,
  // e.g. "equivalent)" from "...or equivalent)"
  const opens = (p.match(/[([{]/g) ?? []).length;
  const closes = (p.match(/[)\]}]/g) ?? []).length;
  if (opens !== closes) return "";
  return p;
}

/**
 * Extracts candidate keywords/skills from a job description using two signals:
 * 1. Lists that directly follow a trigger phrase like "experience with X, Y, and Z",
 *    which is how most job postings actually enumerate real skills/tools.
 * 2. Frequently repeated significant words across the whole text, as a fallback.
 */
function addPhrase(map: Map<string, number>, part: string) {
  const cleaned = cleanPhrase(part);
  if (!cleaned) return;
  const wordCount = cleaned.split(/\s+/).length;
  if (wordCount === 0 || wordCount > 4) return;
  if (cleaned.length < 2 || cleaned.length > 35) return;
  const key = cleaned.toLowerCase();
  if (GENERIC_STOPWORDS.has(key) || JOB_AD_STOPWORDS.has(key)) return;
  map.set(cleaned, (map.get(cleaned) ?? 0) + 1);
}

export function extractKeywords(jobText: string, maxTerms = 20): KeywordTerm[] {
  const listPhrases = new Map<string, number>();
  const lines = jobText.split(/\n+/);

  let inListSection = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[\s\-*•·▪]+/, "").trim();
    if (!line) continue;

    if (LIST_SECTION_HEADING.test(line)) {
      inListSection = true;
      continue;
    }
    // A long, sentence-like line (ends in a period, has 15+ words) signals we've
    // left a bullet-list section and are back in prose.
    const wordCount = line.split(/\s+/).length;
    if (wordCount > 18) {
      inListSection = false;
    }

    let matchedTrigger = false;
    for (const trigger of TRIGGER_PHRASES) {
      const match = trigger.exec(line);
      if (!match) continue;
      matchedTrigger = true;

      // Take the text after the trigger phrase, up to the end of the line/sentence.
      const tail = line.slice(match.index + match[0].length);
      const sentenceEnd = tail.search(/[.;](?:\s|$)/);
      const listText = sentenceEnd === -1 ? tail : tail.slice(0, sentenceEnd);

      const parts = listText.split(/,|\s+\/\s+|\band\b|\bor\b/i);
      for (const part of parts) addPhrase(listPhrases, part);
    }

    // Inside a known requirements/skills section, treat short bullet lines as a
    // bare phrase list even without a trigger verb, this is how most postings
    // actually format their skill lists ("- RESTful APIs, webhooks, OEM tooling").
    if (!matchedTrigger && inListSection && wordCount <= 14) {
      const parts = line.split(/,|\s+\/\s+|\band\b|\bor\b/i);
      for (const part of parts) addPhrase(listPhrases, part);
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
  // PDF text extraction sometimes inserts stray spaces around punctuation
  // (e.g. "jane.doe @ example . com") depending on how the glyphs were laid
  // out in the original file, so tolerate optional whitespace around @ and the dot.
  const email = /[a-z0-9._%+-]+\s*@\s*[a-z0-9.-]+\s*\.\s*[a-z]{2,}/i.test(resumeText);
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
