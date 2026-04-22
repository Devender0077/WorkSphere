import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('hrd-reset-email', email);
      setSubmitting(false);
      navigate('/otp-verification');
    }, 500);
  };

  return (
    <AuthShell>
      <div className="text-center mb-7">
        <h1 className="text-[28px] font-bold text-foreground">Reset your password</h1>
        <p className="mt-3 text-[13.5px] text-muted-foreground max-w-xs mx-auto">Enter your email address and we’ll send you password reset instructions.</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-[13px] font-medium text-foreground">Registered Email <span className="text-rose-500">*</span></span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Input your registered email" className="mt-2 w-full h-12 rounded-xl border border-border bg-card px-4 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </label>
        <button type="submit" disabled={!email || submitting} className={`w-full h-12 rounded-xl font-semibold text-[14px] inline-flex items-center justify-center gap-2 ${email ? 'bg-[hsl(var(--navy))] text-white hover:opacity-90' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Send Instructions
        </button>
        <Link to="/login" className="w-full h-12 rounded-xl border border-border bg-card hover:bg-secondary flex items-center justify-center text-[14px] font-semibold text-foreground">
          Back To Login
        </Link>
      </form>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
