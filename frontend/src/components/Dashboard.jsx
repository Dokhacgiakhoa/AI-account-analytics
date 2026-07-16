import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '../i18n/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Generate mock multi-line data for 3 accounts
    const generateData = () => {
      const result = [];
      let q1 = 100, q2 = 80, q3 = 60;
      for (let i = 14; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        result.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          "GPT-4 Main": parseFloat(q1.toFixed(1)),
          "Claude Opus": parseFloat(q2.toFixed(1)),
          "Gemini Test": parseFloat(q3.toFixed(1))
        });
        q1 = Math.max(0, q1 - (Math.random() * 3));
        q2 = Math.max(0, q2 - (Math.random() * 2));
        q3 = Math.max(0, q3 - (Math.random() * 5));
      }
      return result;
    };
    
    setData(generateData());
  }, []);

  return (
    <div className="dashboard">
      <h1>{t('dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card">
          <h3 className="text-textMuted text-sm">{t('total_active_accounts')}</h3>
          <div className="text-3xl font-bold mt-2">12</div>
        </div>
        <div className="glass-card">
          <h3 className="text-textMuted text-sm">{t('avg_quota_remaining')}</h3>
          <div className="text-3xl font-bold mt-2 text-success">76%</div>
        </div>
        <div className="glass-card">
          <h3 className="text-textMuted text-sm">{t('avg_burn_rate')}</h3>
          <div className="text-3xl font-bold mt-2 text-warning">2.4%</div>
        </div>
      </div>

      <div className="glass-card h-[450px]">
        <h2 className="mb-6">{t('global_quota_history')}</h2>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke="var(--textMuted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--textMuted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="GPT-4 Main" stroke="#38bdf8" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            <Line type="monotone" dataKey="Claude Opus" stroke="#a855f7" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            <Line type="monotone" dataKey="Gemini Test" stroke="#22c55e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
