const PREFS_KEY = 'jobTrackerPreferences';
const DIGEST_PREFIX = 'jobTrackerDigest_';
const CHECKLIST_KEY = 'jobTrackerTestChecklist';
const ARTIFACTS_KEY = 'jobTrackerProofArtifacts';

function todayDigestKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${DIGEST_PREFIX}${y}-${m}-${day}`;
}

function hasPrefs() {
  try {
    return !!localStorage.getItem(PREFS_KEY);
  } catch {
    return false;
  }
}

function hasDigestToday() {
  try {
    return !!localStorage.getItem(todayDigestKey());
  } catch {
    return false;
  }
}

function allTestsPassed() {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const ids = [
      'prefs-persist', 'match-score', 'show-matches-toggle', 'save-persist',
      'apply-new-tab', 'status-persist', 'status-filter', 'digest-top-10',
      'digest-persist-day', 'no-console-errors',
    ];
    return ids.every((id) => !!parsed[id]);
  } catch {
    return false;
  }
}

function allArtifactsProvided() {
  try {
    const raw = localStorage.getItem(ARTIFACTS_KEY);
    if (!raw) return false;
    const a = JSON.parse(raw);
    const urlPattern = /^https?:\/\/.+/;
    return (
      urlPattern.test((a.lovableLink || '').trim()) &&
      urlPattern.test((a.githubLink || '').trim()) &&
      urlPattern.test((a.deployedUrl || '').trim())
    );
  } catch {
    return false;
  }
}

export function getProjectStatus() {
  const testsOk = allTestsPassed();
  const artifactsOk = allArtifactsProvided();

  if (testsOk && artifactsOk) return 'Shipped';
  if (testsOk || artifactsOk || hasPrefs()) return 'In Progress';
  return 'Not Started';
}

export function getStepStatus() {
  const prefs = hasPrefs();
  const digest = hasDigestToday();
  const tests = allTestsPassed();
  const artifacts = allArtifactsProvided();
  const step8Complete = tests && artifacts;

  return [
    { id: 1, label: 'Design system', completed: true },
    { id: 2, label: 'App shell & routes', completed: true },
    { id: 3, label: 'Landing page', completed: true },
    { id: 4, label: 'Settings & preferences', completed: prefs },
    { id: 5, label: 'Dashboard & job data', completed: true },
    { id: 6, label: 'Match scoring', completed: prefs },
    { id: 7, label: 'Digest engine', completed: digest || prefs },
    { id: 8, label: 'Test checklist & proof artifacts', completed: step8Complete },
  ];
}
