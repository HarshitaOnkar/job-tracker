import { useState, useCallback } from 'react';

const STORAGE_KEY = 'jobTrackerTestChecklist';

const TEST_IDS = [
  'prefs-persist',
  'match-score',
  'show-matches-toggle',
  'save-persist',
  'apply-new-tab',
  'status-persist',
  'status-filter',
  'digest-top-10',
  'digest-persist-day',
  'no-console-errors',
];

function readChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return TEST_IDS.reduce((acc, id) => {
      acc[id] = !!parsed[id];
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export default function useTestChecklist() {
  const [checks, setChecks] = useState(readChecklist);

  const isChecked = useCallback((id) => !!checks[id], [checks]);

  const setChecked = useCallback((id, value) => {
    setChecks((prev) => {
      const next = { ...prev, [id]: !!value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggle = useCallback((id) => {
    setChecked(id, !checks[id]);
  }, [checks, setChecked]);

  const passedCount = TEST_IDS.filter((id) => checks[id]).length;
  const allPassed = passedCount === 10;

  const reset = useCallback(() => {
    const empty = TEST_IDS.reduce((acc, id) => {
      acc[id] = false;
      return acc;
    }, {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    setChecks(empty);
  }, []);

  return { checks, isChecked, setChecked, toggle, passedCount, allPassed, reset, TEST_IDS };
}
