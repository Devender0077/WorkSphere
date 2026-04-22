import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';

const PasswordChangedPage = () => {
  return (
    <AuthShell>
      <div className="text-center">
        <div className="relative mx-auto w-40 h-40">
          {/* Confetti dots */}
          {['-top-2 left-2 bg-rose-400', 'top-4 -right-2 bg-sky-400', 'bottom-6 -left-3 bg-amber-400', 'top-2 right-10 bg-amber-500', '-bottom-1 right-2 bg-emerald-400', 'bottom-8 right-[-8px] bg-rose-400'].map((c, i) => (
            <span key={i} className={`absolute h-2 w-2 rounded-full ${c}`} />
          ))}
          <div className="relative mx-auto h-32 w-32 rounded-full bg-primary grid place-items-center shadow-lg shadow-primary/30">
            <div className="h-24 w-24 rounded-full bg-background grid place-items-center">
              <Check className="h-10 w-10 text-foreground" strokeWidth={3} />
            </div>
          </div>
        </div>

        <h1 className="mt-6 text-[26px] font-bold text-foreground">Your successfully changed your password</h1>
        <p className="mt-3 text-[13.5px] text-muted-foreground max-w-xs mx-auto">Always remember the password for your account at HRDashboard!</p>

        <Link to="/login" className="mt-7 inline-flex w-full h-12 items-center justify-center rounded-xl bg-[hsl(var(--navy))] text-white text-[14px] font-semibold hover:opacity-90">
          Back to Login
        </Link>
      </div>
    </AuthShell>
  );
};

export default PasswordChangedPage;
