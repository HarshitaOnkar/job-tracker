import { useEffect } from 'react';

export default function JobModal({ job, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!job) return null;

  return (
    <div className="kn-modal-overlay" onClick={onClose}>
      <div className="kn-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="kn-modal-header">
          <div>
            <h2>{job.title}</h2>
            <p className="kn-modal-company">{job.company} · {job.location} · {job.mode}</p>
          </div>
          <button className="kn-modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="kn-modal-body">
          <div className="kn-modal-section">
            <h4>Description</h4>
            <p className="kn-modal-description">{job.description}</p>
          </div>

          <div className="kn-modal-section">
            <h4>Skills</h4>
            <div className="kn-skills-list">
              {job.skills.map((skill) => (
                <span key={skill} className="kn-skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="kn-modal-details">
            <div className="kn-modal-detail">
              <span className="kn-modal-detail-label">Experience</span>
              <span>{job.experience}</span>
            </div>
            <div className="kn-modal-detail">
              <span className="kn-modal-detail-label">Salary</span>
              <span>{job.salaryRange}</span>
            </div>
            <div className="kn-modal-detail">
              <span className="kn-modal-detail-label">Source</span>
              <span>{job.source}</span>
            </div>
          </div>
        </div>

        <div className="kn-modal-footer">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="kn-btn kn-btn-primary"
          >
            Apply Now
          </a>
          <button className="kn-btn kn-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
