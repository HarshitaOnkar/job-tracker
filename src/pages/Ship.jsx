import { Link } from 'react-router-dom';
import useTestChecklist from '../hooks/useTestChecklist';
import useProofArtifacts from '../hooks/useProofArtifacts';
import { getProjectStatus } from '../utils/projectStatus';

export default function Ship() {
  const { allPassed, passedCount } = useTestChecklist();
  const { allLinksProvided } = useProofArtifacts();
  const status = getProjectStatus();

  const shipped = allPassed && allLinksProvided;

  if (!shipped) {
    const needsTests = !allPassed;
    const needsLinks = !allLinksProvided;

    return (
      <div className="kn-page-container">
        <div className="kn-context-header">
          <h1>Ship</h1>
          <p>Deploy when all conditions are met.</p>
        </div>

        <div className="kn-ship-status-badge-wrap">
          <span className={`kn-proof-badge kn-proof-badge--${status.toLowerCase().replace(/\s/g, '-')}`}>
            {status}
          </span>
        </div>

        <div className="kn-ship-locked">
          <div className="kn-ship-locked-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="20" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 20V14a4 4 0 0 1 8 0v6M24 28v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2>Locked</h2>
          <p>Complete all 10 test checklist items and provide all 3 artifact links before shipping.</p>
          <div className="kn-ship-progress-wrap">
            <p className="kn-ship-progress">Tests: {passedCount} / 10 {allPassed ? '✓' : ''}</p>
            <p className="kn-ship-progress">Links: {allLinksProvided ? '3 / 3 ✓' : 'Provide Lovable, GitHub, and Deployed URL in Final Proof'}</p>
          </div>
          <div className="kn-ship-actions">
            {needsTests && (
              <Link to="/jt/07-test" className="kn-btn kn-btn-primary">
                Go to Test Checklist
              </Link>
            )}
            {needsLinks && (
              <Link to="/jt/proof" className="kn-btn kn-btn-secondary">
                Go to Final Proof
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kn-page-container">
      <div className="kn-context-header">
        <h1>Ship</h1>
        <p>All conditions met.</p>
      </div>

      <div className="kn-ship-status-badge-wrap">
        <span className="kn-proof-badge kn-proof-badge--shipped">Shipped</span>
      </div>

      <div className="kn-ship-unlocked">
        <p className="kn-ship-success">Project 1 Shipped Successfully.</p>
      </div>
    </div>
  );
}
