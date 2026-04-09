import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Kanban, List, Sun, Moon, LogOut } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import './index.css';

import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import ApplicationList from './pages/ApplicationList';
import Login from './pages/Login';

const Sidebar = ({ theme, toggleTheme }) => {
  const { logout } = useAuth();

  return (
    <aside style={{ 
      width: '260px', 
      background: 'var(--bg-surface)', 
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem'
    }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>
        <LayoutDashboard size={24} />
        ImongTracker
      </h2>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius)', color: 'var(--text-secondary)' }}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/kanban" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius)', color: 'var(--text-secondary)' }}>
          <Kanban size={20} />
          Kanban Board
        </Link>
        <Link to="/list" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius)', color: 'var(--text-secondary)' }}>
          <List size={20} />
          Table View
        </Link>
      </nav>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button 
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
            borderRadius: 'var(--border-radius)', color: 'var(--text-secondary)',
            background: 'transparent', width: '100%', textAlign: 'left'
          }}
        >
          {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
          Toggle Mode
        </button>
        <button 
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
            borderRadius: 'var(--border-radius)', color: '#dc2626',
            background: 'rgba(220, 38, 38, 0.1)', width: '100%', textAlign: 'left',
            fontWeight: '600', cursor: 'pointer', border: 'none'
          }}
        >
          <LogOut size={20}/>
          Logout
        </button>
      </div>
    </aside>
  );
};

const AppLayout = ({ children, theme, toggleTheme }) => (
  <div className="app-container">
    <Sidebar theme={theme} toggleTheme={toggleTheme} />
    <main className="main-content">
      {children}
    </main>
  </div>
);

// PrivateRoute protects routes from unauthenticated users
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('imong-tracker-theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('imong-tracker-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<PrivateRoute><AppLayout theme={theme} toggleTheme={toggleTheme}><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/kanban" element={<PrivateRoute><AppLayout theme={theme} toggleTheme={toggleTheme}><KanbanBoard /></AppLayout></PrivateRoute>} />
      <Route path="/list" element={<PrivateRoute><AppLayout theme={theme} toggleTheme={toggleTheme}><ApplicationList /></AppLayout></PrivateRoute>} />
    </Routes>
  );
}

import { ApplicationProvider } from './context/ApplicationContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApplicationProvider>
          <AppContent />
        </ApplicationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
