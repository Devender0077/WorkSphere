import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name && email && password.length >= 6;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    // mock submit -> proceed to onboarding wizard
    setTimeout(() => {
      localStorage.setItem('hrd-signup-draft', JSON.stringify({ name, email }));
      setSubmitting(false);
      navigate('/onboarding');
    }, 500);
  };

  return (
    <AuthShell>
      <h1 className="text-[28px] font-bold text-foreground">Manage employees easily starting from now!</h1>
      <p className="mt-2 text-[13.5px] text-muted-foreground">Get started for free today!</p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <label className="block">
          <span className="text-[13px] font-medium text-foreground">Name <span className="text-rose-500">*</span></span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pristia Candra" className="mt-2 w-full h-12 rounded-xl border border-border bg-card px-4 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-foreground">Work Email <span className="text-rose-500">*</span></span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="mt-2 w-full h-12 rounded-xl border border-border bg-card px-4 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-foreground">Password <span className="text-rose-500">*</span></span>
          <div className="relative mt-2">
            <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-12 rounded-xl border border-border bg-card px-4 pr-12 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <button type="submit" disabled={!canSubmit || submitting} className={`w-full h-12 rounded-xl font-semibold text-[14px] inline-flex items-center justify-center gap-2 ${canSubmit ? 'bg-[hsl(var(--navy))] text-white hover:opacity-90' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Account
        </button>

        <div className="relative my-2 text-center">
          <span className="bg-background px-3 text-[12px] text-muted-foreground relative z-10">Or register with</span>
          <span className="absolute left-0 right-0 top-1/2 h-px bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="h-12 rounded-xl border border-border bg-card hover:bg-secondary inline-flex items-center justify-center gap-2 text-[14px] font-medium">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.3 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 7.1 29 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19 19-8.5 19-19c0-1.3-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.1l6.6 4.8C14.7 15.1 19 12 24 12c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.6 7.1 29 5 24 5 16.3 5 9.7 9.3 6.3 14.1z"/><path fill="#4CAF50" d="M24 43c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 34 26.8 35 24 35c-5.3 0-9.8-2.6-11.3-6.9l-6.5 5C9.6 38.8 16.3 43 24 43z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.1-2.2 3.8-4 5.1l6.2 5.2C41.3 35.4 44 30.1 44 24c0-1.3-.1-2.3-.4-3.5z"/></svg>
            Google
          </button>
          <button type="button" className="h-12 rounded-xl border border-border bg-card hover:bg-secondary inline-flex items-center justify-center gap-2 text-[14px] font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.49 2.27-1.28 3.08-.95.98-2.5 1.73-3.82 1.63-.14-1.17.43-2.39 1.2-3.18.87-.91 2.38-1.61 3.9-1.53zM20.8 17.27c-.41.95-.89 1.86-1.49 2.69-.82 1.14-1.5 1.92-2.02 2.35-.81.66-1.68 1-2.62 1.03-.67 0-1.47-.19-2.42-.57-.94-.38-1.81-.57-2.61-.57-.84 0-1.73.19-2.68.57-.95.38-1.72.59-2.31.6-.9.03-1.79-.34-2.67-1.07C2.12 21.88 1.09 20.25.2 18.2-.79 15.9-1.28 13.66-1.28 11.5c0-2.48.54-4.62 1.61-6.41.87-1.45 2.08-2.6 3.64-3.45C5.53 1.04 7.3.6 9.2.56c.72 0 1.63.22 2.74.66 1.1.44 1.81.66 2.12.66.23 0 1-.26 2.3-.78 1.22-.48 2.26-.68 3.11-.61 2.28.18 4 1.08 5.14 2.7-2.04 1.24-3.05 2.97-3.03 5.18.02 1.72.64 3.15 1.87 4.29.56.52 1.18.92 1.87 1.21-.15.43-.3.84-.46 1.24z"/></svg>
            Apple
          </button>
        </div>

        <p className="pt-3 text-center text-[13px] text-muted-foreground">
          Already have an account? <Link to="/login" className="font-semibold text-primary">Login Here</Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default SignUpPage;
