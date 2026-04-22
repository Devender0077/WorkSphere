import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '@/components/auth/AuthShell';
import { cn } from '@/lib/utils';

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(['', '', '', '']);
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const email = localStorage.getItem('hrd-reset-email') || 'pristia@gmail.com';

  useEffect(() => { refs[0].current?.focus(); /* eslint-disable-next-line */ }, []);

  const setDigit = (i, v) => {
    const val = v.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 3) refs[i + 1].current?.focus();
  };

  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  const canSubmit = digits.every((d) => d !== '');

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    navigate('/password-changed');
  };

  return (
    <AuthShell>
      <div className="text-center mb-7">
        <h1 className="text-[28px] font-bold text-foreground">OTP Verification</h1>
        <p className="mt-3 text-[13.5px] text-muted-foreground">
          We have sent a verification code to email address <span className="font-semibold text-foreground">{email}</span>. <Link to="/forgot-password" className="font-semibold text-primary">Wrong Email?</Link>
        </p>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div className="flex items-center justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              inputMode="numeric"
              maxLength={1}
              className={cn('h-14 w-14 rounded-xl border bg-card text-center text-[22px] font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30', d ? 'border-primary' : 'border-border')}
            />
          ))}
        </div>
        <button type="submit" disabled={!canSubmit} className={`w-full h-12 rounded-xl font-semibold text-[14px] ${canSubmit ? 'bg-[hsl(var(--navy))] text-white hover:opacity-90' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}>Submit</button>
        <p className="text-center text-[12.5px] text-muted-foreground">Didn’t receive the code? <button type="button" className="font-semibold text-primary">Resend</button></p>
      </form>
    </AuthShell>
  );
};

export default OtpVerificationPage;
