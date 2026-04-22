import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Info, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const SIZES = ['1-10', '11-50', '51-100', '101-200', '201-500', '500+'];
const INDUSTRIES = ['Technology', 'Design Agency', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Manufacturing', 'Other'];
const COUNTRIES = ['Indonesia', 'Singapore', 'Malaysia', 'United States', 'India', 'United Kingdom'];

const Stepper = ({ step }) => (
  <div className="flex items-center gap-2">
    {[1, 2, 3, 4].map((s) => (
      <div key={s} className={cn('h-2 w-8 rounded', s <= step ? 'bg-primary' : 'bg-secondary')} />
    ))}
  </div>
);

const FieldLabel = ({ children, required }) => (
  <span className="text-[13px] font-medium text-foreground">{children}{required && <span className="text-rose-500"> *</span>}</span>
);

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);

  const [name, setName] = useState('Unpixel');
  const [domain, setDomain] = useState('unpixel');
  const [size, setSize] = useState('1-10');
  const [industry, setIndustry] = useState('Design Agency');
  const [country, setCountry] = useState('Indonesia');
  const [address, setAddress] = useState('');
  const [firstEmp, setFirstEmp] = useState({ name: '', email: '', title: 'Employee' });
  const [submitting, setSubmitting] = useState(false);

  const finish = async () => {
    setSubmitting(true);
    // auto-login as Acme admin so users land in an authenticated dashboard
    try {
      await login('admin@acme.com', 'Demo@123');
    } catch (e) { /* noop */ }
    setSubmitting(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="px-6 md:px-14 py-4 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary grid place-items-center text-white font-extrabold">H</div>
          <span className="text-[18px] font-bold tracking-tight text-foreground">HRDashboard</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 px-6 md:px-14 py-10 max-w-[1400px] mx-auto">
        {/* Left info */}
        <div className="pr-4">
          <Stepper step={step} />
          <div className="mt-5 text-[11.5px] font-bold tracking-[0.18em] text-muted-foreground uppercase">Step {step} of 4</div>
          <h1 className="mt-16 text-[40px] font-bold leading-[1.08] text-foreground">
            {step === 1 && <>We need some of your <span>Company Information</span></>}
            {step === 2 && <>Tell us about your <span>Business type</span></>}
            {step === 3 && <>Where is your <span>Company located</span></>}
            {step === 4 && <>Invite your <span>First teammate</span></>}
          </h1>
          <p className="mt-4 text-[13.5px] text-muted-foreground max-w-sm">
            {step === 1 && 'This data is needed so that we can easily provide solutions according to your company’s capacity'}
            {step === 2 && 'Helps us personalize modules you’ll use most — Payroll, Hiring, Performance.'}
            {step === 3 && 'So we can set your default timezone, currency and statutory templates.'}
            {step === 4 && 'You can skip this and invite teammates later from Employees.'}
          </p>

          <div className="mt-14 flex items-center gap-3">
            {step > 1 ? (
              <button onClick={() => setStep((s) => s - 1)} className="h-11 px-5 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Back</button>
            ) : (
              <button onClick={() => navigate('/login')} className="h-11 px-5 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Cancel</button>
            )}
            {step < 4 ? (
              <button onClick={() => setStep((s) => s + 1)} className="h-11 px-6 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold hover:opacity-90">Continue</button>
            ) : (
              <button onClick={finish} disabled={submitting} className="h-11 px-6 rounded-xl bg-primary text-white text-[13.5px] font-semibold hover:bg-primary/90">
                {submitting ? 'Finishing…' : 'Finish & Go to Dashboard'}
              </button>
            )}
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-2xl border border-border bg-card p-8 lg:p-10">
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Type the name of your company</h2>
                <label className="block mt-5">
                  <FieldLabel required>Company Name</FieldLabel>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </label>
                <label className="block mt-5">
                  <FieldLabel>Company Domain name</FieldLabel>
                  <div className="mt-2 flex rounded-xl border border-border overflow-hidden">
                    <input value={domain} onChange={(e) => setDomain(e.target.value)} className="flex-1 h-12 bg-background px-4 text-[14px] focus:outline-none" />
                    <div className="h-12 px-4 grid place-items-center bg-secondary text-[13px] font-medium text-muted-foreground border-l border-border">.hrline.com</div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[12px] text-muted-foreground"><Info className="h-3.5 w-3.5" /> We will create a unique company URL for you to log into HRDashboard</div>
                </label>
              </div>

              <div>
                <h2 className="text-[18px] font-bold text-foreground">What is the size of your company</h2>
                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SIZES.map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={cn('h-12 rounded-xl border bg-background flex items-center justify-between px-4 text-[13.5px] font-semibold transition-colors', size === s ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-foreground hover:bg-secondary')}>
                      {s}
                      <span className={cn('h-4 w-4 rounded-full border-2 grid place-items-center', size === s ? 'border-primary' : 'border-border')}>
                        {size === s && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Pick your industry</h2>
                <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INDUSTRIES.map((i) => (
                    <button key={i} onClick={() => setIndustry(i)} className={cn('h-14 rounded-xl border bg-background px-4 text-[13.5px] font-semibold text-left transition-colors', industry === i ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-foreground hover:bg-secondary')}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-foreground">Upload logo (optional)</h2>
                <div className="mt-5 rounded-xl border-2 border-dashed border-border bg-background px-6 py-10 text-center">
                  <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center"><Upload className="h-5 w-5" /></div>
                  <div className="mt-3 text-[13.5px] font-semibold text-foreground">Drag & drop your logo</div>
                  <div className="text-[12px] text-muted-foreground">PNG, JPG up to 2MB</div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-[18px] font-bold text-foreground">Company location</h2>
              <label className="block">
                <FieldLabel required>Country</FieldLabel>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]">{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select>
              </label>
              <label className="block">
                <FieldLabel>Street Address</FieldLabel>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main Street" className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><FieldLabel>City</FieldLabel><input className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
                <label className="block"><FieldLabel>Post Code</FieldLabel><input className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-[18px] font-bold text-foreground">Invite your first teammate</h2>
              <label className="block"><FieldLabel>Full Name</FieldLabel><input value={firstEmp.name} onChange={(e) => setFirstEmp({ ...firstEmp, name: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
              <label className="block"><FieldLabel>Work Email</FieldLabel><input type="email" value={firstEmp.email} onChange={(e) => setFirstEmp({ ...firstEmp, email: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
              <label className="block"><FieldLabel>Job Title</FieldLabel><input value={firstEmp.title} onChange={(e) => setFirstEmp({ ...firstEmp, title: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
              <div className="rounded-xl bg-secondary/60 p-4 text-[13px] text-muted-foreground flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> We’ll email them a sign-up link. You can skip and invite later.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
