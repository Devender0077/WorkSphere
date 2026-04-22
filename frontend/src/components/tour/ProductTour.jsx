import React, { useEffect, useState } from 'react';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const TOURS = {
  super_admin: [
    { t: 'Welcome to HRDashboard', b: "You're signed in as Super Admin. You have full control over the platform across all tenants." },
    { t: 'Manage Tenants', b: 'Visit the Tenants page to add customer workspaces, manage plans, and monitor activity.' },
    { t: 'Roles & Permissions', b: 'Define granular permissions per role. Create custom roles tailored to each tenant’s needs.' },
    { t: 'Platform Reports', b: 'Track MRR, churn, active tenants, and cross-tenant analytics from the Reports section.' },
  ],
  tenant_admin: [
    { t: 'Welcome to your HR workspace', b: "You're the admin of your company. Manage employees, payroll, performance, and more." },
    { t: 'Employees & Directory', b: 'Invite new hires, browse your directory, and visualize reporting lines on the ORG chart.' },
    { t: 'Biometric & Face ID', b: 'Connect eSSL / eZTeck devices in Setting → Biometric. Employees can enroll their face from their profile.' },
    { t: 'Time Off & Payroll', b: 'Approve time-off requests, run monthly payroll, and distribute payslips in a few clicks.' },
    { t: 'Recruitment Pipeline', b: 'Post jobs and move candidates through Applied → Screening → Interview → Offer → Hired.' },
  ],
  employee: [
    { t: 'Welcome!', b: 'This is your self-service portal. View your profile, request time off, and access payslips.' },
    { t: 'Enroll your Face ID', b: 'Head to My Profile to enroll your face. You have 7 days to complete this for biometric attendance.' },
    { t: 'Request Time Off', b: 'Use Time Off → My Time Off to submit annual, sick, or personal leave requests.' },
    { t: 'Your Payslips', b: 'Download your monthly payslips anytime from the Payslips page.' },
  ],
};

const ProductTour = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const key = `hrd-tour-done-${user.role}`;
    if (!localStorage.getItem(key)) {
      setTimeout(() => setOpen(true), 700);
    }
  }, [user]);

  if (!open || !user) return null;
  const steps = TOURS[user.role] || TOURS.employee;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  const finish = () => {
    localStorage.setItem(`hrd-tour-done-${user.role}`, '1');
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md rounded-3xl bg-card border border-border shadow-2xl p-7">
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-2 text-primary text-[12px] font-bold uppercase tracking-wide"><Sparkles className="h-4 w-4" /> Product tour</div>
          <button onClick={finish} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="relative aspect-[5/3] rounded-2xl bg-primary/10 overflow-hidden mb-5">
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-[44px] font-extrabold text-primary opacity-80">{step + 1}/{steps.length}</div>
          </div>
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-400/30 blur-2xl" />
        </div>

        <h2 className="text-[20px] font-bold text-foreground">{current.t}</h2>
        <p className="mt-2 text-[13.5px] text-muted-foreground">{current.b}</p>

        <div className="mt-5 flex items-center gap-1.5">
          {steps.map((_, i) => (
            <span key={i} className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-8 bg-primary' : 'w-3 bg-secondary')} />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={finish} className="flex-1 h-11 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Skip tour</button>
          {isLast ? (
            <button onClick={finish} className="flex-1 h-11 rounded-xl bg-primary text-white text-[13.5px] font-semibold hover:bg-primary/90">Get started</button>
          ) : (
            <button onClick={() => setStep((s) => s + 1)} className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold hover:opacity-90">Next <ChevronRight className="h-4 w-4" /></button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTour;
