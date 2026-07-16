import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Settings as SettingsIcon, Globe } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import AddPlatform from './components/AddPlatform';
import Settings from './components/Settings';
import { useLanguage } from './i18n/LanguageContext';
import './index.css';

function Sidebar() {
  const { lang, t, toggleLanguage } = useLanguage();

  return (
    <div className="sidebar">
      <div className="logo-container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="logo-icon">K</div>
          <div>AI Analytics</div>
        </div>
        <button 
          onClick={toggleLanguage}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Toggle Language"
        >
          <Globe size={20} />
          <span style={{ fontSize: '0.75rem', display: 'block', textTransform: 'uppercase', marginTop: '2px' }}>{lang}</span>
        </button>
      </div>
      <nav>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} />
          <span>{t('dashboard')}</span>
        </NavLink>
        <NavLink to="/accounts" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Users size={20} />
          <span>{t('accounts_overview')}</span>
        </NavLink>
        <NavLink to="/add" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <PlusCircle size={20} />
          <span>{t('add_platform')}</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <SettingsIcon size={20} />
          <span>{t('settings')}</span>
        </NavLink>
      </nav>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/add" element={<AddPlatform />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
