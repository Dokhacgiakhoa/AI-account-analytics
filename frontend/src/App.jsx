import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PlusCircle, Settings as SettingsIcon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import AddPlatform from './components/AddPlatform';
import Settings from './components/Settings';
import './index.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">K</div>
        <div>AI Analytics</div>
      </div>
      <nav>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/accounts" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Users size={20} />
          <span>Accounts Overview</span>
        </NavLink>
        <NavLink to="/add" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <PlusCircle size={20} />
          <span>Add Platform</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <SettingsIcon size={20} />
          <span>Settings</span>
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
