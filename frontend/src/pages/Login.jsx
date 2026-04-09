import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    }
    
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '1rem', background: 'var(--bg-base)' }}>
      <div style={{ 
        background: 'var(--bg-surface)', 
        padding: '2.5rem', 
        borderRadius: 'var(--border-radius)', 
        boxShadow: 'var(--shadow-md)', 
        width: '100%', 
        maxWidth: '400px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem', color: 'var(--color-primary)' }}>
          <LayoutDashboard size={28} />
          <h2 style={{ padding: 0, margin: 0 }}>ImongTracker</h2>
        </div>
        
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
          Welcome
        </h3>
        
        {error && <div style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', padding: '1rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(220, 38, 38, 0.2)' }}>{error}</div>}
        
        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'var(--bg-base)', 
            color: 'var(--text-primary)', 
            padding: '0.85rem', 
            borderRadius: 'var(--border-radius)', 
            fontWeight: '600',
            transition: 'background var(--transition-speed)', 
            opacity: loading ? 0.7 : 1,
            border: '1px solid var(--border-color)', 
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseOver={(e) => { if (!loading) e.target.style.background = 'var(--bg-surface)' }}
          onMouseOut={(e) => { if (!loading) e.target.style.background = 'var(--bg-base)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
      </div>
    </div>
  );
};

export default Login;
