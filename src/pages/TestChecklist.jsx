import { useState } from 'react';
import useTestChecklist from '../hooks/useTestChecklist';

const TEST_ITEMS = [
  { id: 'prefs-persist', label: 'Preferences persist after refresh', howTo: 'Set preferences in Settings, refresh page, confirm form is prefilled.' },
  { id: 'match-score', label: 'Match score calculates correctly', howTo: 'Set role keywords like React, verify jobs with "React" in title show higher scores.' },
  { id: 'show-matches-toggle', label: '"Show only matches" toggle works', howTo: 'Enable toggle on Dashboard, confirm only jobs above threshold appear.' },
  { id: 'save-persist', label: 'Save job persists after refresh', howTo: 'Save a job on Dashboard, go to Saved, refresh; job remains.' },
  { id: 'apply-new-tab', label: 'Apply opens in new tab', howTo: 'Click Apply on any job card; verify it opens in a new tab.' },
  { id: 'status-persist', label: 'Status update persists after refresh', howTo: 'Change job status to Applied, refresh; status remains Applied.' },
  { id: 'status-filter', label: 'Status filter works correctly', howTo: 'Set status to Applied in filter, confirm only Applied jobs show.' },
  { id: 'digest-top-10', label: 'Digest generates top 10 by score', howTo: 'Generate digest, confirm 10 jobs sorted by match score descending.' },
  { id: 'digest-persist-day', label: 'Digest persists for the day', howTo: 'Generate digest, refresh page; same digest loads without regenerating.' },
  { id: 'no-console-errors', label: 'No console errors on main pages', howTo: 'Visit /, /dashboard, /saved, /digest, /settings, /proof; check DevTools console.' },
];

export default function TestChecklist() {
  const { passedCount, allPassed, toggle, isChecked, reset } = useTestChecklist();
  const [tooltipId, setTooltipId] = useState(null);

  return (
    <div className="kn-page-container">
      <div className="kn-context-header">
        <h1>Test Checklist</h1>
        <p>Verify all features before shipping.</p>
      </div>

      <div className="kn-test-summary">
        <p className="kn-test-count">
          Tests Passed: <strong>{passedCount} / 10</strong>
        </p>
        {!allPassed && (
          <p className="kn-test-warning">Resolve all issues before shipping.</p>
        )}
      </div>

      <div className="kn-test-actions">
        <button className="kn-btn kn-btn-secondary kn-btn-sm" onClick={reset}>
          Reset Test Status
        </button>
      </div>

      <div className="kn-test-list">
        {TEST_ITEMS.map((item) => (
          <div key={item.id} className="kn-test-item">
            <label className="kn-test-item-label">
              <input
                type="checkbox"
                className="kn-test-checkbox"
                checked={isChecked(item.id)}
                onChange={() => toggle(item.id)}
                aria-label={item.label}
              />
              <span>{item.label}</span>
            </label>
            <div className="kn-test-tooltip-wrap">
              <button
                type="button"
                className="kn-test-how-btn"
                onClick={() => setTooltipId(tooltipId === item.id ? null : item.id)}
                aria-label="How to test"
              >
                ?
              </button>
              {tooltipId === item.id && (
                <div className="kn-test-tooltip">
                  {item.howTo}
                  <button
                    type="button"
                    className="kn-test-tooltip-close"
                    onClick={() => setTooltipId(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
