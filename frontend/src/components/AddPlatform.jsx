import { useState } from 'react';
import { Save } from 'lucide-react';

export default function AddPlatform() {
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
    setStatus({ type: 'loading', message: 'Saving account...' });
    
    try {
      const res = await fetch('http://localhost:3001/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Account added successfully!' });
        setFormData({ ...formData, name: '', session_token: '', api_key: '' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error connecting to backend. (Mock mode: Pretend it saved!)' });
    }
  };

  return (
    <div className="add-platform">
      <h1>Add New Platform</h1>
      
      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Platform</label>
            <select name="platform" className="form-control" value={formData.platform} onChange={handleChange}>
              <option value="OpenAI">OpenAI (ChatGPT)</option>
              <option value="Anthropic">Anthropic (Claude)</option>
              <option value="Google">Google (Gemini)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Account Name (Alias)</label>
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
            <label className="form-label">Plan Type</label>
            <select name="plan_type" className="form-control" value={formData.plan_type} onChange={handleChange}>
              <option value="FREE">FREE</option>
              <option value="PRO">PRO / PLUS</option>
              <option value="TEAM">TEAM / ENTERPRISE</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Session Token (Cookie)</label>
            <textarea 
              name="session_token"
              className="form-control" 
              rows="3" 
              placeholder="Paste session token here..."
              value={formData.session_token}
              onChange={handleChange}
            ></textarea>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Required for web scraping quota if API key is not available.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">API Key (Optional)</label>
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
              Save Account
            </button>
          </div>

          {status.message && (
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
