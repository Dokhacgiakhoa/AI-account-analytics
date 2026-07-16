import { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Settings() {
  const { t } = useLanguage();
  const [syncInterval, setSyncInterval] = useState('60');

  const handleSave = (e) => {
    e.preventDefault();
    alert(t('settings_saved'));
  };

  return (
    <div className="settings">
      <h1>{t('settings')}</h1>
      
      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem' }}>
          <SettingsIcon size={20} />
          {t('sync_preferences')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {t('sync_desc')}
        </p>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">{t('sync_interval')}</label>
            <select 
              className="form-control" 
              value={syncInterval}
              onChange={(e) => setSyncInterval(e.target.value)}
            >
              <option value="15">{t('every_15_min')}</option>
              <option value="30">{t('every_30_min')}</option>
              <option value="60">{t('every_1_hour')}</option>
              <option value="120">{t('every_2_hours')}</option>
              <option value="1440">{t('once_a_day')}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('alert_threshold')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="number" className="form-control" defaultValue="10" style={{ width: '100px' }} />
              <span style={{ color: 'var(--text-muted)' }}>{t('quota_remaining_label')}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {t('alert_help')}
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {t('save_preferences')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
