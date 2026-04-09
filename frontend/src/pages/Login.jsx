import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

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
      setError(err.message.replace('Firebase:', '').trim());
    }

    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-[8%] top-[10%] h-52 w-52 rounded-full blur-3xl"
          style={{ background: 'var(--color-primary-soft)' }}
        />
        <div
          className="absolute bottom-[10%] right-[12%] h-56 w-56 rounded-full blur-3xl"
          style={{ background: 'var(--color-primary-soft-hover)' }}
        />
      </div>

      <div className="w-full max-w-md animate-fade-up">
        <Card className="overflow-hidden border-border shadow-md">
          <CardContent className="p-6 sm:p-7">
            <div className="mb-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <BriefcaseBusiness size={20} />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">Welcome to ImongTracker</h1>
              <p className="mt-2 text-sm text-foreground-muted">
                Minimal workflow for modern job search tracking.
              </p>
            </div>

            {error ? (
              <div className="mb-4 rounded-xl border border-red-300/50 bg-red-100/60 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              variant="secondary"
              className="h-11 w-full rounded-xl border-border bg-background font-semibold hover:bg-surface"
            >
              <GoogleMark />
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground-subtle">
              <Sparkles size={14} />
              Keep records clean. Move quickly. Improve outcomes.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.02 5.02 0 0 1-2.21 3.31v2.77h3.57a10.94 10.94 0 0 0 3.28-8.09"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06a6.18 6.18 0 0 1-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09A6.45 6.45 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.94 10.94 0 0 0 12 1 10.99 10.99 0 0 0 2.18 7.07l3.66 2.84A6.18 6.18 0 0 1 12 5.38"
      fill="#EA4335"
    />
  </svg>
);

export default Login;
