import { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  const [syncInterval, setSyncInterval] = useState('60');

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Settings saved! Sync interval set to ${syncInterval} minutes.`);
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      
      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem' }}>
          <SettingsIcon size={20} />
          Synchronization Preferences
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Configure how often the backend cronjob polls for quota updates.
        </p>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Sync Interval (Minutes)</label>
            <select 
              className="form-control" 
              value={syncInterval}
              onChange={(e) => setSyncInterval(e.target.value)}
            >
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
              <option value="60">Every 1 hour</option>
              <option value="120">Every 2 hours</option>
              <option value="1440">Once a day</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Alert Threshold</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="number" className="form-control" defaultValue="10" style={{ width: '100px' }} />
              <span style={{ color: 'var(--text-muted)' }}>% quota remaining</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Highlight accounts in red when quota falls below this percentage.
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
