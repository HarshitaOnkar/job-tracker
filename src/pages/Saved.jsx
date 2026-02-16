import { useState, useCallback } from 'react';
import jobs from '../data/jobs';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import Toast from '../components/Toast';
import useSavedJobs from '../hooks/useSavedJobs';
import useJobStatus from '../hooks/useJobStatus';

export default function Saved() {
  const { savedIds, save, unsave, isSaved } = useSavedJobs();
  const { getStatus, setStatus } = useJobStatus();
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const handleStatusChange = useCallback((jobId, status, jobInfo) => {
    setStatus(jobId, status, jobInfo);
    if (['Applied', 'Rejected', 'Selected'].includes(status)) {
      setToast({ visible: true, message: `Status updated: ${status}` });
    }
  }, [setStatus]);

  const savedJobs = jobs.filter((j) => savedIds.includes(j.id));

  return (
    <div className="kn-page-container">
      <div className="kn-context-header">
        <h1>Saved Jobs</h1>
        <p>Roles you have bookmarked for later review.</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="kn-empty">
          <div className="kn-empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 10h16a2 2 0 0 1 2 2v26l-10-7-10 7V12a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <h2>Nothing saved yet</h2>
          <p>When you find a role worth keeping, save it here. Your shortlist stays clean and accessible.</p>
        </div>
      ) : (
        <>
          <div className="kn-job-count">
            {savedJobs.length} saved {savedJobs.length === 1 ? 'role' : 'roles'}
          </div>
          <div className="kn-job-grid">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                matchScore={null}
                status={getStatus(job.id)}
                isSaved={isSaved(job.id)}
                onSave={save}
                onUnsave={unsave}
                onView={setSelectedJob}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </>
      )}

      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}
