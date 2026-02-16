import { Link } from 'react-router-dom';
import useTestChecklist from '../hooks/useTestChecklist';
import useProofArtifacts from '../hooks/useProofArtifacts';

export default function Proof() {
  const { allPassed } = useTestChecklist();
  const { allLinksProvided } = useProofArtifacts();
  const canShip = allPassed && allLinksProvided;

  return (
    <div className="kn-page-container">
      <div className="kn-context-header">
        <h1>Proof of Work</h1>
        <p>Collect and present artifacts that demonstrate this product works.</p>
      </div>

      <div className="kn-proof-grid">
        <div className="kn-proof-card">
          <h3>UI Built</h3>
          <p>Screenshot or recording of the completed interface.</p>
          <div className="kn-proof-placeholder">Artifact pending</div>
        </div>

        <div className="kn-proof-card">
          <h3>Logic Working</h3>
          <p>Evidence that matching and filtering function correctly.</p>
          <div className="kn-proof-placeholder">Artifact pending</div>
        </div>

        <div className="kn-proof-card">
          <h3>Test Passed</h3>
          <p>Test results or QA confirmation screenshots.</p>
          <Link to="/jt/07-test" className="kn-proof-link">Run Test Checklist</Link>
        </div>

        <div className="kn-proof-card">
          <h3>Deployed</h3>
          <p>Live URL or deployment confirmation.</p>
          <Link to="/jt/proof" className="kn-proof-link">Final Proof & Submission</Link>
          {canShip ? (
            <Link to="/jt/08-ship" className="kn-proof-link kn-proof-link--primary">Ship</Link>
          ) : (
            <span className="kn-proof-locked">{allPassed ? 'Provide all 3 artifact links in Final Proof' : 'Complete test checklist and artifact links'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
