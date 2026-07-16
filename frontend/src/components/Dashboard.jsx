import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState([]);
  
  // Mock data for initial render, usually fetched from backend
  useEffect(() => {
    // Generate some mock history data for the chart
    const generateData = () => {
      const result = [];
      let currentQuota = 100;
      for (let i = 14; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        result.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          quota: parseFloat(currentQuota.toFixed(1)),
          burn: parseFloat((Math.random() * 2).toFixed(1))
        });
        currentQuota = Math.max(0, currentQuota - (Math.random() * 5));
      }
      return result;
    };
    
    setData(generateData());
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="grid-3 mb-6" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Active Accounts</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '8px' }}>12</div>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg Quota Remaining</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '8px', color: 'var(--success)' }}>76%</div>
        </div>
        <div className="glass-card">
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Avg Burn Rate (Daily)</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '8px', color: 'var(--warning)' }}>2.4%</div>
        </div>
      </div>

      <div className="glass-card" style={{ height: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Global Quota Burn History</h2>
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorQuota" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
            <Tooltip />
            <Area type="monotone" dataKey="quota" stroke="var(--primary)" fillOpacity={1} fill="url(#colorQuota)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
