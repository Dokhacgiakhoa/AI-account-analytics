import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '../i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCcw, Unplug } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [syncStatus, setSyncStatus] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('https://ai-analytics-backend-gtdk.onrender.com/api/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        setAccounts(json);
        // Format for recharts based on accounts (just a simple mapping for now)
        // In a real app we'd fetch quota logs
        if (json.length > 0) {
          const chartData = [{
            date: new Date().toLocaleDateString(),
            ...json.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.quota_percent }), {})
          }];
          setData(chartData);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSyncCockpit = () => {
    setSyncStatus('Đang kết nối Cockpit...');
    try {
      const ws = new WebSocket('ws://127.0.0.1:19528');
      
      ws.onopen = () => {
        setSyncStatus('Đã kết nối, đang lấy dữ liệu...');
        // Cockpit might require a specific command to dump accounts, 
        // or it might send them on connect. We'll send a ping just in case.
        ws.send(JSON.stringify({ action: "get_accounts" })); 
      };

      ws.onmessage = async (event) => {
        try {
          const payload = JSON.parse(event.data);
          // Assuming payload has an accounts array or is an array itself
          const accountsData = Array.isArray(payload) ? payload : (payload.accounts || [payload]);
          
          if (accountsData && accountsData.length > 0) {
            setSyncStatus('Đang lưu vào Database...');
            const token = localStorage.getItem('auth_token');
            const res = await fetch('https://ai-analytics-backend-gtdk.onrender.com/api/sync-cockpit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ accounts: accountsData })
            });
            
            if (res.ok) {
              setSyncStatus('Đồng bộ thành công! 🎉');
              fetchAccounts();
              ws.close();
            } else {
              setSyncStatus('Lỗi khi lưu dữ liệu lên server.');
            }
          }
        } catch (e) {
          console.error("Lỗi parse WS:", e);
        }
      };

      ws.onerror = (e) => {
        setSyncStatus('Không thể kết nối Cockpit. Hãy chắc chắn app đang mở.');
        console.error("WS Error", e);
      };

    } catch (e) {
      setSyncStatus('Lỗi: ' + e.message);
    }
  };

  // Helper colors
  const colors = ['#38bdf8', '#a855f7', '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="dashboard pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <p className="text-textMuted">Xin chào, {user.name || user.email}</p>
        </div>
        
        <div className="flex items-center gap-4">
          {syncStatus && <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">{syncStatus}</span>}
          <button 
            onClick={handleSyncCockpit}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all"
          >
            <Unplug size={18} /> Sync from Cockpit
          </button>
          
          <button onClick={handleLogout} className="flex items-center gap-2 bg-bgCard hover:bg-red-500/10 text-red-500 border border-borderMain hover:border-red-500 px-4 py-2 rounded-lg transition-colors">
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card">
          <h3 className="text-textMuted text-sm">{t('total_active_accounts')}</h3>
          <div className="text-3xl font-bold mt-2">{accounts.length}</div>
        </div>
        <div className="glass-card">
          <h3 className="text-textMuted text-sm">{t('avg_quota_remaining')}</h3>
          <div className="text-3xl font-bold mt-2 text-success">
            {accounts.length > 0 
              ? (accounts.reduce((a, b) => a + b.quota_percent, 0) / accounts.length).toFixed(1) + '%'
              : '0%'}
          </div>
        </div>
        <div className="glass-card">
          <h3 className="text-textMuted text-sm">Hệ thống</h3>
          <div className="text-xl font-medium mt-2 text-primary flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Đang hoạt động
          </div>
        </div>
      </div>

      <div className="glass-card h-[450px]">
        <h2 className="mb-6">{t('global_quota_history')}</h2>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--borderMain)" />
              <XAxis dataKey="date" stroke="var(--textMuted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--textMuted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bgCard)', border: '1px solid var(--borderMain)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--textMain)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              {accounts.map((acc, index) => (
                <Line 
                  key={acc.id}
                  type="monotone" 
                  dataKey={acc.name} 
                  stroke={colors[index % colors.length]} 
                  strokeWidth={3} 
                  dot={{r: 4, fill: 'var(--bgMain)'}} 
                  activeDot={{r: 6}} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-textMuted">
            Chưa có dữ liệu. Hãy kết nối Cockpit để đồng bộ.
          </div>
        )}
      </div>
    </div>
  );
}
