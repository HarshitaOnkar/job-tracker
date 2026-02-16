import { useState, useCallback } from 'react';

const STORAGE_KEY = 'jobTrackerPreferences';

const DEFAULT_PREFS = {
  roleKeywords: '',
  preferredLocations: [],
  preferredModes: [],
  experienceLevel: '',
  skills: '',
  minMatchScore: 40,
};

function readPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export default function usePreferences() {
  const [prefs, setPrefs] = useState(readPrefs);

  const savePrefs = useCallback((newPrefs) => {
    const merged = { ...DEFAULT_PREFS, ...newPrefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    setPrefs(merged);
  }, []);

  const hasPrefs = prefs !== null;

  return { prefs, savePrefs, hasPrefs };
}
