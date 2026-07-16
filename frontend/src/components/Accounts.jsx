import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Accounts() {
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/accounts');
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
      setAccounts([
        { id: 1, name: 'Main GPT-4', platform: 'OpenAI', plan_type: 'PRO', quota_percent: 85.5 },
        { id: 2, name: 'Claude Opus', platform: 'Anthropic', plan_type: 'PRO', quota_percent: 42.1 },
        { id: 3, name: 'Gemini Test', platform: 'Google', plan_type: 'FREE', quota_percent: 12.0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const getQuotaColor = (percent) => {
    if (percent > 60) return 'var(--success)';
    if (percent > 20) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="accounts">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>{t('accounts_overview')}</h1>
        <button className="btn btn-primary" onClick={fetchAccounts} disabled={loading}>
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          {t('refresh')}
        </button>
      </div>

      <div className="grid-2">
        {accounts.map(acc => (
          <div key={acc.id} className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{acc.name}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{acc.platform}</div>
              </div>
              <span className={`badge ${acc.plan_type === 'PRO' ? 'badge-pro' : 'badge-free'}`}>
                {acc.plan_type}
              </span>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '4px' }}>
                <span>{t('quota_remaining')}</span>
                <span style={{ fontWeight: '600', color: getQuotaColor(acc.quota_percent) }}>
                  {acc.quota_percent.toFixed(1)}%
                </span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${acc.quota_percent}%`,
                    backgroundColor: getQuotaColor(acc.quota_percent)
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
