import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DEMO_ACCOUNTS } from '@/data/mock';

const LoginPage = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const canSubmit = email.length > 0 && password.length > 0 && !submitting;

  const fillDemo = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    setSubmitting(true);
    try {
      await login(acc.email, acc.password);
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.detail || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left panel */}
      <div className="relative hidden lg:flex flex-col bg-[#0F1B2D] text-white">
        <div className="flex-1 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80"
            alt="team"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-12 py-10">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-9 w-9 rounded-lg bg-primary grid place-items-center text-white font-extrabold">H</div>
            <span className="text-lg font-bold tracking-tight">HRDashboard</span>
          </div>
          <h2 className="text-[34px] leading-[1.15] font-bold max-w-md">
            Let's empower your<br />employees today.
          </h2>
          <p className="mt-4 text-white/60 text-[14px]">
            Multi-tenant HR platform for modern teams. Manage employees, roles, payroll and more.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6 py-10 lg:px-14">
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <h1 className="text-[26px] font-bold text-foreground text-center">Login first to your account</h1>

          {/* Demo accounts */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground mb-3">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Try a demo account (one click to sign in)
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={submitting}
                  onClick={() => fillDemo(acc)}
                  className="w-full flex items-center gap-3 rounded-xl border border-border bg-background hover:bg-secondary px-3 py-2.5 text-left transition-colors disabled:opacity-60"
                >
                  <span className={`h-8 w-8 rounded-lg grid place-items-center text-[11px] font-bold ${acc.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${acc.dotColor} mr-0`} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-foreground">{acc.role}</div>
                    <div className="text-[11.5px] text-muted-foreground truncate">{acc.email} · {acc.password}</div>
                  </div>
                  <span className="text-[11px] font-semibold text-primary">Use</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-5 text-center">
            <span className="bg-background px-3 text-[12px] text-muted-foreground relative z-10">or sign in manually</span>
            <span className="absolute left-0 right-0 top-1/2 h-px bg-border" />
          </div>

          <label className="block mb-4">
            <span className="text-[13px] font-medium text-foreground">
              Email Address <span className="text-rose-500">*</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Input your registered email"
              className="mt-2 w-full h-12 rounded-xl border border-border bg-card px-4 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>

          <label className="block mb-2">
            <span className="text-[13px] font-medium text-foreground">
              Password <span className="text-rose-500">*</span>
            </span>
            <div className="relative mt-2">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Input your password account"
                className="w-full h-12 rounded-xl border border-border bg-card px-4 pr-12 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && <div className="mt-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[13px] px-3 py-2">{error}</div>}

          <div className="flex items-center justify-between mb-5 mt-3">
            <label className="inline-flex items-center gap-2 text-[13px] text-foreground cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
              Remember Me
            </label>
            <a href="/forgot-password" className="text-[13px] font-medium text-foreground hover:text-primary">Forgot Password</a>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full h-12 rounded-xl font-semibold text-[14px] transition-colors inline-flex items-center justify-center gap-2 ${
              canSubmit ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-muted-foreground cursor-not-allowed'
            }`}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Signing in...' : 'Login'}
          </button>

          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            You're new in here? <Link to="/signup" className="font-semibold text-primary">Create Account</Link>
          </p>
          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            © 2025 HRDashboard. Alrights reserved. <a href="#" className="font-medium">Terms &amp; Conditions</a> · <a href="#" className="font-medium">Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
