const LOCATIONS = ['All Locations', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai', 'Noida', 'Mysore'];
const MODES = ['All Modes', 'Remote', 'Hybrid', 'Onsite'];
const EXPERIENCE = ['All Levels', 'Fresher', '0-1', '1-3', '3-5'];
const SOURCES = ['All Sources', 'LinkedIn', 'Naukri', 'Indeed'];
const STATUS_OPTIONS = ['All', 'Not Applied', 'Applied', 'Rejected', 'Selected'];
const SORT_OPTIONS = ['Latest', 'Oldest', 'Match Score', 'Salary', 'Company A-Z'];

export default function FilterBar({ filters, onChange, hasPrefs, showMatchOnly, onToggleMatchOnly }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="kn-filter-bar">
      <div className="kn-filter-search">
        <input
          className="kn-input kn-filter-input"
          type="text"
          placeholder="Search by title or company..."
          value={filters.keyword}
          onChange={(e) => update('keyword', e.target.value)}
        />
      </div>

      <div className="kn-filter-selects">
        <select
          className="kn-input kn-select kn-filter-select"
          value={filters.location}
          onChange={(e) => update('location', e.target.value)}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          className="kn-input kn-select kn-filter-select"
          value={filters.mode}
          onChange={(e) => update('mode', e.target.value)}
        >
          {MODES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          className="kn-input kn-select kn-filter-select"
          value={filters.experience}
          onChange={(e) => update('experience', e.target.value)}
        >
          {EXPERIENCE.map((exp) => (
            <option key={exp} value={exp}>{exp}</option>
          ))}
        </select>

        <select
          className="kn-input kn-select kn-filter-select"
          value={filters.source}
          onChange={(e) => update('source', e.target.value)}
        >
          {SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="kn-input kn-select kn-filter-select"
          value={filters.status}
          onChange={(e) => update('status', e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="kn-input kn-select kn-filter-select"
          value={filters.sort}
          onChange={(e) => update('sort', e.target.value)}
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {hasPrefs && (
        <div className="kn-threshold-toggle">
          <label className="kn-toggle-label">
            <input
              type="checkbox"
              className="kn-toggle-input"
              checked={showMatchOnly}
              onChange={(e) => onToggleMatchOnly(e.target.checked)}
            />
            <span className="kn-toggle-track">
              <span className="kn-toggle-thumb" />
            </span>
            <span>Show only jobs above my threshold</span>
          </label>
        </div>
      )}
    </div>
  );
}
