import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import jobs from '../data/jobs';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import FilterBar from '../components/FilterBar';
import useSavedJobs from '../hooks/useSavedJobs';
import usePreferences from '../hooks/usePreferences';
import useJobStatus from '../hooks/useJobStatus';
import Toast from '../components/Toast';
import { computeMatchScore, extractSalaryNumeric } from '../utils/scoreEngine';

const DEFAULT_FILTERS = {
  keyword: '',
  location: 'All Locations',
  mode: 'All Modes',
  experience: 'All Levels',
  source: 'All Sources',
  status: 'All',
  sort: 'Latest',
};

export default function Dashboard() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showMatchOnly, setShowMatchOnly] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const { save, unsave, isSaved } = useSavedJobs();
  const { prefs, hasPrefs } = usePreferences();
  const { getStatus, setStatus } = useJobStatus();

  const scored = useMemo(() => {
    return jobs.map((job) => ({
      ...job,
      matchScore: hasPrefs ? computeMatchScore(job, prefs) : null,
    }));
  }, [prefs, hasPrefs]);

  const filtered = useMemo(() => {
    let result = [...scored];

    if (showMatchOnly && hasPrefs) {
      const threshold = prefs.minMatchScore ?? 40;
      result = result.filter((j) => j.matchScore !== null && j.matchScore >= threshold);
    }

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw)
      );
    }

    if (filters.location !== 'All Locations') {
      result = result.filter((j) => j.location === filters.location);
    }

    if (filters.mode !== 'All Modes') {
      result = result.filter((j) => j.mode === filters.mode);
    }

    if (filters.experience !== 'All Levels') {
      result = result.filter((j) => j.experience === filters.experience);
    }

    if (filters.source !== 'All Sources') {
      result = result.filter((j) => j.source === filters.source);
    }

    if (filters.status !== 'All') {
      result = result.filter((j) => getStatus(j.id) === filters.status);
    }

    if (filters.sort === 'Latest') {
      result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (filters.sort === 'Oldest') {
      result.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    } else if (filters.sort === 'Match Score') {
      result.sort((a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1));
    } else if (filters.sort === 'Salary') {
      result.sort((a, b) => extractSalaryNumeric(b.salaryRange) - extractSalaryNumeric(a.salaryRange));
    } else if (filters.sort === 'Company A-Z') {
      result.sort((a, b) => a.company.localeCompare(b.company));
    }

    return result;
  }, [scored, filters, showMatchOnly, hasPrefs, prefs, getStatus]);

  const handleView = useCallback((job) => setSelectedJob(job), []);
  const handleClose = useCallback(() => setSelectedJob(null), []);

  const handleStatusChange = useCallback((jobId, status, jobInfo) => {
    setStatus(jobId, status, jobInfo);
    if (['Applied', 'Rejected', 'Selected'].includes(status)) {
      setToast({ visible: true, message: `Status updated: ${status}` });
    }
  }, [setStatus]);

  return (
    <div className="kn-page-container">
      <div className="kn-context-header">
        <h1>Dashboard</h1>
        <p>Your matched jobs appear here, updated every morning.</p>
      </div>

      {!hasPrefs && (
        <div className="kn-banner">
          <p>
            Set your preferences to activate intelligent matching.{' '}
            <Link to="/settings" className="kn-banner-link">Go to Settings</Link>
          </p>
        </div>
      )}

      <FilterBar
        filters={filters}
        onChange={setFilters}
        hasPrefs={hasPrefs}
        showMatchOnly={showMatchOnly}
        onToggleMatchOnly={setShowMatchOnly}
      />

      <div className="kn-job-count">
        {filtered.length} {filtered.length === 1 ? 'role' : 'roles'} found
      </div>

      {filtered.length === 0 ? (
        <div className="kn-empty">
          <div className="kn-empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 19h32" stroke="currentColor" strokeWidth="1.5" />
              <rect x="12" y="23" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
              <rect x="12" y="28" width="16" height="2" rx="1" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <h2>No roles match your criteria</h2>
          <p>Adjust filters or lower your match threshold in settings.</p>
        </div>
      ) : (
        <div className="kn-job-grid">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={job.matchScore}
              status={getStatus(job.id)}
              isSaved={isSaved(job.id)}
              onSave={save}
              onUnsave={unsave}
              onView={handleView}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {selectedJob && (
        <JobModal job={selectedJob} onClose={handleClose} />
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}
