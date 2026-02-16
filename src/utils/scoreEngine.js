/**
 * KodNest Match Score Engine
 *
 * Deterministic scoring: each rule adds to the total, capped at 100.
 *
 * +25  any roleKeyword appears in job.title (case-insensitive)
 * +15  any roleKeyword appears in job.description (case-insensitive)
 * +15  job.location matches any preferredLocation
 * +10  job.mode matches any preferredMode
 * +10  job.experience matches experienceLevel
 * +15  any overlap between job.skills and user.skills
 * +5   postedDaysAgo <= 2
 * +5   source is LinkedIn
 */

function normalize(str) {
  return str.toLowerCase().trim();
}

function splitComma(str) {
  if (!str) return [];
  return str.split(',').map((s) => s.trim()).filter(Boolean);
}

export function computeMatchScore(job, prefs) {
  if (!prefs) return null;

  const roleKeywords = splitComma(prefs.roleKeywords).map(normalize);
  const prefLocations = (prefs.preferredLocations || []).map(normalize);
  const prefModes = (prefs.preferredModes || []).map(normalize);
  const prefExperience = normalize(prefs.experienceLevel || '');
  const userSkills = splitComma(prefs.skills).map(normalize);

  const hasAnyPref =
    roleKeywords.length > 0 ||
    prefLocations.length > 0 ||
    prefModes.length > 0 ||
    prefExperience ||
    userSkills.length > 0;

  if (!hasAnyPref) return null;

  let score = 0;

  const titleLower = normalize(job.title);
  const descLower = normalize(job.description);

  if (roleKeywords.length > 0 && roleKeywords.some((kw) => titleLower.includes(kw))) {
    score += 25;
  }

  if (roleKeywords.length > 0 && roleKeywords.some((kw) => descLower.includes(kw))) {
    score += 15;
  }

  if (prefLocations.length > 0 && prefLocations.includes(normalize(job.location))) {
    score += 15;
  }

  if (prefModes.length > 0 && prefModes.includes(normalize(job.mode))) {
    score += 10;
  }

  if (prefExperience && normalize(job.experience) === prefExperience) {
    score += 10;
  }

  if (userSkills.length > 0) {
    const jobSkillsLower = job.skills.map(normalize);
    if (userSkills.some((s) => jobSkillsLower.includes(s))) {
      score += 15;
    }
  }

  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  if (normalize(job.source) === 'linkedin') {
    score += 5;
  }

  return Math.min(score, 100);
}

export function getScoreTier(score) {
  if (score === null) return 'none';
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'low';
  return 'minimal';
}

export function extractSalaryNumeric(salaryRange) {
  const match = salaryRange.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
