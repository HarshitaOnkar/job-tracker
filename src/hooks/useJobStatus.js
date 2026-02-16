import { useState, useCallback } from 'react';

const STATUS_KEY = 'jobTrackerStatus';
const HISTORY_KEY = 'jobTrackerStatusHistory';
const HISTORY_LIMIT = 20;

const STATUS_VALUES = ['Not Applied', 'Applied', 'Rejected', 'Selected'];

function readStatus() {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function readHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function useJobStatus() {
  const [statusMap, setStatusMap] = useState(readStatus);
  const [history, setHistory] = useState(readHistory);

  const getStatus = useCallback((jobId) => {
    const s = statusMap[jobId];
    return s && STATUS_VALUES.includes(s) ? s : 'Not Applied';
  }, [statusMap]);

  const setStatus = useCallback((jobId, status, jobInfo) => {
    const nextStatus = STATUS_VALUES.includes(status) ? status : 'Not Applied';
    setStatusMap((prev) => {
      const next = { ...prev, [jobId]: nextStatus };
      localStorage.setItem(STATUS_KEY, JSON.stringify(next));
      return next;
    });
    if (nextStatus !== 'Not Applied' && jobInfo) {
      setHistory((prev) => {
        const entry = {
          jobId,
          title: jobInfo.title,
          company: jobInfo.company,
          status: nextStatus,
          dateChanged: new Date().toISOString(),
        };
        const next = [entry, ...prev].slice(0, HISTORY_LIMIT);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, []);

  const getHistory = useCallback(() => readHistory(), []);

  return { getStatus, setStatus, getHistory };
}
