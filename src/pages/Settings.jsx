import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePreferences from '../hooks/usePreferences';

const ALL_LOCATIONS = ['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai', 'Noida', 'Mysore'];
const ALL_MODES = ['Remote', 'Hybrid', 'Onsite'];
const ALL_EXPERIENCE = [
  { value: '', label: 'Select level' },
  { value: 'Fresher', label: 'Fresher' },
  { value: '0-1', label: '0–1 years' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-5', label: '3–5 years' },
];

export default function Settings() {
  const { prefs, savePrefs } = usePreferences();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roleKeywords: '',
    preferredLocations: [],
    preferredModes: [],
    experienceLevel: '',
    skills: '',
    minMatchScore: 40,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefs) {
      setForm({
        roleKeywords: prefs.roleKeywords || '',
        preferredLocations: prefs.preferredLocations || [],
        preferredModes: prefs.preferredModes || [],
        experienceLevel: prefs.experienceLevel || '',
        skills: prefs.skills || '',
        minMatchScore: prefs.minMatchScore ?? 40,
      });
    }
  }, [prefs]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function toggleLocation(loc) {
    setForm((prev) => {
      const exists = prev.preferredLocations.includes(loc);
      return {
        ...prev,
        preferredLocations: exists
          ? prev.preferredLocations.filter((l) => l !== loc)
          : [...prev.preferredLocations, loc],
      };
    });
    setSaved(false);
  }

  function toggleMode(mode) {
    setForm((prev) => {
      const exists = prev.preferredModes.includes(mode);
      return {
        ...prev,
        preferredModes: exists
          ? prev.preferredModes.filter((m) => m !== mode)
          : [...prev.preferredModes, mode],
      };
    });
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    savePrefs(form);
    setSaved(true);
  }

  return (
    <div className="kn-page-container">
      <div className="kn-context-header">
        <h1>Tracking Preferences</h1>
        <p>Define what matters. We surface only what matches.</p>
      </div>

      <form className="kn-form" onSubmit={handleSubmit}>
        <div className="kn-field">
          <label className="kn-label" htmlFor="keywords">Role Keywords</label>
          <input
            id="keywords"
            className="kn-input"
            type="text"
            placeholder="e.g. React, Frontend, SDE Intern"
            value={form.roleKeywords}
            onChange={(e) => updateField('roleKeywords', e.target.value)}
          />
          <span className="kn-field-hint">Comma-separated keywords matched against job titles and descriptions.</span>
        </div>

        <div className="kn-field">
          <label className="kn-label">Preferred Locations</label>
          <div className="kn-checkbox-group">
            {ALL_LOCATIONS.map((loc) => (
              <label key={loc} className="kn-checkbox-label">
                <input
                  type="checkbox"
                  className="kn-checkbox-input"
                  checked={form.preferredLocations.includes(loc)}
                  onChange={() => toggleLocation(loc)}
                />
                <span>{loc}</span>
              </label>
            ))}
          </div>
          <span className="kn-field-hint">Select all locations that work for you.</span>
        </div>

        <div className="kn-field">
          <label className="kn-label">Work Mode</label>
          <div className="kn-checkbox-group">
            {ALL_MODES.map((mode) => (
              <label key={mode} className="kn-checkbox-label">
                <input
                  type="checkbox"
                  className="kn-checkbox-input"
                  checked={form.preferredModes.includes(mode)}
                  onChange={() => toggleMode(mode)}
                />
                <span>{mode}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="experience">Experience Level</label>
          <select
            id="experience"
            className="kn-input kn-select"
            value={form.experienceLevel}
            onChange={(e) => updateField('experienceLevel', e.target.value)}
          >
            {ALL_EXPERIENCE.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="skills">Skills</label>
          <input
            id="skills"
            className="kn-input"
            type="text"
            placeholder="e.g. React, TypeScript, Java, SQL"
            value={form.skills}
            onChange={(e) => updateField('skills', e.target.value)}
          />
          <span className="kn-field-hint">Comma-separated skills matched against job requirements.</span>
        </div>

        <div className="kn-field">
          <label className="kn-label" htmlFor="threshold">
            Minimum Match Score: <strong>{form.minMatchScore}%</strong>
          </label>
          <input
            id="threshold"
            className="kn-range"
            type="range"
            min="0"
            max="100"
            step="5"
            value={form.minMatchScore}
            onChange={(e) => updateField('minMatchScore', Number(e.target.value))}
          />
          <div className="kn-range-labels">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
          <span className="kn-field-hint">Jobs below this score are hidden when the threshold toggle is on.</span>
        </div>

        <div className="kn-form-actions">
          <button type="submit" className="kn-btn kn-btn-primary">
            Save Preferences
          </button>
          {saved && (
            <button
              type="button"
              className="kn-btn kn-btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </button>
          )}
        </div>
        {saved && (
          <p className="kn-save-confirmation">Preferences saved. Scores are now active on the dashboard.</p>
        )}
      </form>
    </div>
  );
}
