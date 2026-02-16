import { useState, useCallback } from 'react';

const STORAGE_KEY = 'kn_saved_jobs';

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function useSavedJobs() {
  const [savedIds, setSavedIds] = useState(readSaved);

  const save = useCallback((id) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const unsave = useCallback((id) => {
    setSavedIds((prev) => {
      const next = prev.filter((i) => i !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((id) => savedIds.includes(id), [savedIds]);

  return { savedIds, save, unsave, isSaved };
}
