import { useState } from 'react';
import { Save } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function AddPlatform() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    platform: 'OpenAI',
    name: '',
    session_token: '',
    api_key: '',
    plan_type: 'FREE'
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: '...' });
    
    try {
      const res = await fetch('http://localhost:3001/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus({ type: 'success', message: t('account_added_success') });
        setFormData({ ...formData, name: '', session_token: '', api_key: '' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setStatus({ type: 'error', message: t('error_saving') });
    }
  };

  return (
    <div className="add-platform">
      <h1>{t('add_new_platform')}</h1>
      
      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">{t('platform')}</label>
            <select name="platform" className="form-control" value={formData.platform} onChange={handleChange}>
              <option value="OpenAI">OpenAI (ChatGPT)</option>
              <option value="Anthropic">Anthropic (Claude)</option>
              <option value="Google">Google (Gemini)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('account_name')}</label>
            <input 
              type="text" 
              name="name"
              className="form-control" 
              placeholder="e.g. My Main Claude Account"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('plan_type')}</label>
            <select name="plan_type" className="form-control" value={formData.plan_type} onChange={handleChange}>
              <option value="FREE">FREE</option>
              <option value="PRO">PRO / PLUS</option>
              <option value="TEAM">TEAM / ENTERPRISE</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('session_token')}</label>
            <textarea 
              name="session_token"
              className="form-control" 
              rows="3" 
              placeholder="..."
              value={formData.session_token}
              onChange={handleChange}
            ></textarea>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {t('session_token_help')}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('api_key_optional')}</label>
            <input 
              type="password" 
              name="api_key"
              className="form-control" 
              placeholder="sk-..."
              value={formData.api_key}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {t('save_account')}
            </button>
          </div>

          {status.message && status.type !== 'loading' && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '12px', 
              borderRadius: '8px',
              backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: status.type === 'error' ? 'var(--danger)' : 'var(--success)'
            }}>
              {status.message}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
