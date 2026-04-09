import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Kanban,
  List,
  Users,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  BriefcaseBusiness,
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';
import { ContactsProvider } from './context/ContactsContext';
import { useAuth } from './context/useAuth';
import './index.css';

import Dashboard from './pages/Dashboard';
import KanbanBoard from './pages/KanbanBoard';
import ApplicationList from './pages/ApplicationList';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import { Button } from './components/ui/button';
import RouteTransition from './components/RouteTransition';
import {
  Sidebar as AppSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from './components/ui/sidebar';
import { cn } from './lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/kanban', label: 'Kanban Board', icon: Kanban },
  { to: '/list', label: 'Table View', icon: List },
  { to: '/contacts', label: 'Contacts', icon: Users },
];

const Sidebar = ({ theme, toggleTheme }) => {
  const { logout } = useAuth();

  return (
    <AppSidebar>
      <SidebarHeader>
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <BriefcaseBusiness size={18} />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight">ImongTracker</h2>
          <p className="mt-1 text-xs text-foreground-muted">Minimal tracking for focused job search momentum.</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => cn('sidebar-link', isActive && 'sidebar-link-active')}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-2">
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
      </SidebarFooter>
    </AppSidebar>
  );
};

const MobileHeader = ({ theme, toggleTheme }) => {
  const { logout } = useAuth();

  return (
    <header className="mobile-header">
      <div className="flex items-center gap-2 text-primary">
        <BriefcaseBusiness size={16} />
        <span className="text-sm font-extrabold tracking-tight text-foreground">ImongTracker</span>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={toggleTheme} variant="secondary" size="sm" className="rounded-lg px-2.5">
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </Button>
        <Button onClick={logout} variant="soft" size="sm" className="rounded-lg px-2.5 text-danger">
          <LogOut size={14} />
        </Button>
      </div>
    </header>
  );
};

const MobileBottomNav = () => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
          >
            <Icon size={17} />
            <span>{item.label.replace(' Board', '')}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

const AppLayout = ({ children, theme, toggleTheme }) => (
  <div className="app-shell">
    <Sidebar theme={theme} toggleTheme={toggleTheme} />
    <main className="main-panel">
      <MobileHeader theme={theme} toggleTheme={toggleTheme} />
      <div className="mx-auto w-full max-w-[1340px]">{children}</div>
    </main>
    <MobileBottomNav />
  </div>
);

// PrivateRoute protects routes from unauthenticated users
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const location = useLocation();
  const { currentUser } = useAuth();

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
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <RouteTransition><Login /></RouteTransition>}
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={(
            <PrivateRoute>
              <AppLayout theme={theme} toggleTheme={toggleTheme}>
                <RouteTransition>
                  <Dashboard />
                </RouteTransition>
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route
          path="/kanban"
          element={(
            <PrivateRoute>
              <AppLayout theme={theme} toggleTheme={toggleTheme}>
                <RouteTransition>
                  <KanbanBoard />
                </RouteTransition>
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route
          path="/list"
          element={(
            <PrivateRoute>
              <AppLayout theme={theme} toggleTheme={toggleTheme}>
                <RouteTransition>
                  <ApplicationList />
                </RouteTransition>
              </AppLayout>
            </PrivateRoute>
          )}
        />
        <Route
          path="/contacts"
          element={(
            <PrivateRoute>
              <AppLayout theme={theme} toggleTheme={toggleTheme}>
                <RouteTransition>
                  <Contacts />
                </RouteTransition>
              </AppLayout>
            </PrivateRoute>
          )}
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ContactsProvider>
          <ApplicationProvider>
            <AppContent />
          </ApplicationProvider>
        </ContactsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
