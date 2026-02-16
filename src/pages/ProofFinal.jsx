import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useProofArtifacts from '../hooks/useProofArtifacts';
import useTestChecklist from '../hooks/useTestChecklist';
import { getStepStatus } from '../utils/projectStatus';

function formatSubmission(artifacts) {
  const lines = [
    '------------------------------------------',
    'Job Notification Tracker — Final Submission',
    '------------------------------------------',
    '',
    'Lovable Project:',
    artifacts.lovableLink || '(not provided)',
    '',
    'GitHub Repository:',
    artifacts.githubLink || '(not provided)',
    '',
    'Live Deployment:',
    artifacts.deployedUrl || '(not provided)',
    '',
    'Core Features:',
    '- Intelligent match scoring',
    '- Daily digest simulation',
    '- Status tracking',
    '- Test checklist enforced',
    '------------------------------------------',
  ];
  return lines.join('\n');
}

export default function ProofFinal() {
  const { artifacts, update, isValidUrl, allLinksProvided } = useProofArtifacts();
  const { allPassed, passedCount } = useTestChecklist();
  const [copied, setCopied] = useState(false);
  const steps = getStepStatus();

  const handleCopy = useCallback(async () => {
    const text = formatSubmission(artifacts);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [artifacts]);

  const shipped = allLinksProvided && allPassed;

  return (
    <div className="kn-page-container">
      <div className="kn-context-header">
        <h1>Project 1 — Job Notification Tracker</h1>
        <p>Final proof and submission.</p>
      </div>

      <div className="kn-proof-final-status">
        <span className={`kn-proof-badge kn-proof-badge--${shipped ? 'shipped' : allPassed ? 'progress' : 'not-started'}`}>
          {shipped ? 'Shipped' : allPassed ? 'In Progress' : 'Not Started'}
        </span>
      </div>

      <div className="kn-proof-section">
        <h2>A) Step Completion Summary</h2>
        <ul className="kn-step-list">
          {steps.map((step) => (
            <li key={step.id} className="kn-step-item">
              <span className={`kn-step-status kn-step-status--${step.completed ? 'completed' : 'pending'}`}>
                {step.completed ? 'Completed' : 'Pending'}
              </span>
              <span className="kn-step-label">Step {step.id}: {step.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="kn-proof-section">
        <h2>B) Artifact Collection Inputs</h2>
        <form className="kn-proof-form" onSubmit={(e) => e.preventDefault()}>
          <div className="kn-field">
            <label className="kn-label" htmlFor="lovable">Lovable Project Link</label>
            <input
              id="lovable"
              className={`kn-input ${artifacts.lovableLink && !isValidUrl(artifacts.lovableLink) ? 'kn-input--invalid' : ''}`}
              type="url"
              placeholder="https://..."
              value={artifacts.lovableLink}
              onChange={(e) => update('lovableLink', e.target.value)}
            />
            {artifacts.lovableLink && !isValidUrl(artifacts.lovableLink) && (
              <span className="kn-field-error">Enter a valid URL</span>
            )}
          </div>
          <div className="kn-field">
            <label className="kn-label" htmlFor="github">GitHub Repository Link</label>
            <input
              id="github"
              className={`kn-input ${artifacts.githubLink && !isValidUrl(artifacts.githubLink) ? 'kn-input--invalid' : ''}`}
              type="url"
              placeholder="https://github.com/..."
              value={artifacts.githubLink}
              onChange={(e) => update('githubLink', e.target.value)}
            />
            {artifacts.githubLink && !isValidUrl(artifacts.githubLink) && (
              <span className="kn-field-error">Enter a valid URL</span>
            )}
          </div>
          <div className="kn-field">
            <label className="kn-label" htmlFor="deployed">Deployed URL (Vercel or equivalent)</label>
            <input
              id="deployed"
              className={`kn-input ${artifacts.deployedUrl && !isValidUrl(artifacts.deployedUrl) ? 'kn-input--invalid' : ''}`}
              type="url"
              placeholder="https://..."
              value={artifacts.deployedUrl}
              onChange={(e) => update('deployedUrl', e.target.value)}
            />
            {artifacts.deployedUrl && !isValidUrl(artifacts.deployedUrl) && (
              <span className="kn-field-error">Enter a valid URL</span>
            )}
          </div>
        </form>
      </div>

      <div className="kn-proof-requirements">
        <p className="kn-proof-requirement">
          Tests: {passedCount} / 10 {allPassed ? '✓' : '— complete checklist'}
        </p>
        <p className="kn-proof-requirement">
          Links: {[artifacts.lovableLink, artifacts.githubLink, artifacts.deployedUrl].filter(Boolean).length} / 3 {allLinksProvided ? '✓' : '— provide all'}
        </p>
      </div>

      <div className="kn-proof-actions">
        <button className="kn-btn kn-btn-primary" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy Final Submission'}
        </button>
        {allPassed && (
          <Link to="/jt/08-ship" className="kn-btn kn-btn-secondary">
            Go to Ship
          </Link>
        )}
        {!allPassed && (
          <Link to="/jt/07-test" className="kn-btn kn-btn-secondary">
            Go to Test Checklist
          </Link>
        )}
      </div>
    </div>
  );
}
