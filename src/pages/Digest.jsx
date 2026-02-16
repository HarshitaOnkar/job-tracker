import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import usePreferences from '../hooks/usePreferences';
import useJobStatus from '../hooks/useJobStatus';
import { getScoreTier } from '../utils/scoreEngine';
import {
  loadTodayDigest,
  generateDigest,
  formatDigestDate,
  digestToPlainText,
  digestToMailtoUrl,
} from '../utils/digestEngine';

function formatStatusDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Digest() {
  const { prefs, hasPrefs } = usePreferences();
  const { getHistory } = useJobStatus();
  const [digest, setDigest] = useState(loadTodayDigest);
  const [copied, setCopied] = useState(false);

  const statusHistory = getHistory();

  const handleGenerate = useCallback(() => {
    const existing = loadTodayDigest();
    if (existing) {
      setDigest(existing);
    } else {
      const result = generateDigest(prefs);
      setDigest(result);
    }
    setCopied(false);
  }, [prefs]);

  const handleCopy = useCallback(async () => {
    if (!digest) return;
    try {
      await navigator.clipboard.writeText(digestToPlainText(digest));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = digestToPlainText(digest);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [digest]);

  if (!hasPrefs) {
    return (
      <div className="kn-page-container">
        <div className="kn-context-header">
          <h1>Daily Digest</h1>
          <p>A curated summary of your top matches, delivered every morning.</p>
        </div>
        <div className="kn-empty">
          <div className="kn-empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <rect x="15" y="14" width="18" height="2" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="15" y="20" width="14" height="2" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="15" y="26" width="18" height="2" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="15" y="32" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <h2>Set preferences to generate a personalized digest.</h2>
          <Link to="/settings" className="kn-btn kn-btn-primary" style={{ marginTop: 'var(--kn-space-3)' }}>
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="kn-page-container">
        <div className="kn-context-header">
          <h1>Daily Digest</h1>
          <p>A curated summary of your top matches, delivered every morning.</p>
        </div>
        <div className="kn-digest-generate">
          <button className="kn-btn kn-btn-primary" onClick={handleGenerate}>
            Generate Today's 9AM Digest (Simulated)
          </button>
          <p className="kn-digest-demo-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
          {statusHistory.length > 0 && (
            <div className="kn-digest-status-section kn-digest-status-section--standalone">
              <h3>Recent Status Updates</h3>
              <ul className="kn-status-updates-list">
                {statusHistory.map((entry, i) => (
                  <li key={`${entry.jobId}-${entry.dateChanged}-${i}`} className="kn-status-update-item">
                    <span className="kn-status-update-title">{entry.title}</span>
                    <span className="kn-status-update-company">{entry.company}</span>
                    <span className={`kn-status-badge kn-status-${entry.status.replace(/\s/g, '-').toLowerCase()}`}>
                      {entry.status}
                    </span>
                    <span className="kn-status-update-date">{formatStatusDate(entry.dateChanged)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="kn-page-container">
      <div className="kn-context-header">
        <h1>Daily Digest</h1>
        <p>A curated summary of your top matches, delivered every morning.</p>
      </div>

      <div className="kn-digest-wrapper">
        <div className="kn-digest-card">
          <div className="kn-digest-header">
            <h2>Top 10 Jobs For You — 9AM Digest</h2>
            <p className="kn-digest-date">{formatDigestDate(digest.date)}</p>
          </div>

          {digest.jobs.length === 0 ? (
            <div className="kn-digest-empty">
              <p>No matching roles today. Check again tomorrow.</p>
            </div>
          ) : (
            <div className="kn-digest-list">
              {digest.jobs.map((job, index) => (
                <div key={job.id} className="kn-digest-row">
                  <div className="kn-digest-rank">{index + 1}</div>
                  <div className="kn-digest-info">
                    <div className="kn-digest-title-row">
                      <h3>{job.title}</h3>
                      <span className={`kn-match-badge kn-match-${getScoreTier(job.matchScore)}`}>
                        {job.matchScore}%
                      </span>
                    </div>
                    <p className="kn-digest-meta">
                      {job.company} · {job.location} · {job.experience}
                    </p>
                  </div>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kn-btn kn-btn-primary kn-btn-sm"
                  >
                    Apply
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="kn-digest-footer">
            <p>This digest was generated based on your preferences.</p>
          </div>
        </div>

        <div className="kn-digest-actions">
          <button className="kn-btn kn-btn-secondary" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy Digest to Clipboard'}
          </button>
          <a className="kn-btn kn-btn-secondary" href={digestToMailtoUrl(digest)}>
            Create Email Draft
          </a>
          <button className="kn-btn kn-btn-secondary" onClick={handleGenerate}>
            Regenerate
          </button>
        </div>
        <p className="kn-digest-demo-note">Demo Mode: Daily 9AM trigger simulated manually.</p>

        {statusHistory.length > 0 && (
          <div className="kn-digest-status-section">
            <h3>Recent Status Updates</h3>
            <ul className="kn-status-updates-list">
              {statusHistory.map((entry, i) => (
                <li key={`${entry.jobId}-${entry.dateChanged}-${i}`} className="kn-status-update-item">
                  <span className="kn-status-update-title">{entry.title}</span>
                  <span className="kn-status-update-company">{entry.company}</span>
                  <span className={`kn-status-badge kn-status-${entry.status.replace(/\s/g, '-').toLowerCase()}`}>
                    {entry.status}
                  </span>
                  <span className="kn-status-update-date">{formatStatusDate(entry.dateChanged)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
