import jobs from '../data/jobs';
import { computeMatchScore } from './scoreEngine';

const DIGEST_PREFIX = 'jobTrackerDigest_';

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${DIGEST_PREFIX}${yyyy}-${mm}-${dd}`;
}

export function formatDigestDate(dateStr) {
  const d = new Date(dateStr + 'T09:00:00');
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Load today's digest from localStorage if it exists.
 * Returns the digest object or null.
 */
export function loadTodayDigest() {
  try {
    const raw = localStorage.getItem(todayKey());
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Generate a digest: top 10 jobs sorted by matchScore desc, then postedDaysAgo asc.
 * Persists to localStorage keyed by today's date.
 */
export function generateDigest(prefs) {
  const scored = jobs
    .map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      experience: job.experience,
      salaryRange: job.salaryRange,
      applyUrl: job.applyUrl,
      source: job.source,
      postedDaysAgo: job.postedDaysAgo,
      matchScore: computeMatchScore(job, prefs) ?? 0,
    }))
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return a.postedDaysAgo - b.postedDaysAgo;
    })
    .slice(0, 10);

  const key = todayKey();
  const dateStr = key.replace(DIGEST_PREFIX, '');

  const digest = {
    date: dateStr,
    generatedAt: new Date().toISOString(),
    jobs: scored,
  };

  localStorage.setItem(key, JSON.stringify(digest));
  return digest;
}

/**
 * Convert digest to a clean plain-text format for clipboard.
 */
export function digestToPlainText(digest) {
  const header = `Top 10 Jobs For You — 9AM Digest\n${formatDigestDate(digest.date)}\n`;
  const divider = '—'.repeat(40);

  const rows = digest.jobs.map((job, i) => {
    return [
      `${i + 1}. ${job.title}`,
      `   ${job.company} · ${job.location} · ${job.experience}`,
      `   Match: ${job.matchScore}%`,
      `   Apply: ${job.applyUrl}`,
    ].join('\n');
  });

  const footer = '\nThis digest was generated based on your preferences.';

  return [header, divider, '', ...rows, '', divider, footer].join('\n');
}

/**
 * Build a mailto: URL with digest content pre-filled.
 */
export function digestToMailtoUrl(digest) {
  const subject = encodeURIComponent('My 9AM Job Digest');
  const body = encodeURIComponent(digestToPlainText(digest));
  return `mailto:?subject=${subject}&body=${body}`;
}
