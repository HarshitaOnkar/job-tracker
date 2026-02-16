import { useState, useCallback } from 'react';

const STORAGE_KEY = 'jobTrackerProofArtifacts';

const URL_PATTERN = /^https?:\/\/.+/;

function isValidUrl(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  return URL_PATTERN.test(trimmed);
}

function readArtifacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lovableLink: '', githubLink: '', deployedUrl: '' };
    return JSON.parse(raw);
  } catch {
    return { lovableLink: '', githubLink: '', deployedUrl: '' };
  }
}

export default function useProofArtifacts() {
  const [artifacts, setArtifacts] = useState(readArtifacts);

  const update = useCallback((key, value) => {
    setArtifacts((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const lovableValid = isValidUrl(artifacts.lovableLink);
  const githubValid = isValidUrl(artifacts.githubLink);
  const deployedValid = isValidUrl(artifacts.deployedUrl);

  const allLinksProvided = lovableValid && githubValid && deployedValid;

  return {
    artifacts,
    update,
    isValidUrl,
    lovableValid,
    githubValid,
    deployedValid,
    allLinksProvided,
  };
}
