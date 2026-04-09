import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Kanban,
  List,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  BriefcaseBusiness,
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { useAuth } from './context/useAuth';
import './index.css';

import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import ApplicationList from './pages/ApplicationList';
import Login from './pages/Login';
import { Button } from './components/ui/button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/kanban', label: 'Kanban Board', icon: Kanban },
  { to: '/list', label: 'Table View', icon: List },
];

const Sidebar = ({ theme, toggleTheme }) => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="mb-5 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <BriefcaseBusiness size={18} />
        </div>
        <h2 className="text-lg font-extrabold tracking-tight">ImongTracker</h2>
        <p className="mt-1 text-xs text-foreground-muted">Minimal tracking for focused job search momentum.</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
        <Button
          onClick={toggleTheme}
          variant="secondary"
          className="w-full justify-start rounded-xl border-border bg-background text-foreground-muted hover:text-foreground"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </Button>
        <Button
          onClick={logout}
          variant="soft"
          className="w-full justify-start rounded-xl text-danger hover:text-danger"
        >
          <LogOut size={16} />
          Logout
        </Button>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground-subtle">
          <Sparkles size={14} />
          Keep it consistent, keep it moving.
        </div>
      </div>
    </aside>
  );
};

const AppLayout = ({ children, theme, toggleTheme }) => (
  <div className="app-shell">
    <Sidebar theme={theme} toggleTheme={toggleTheme} />
    <main className="main-panel">
      <div className="mx-auto w-full max-w-[1340px]">{children}</div>
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
