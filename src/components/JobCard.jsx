import { memo } from 'react';
import { getScoreTier } from '../utils/scoreEngine';

const STATUS_OPTIONS = ['Not Applied', 'Applied', 'Rejected', 'Selected'];

function formatPosted(days) {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function JobCard({ job, matchScore, isSaved, status, onSave, onUnsave, onView, onStatusChange }) {
  const tier = getScoreTier(matchScore);
  const currentStatus = status || 'Not Applied';

  function handleStatusChange(e) {
    const newStatus = e.target.value;
    if (STATUS_OPTIONS.includes(newStatus) && onStatusChange) {
      onStatusChange(job.id, newStatus, { title: job.title, company: job.company });
    }
  }

  return (
    <article className="kn-job-card">
      <div className="kn-job-card-header">
        <div>
          <h3 className="kn-job-title">{job.title}</h3>
          <p className="kn-job-company">{job.company}</p>
        </div>
        <div className="kn-job-badges">
          {matchScore !== null && (
            <span className={`kn-match-badge kn-match-${tier}`}>
              {matchScore}%
            </span>
          )}
          <span className={`kn-source-badge kn-source-${job.source.toLowerCase()}`}>
            {job.source}
          </span>
        </div>
      </div>

      <div className="kn-job-meta">
        <span>{job.location} · {job.mode}</span>
        <span>{job.experience}</span>
        <span>{job.salaryRange}</span>
      </div>

      <p className="kn-job-posted">{formatPosted(job.postedDaysAgo)}</p>

      <div className="kn-job-status-group">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`kn-status-btn kn-status-${opt.replace(/\s/g, '-').toLowerCase()} ${currentStatus === opt ? 'kn-status-btn--active' : ''}`}
            onClick={() => onStatusChange && onStatusChange(job.id, opt, { title: job.title, company: job.company })}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="kn-job-actions">
        <button className="kn-btn kn-btn-secondary kn-btn-sm" onClick={() => onView(job)}>
          View
        </button>
        {isSaved ? (
          <button className="kn-btn kn-btn-secondary kn-btn-sm kn-btn-saved" onClick={() => onUnsave(job.id)}>
            Saved
          </button>
        ) : (
          <button className="kn-btn kn-btn-secondary kn-btn-sm" onClick={() => onSave(job.id)}>
            Save
          </button>
        )}
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="kn-btn kn-btn-primary kn-btn-sm"
        >
          Apply
        </a>
      </div>
    </article>
  );
}

export default memo(JobCard);
