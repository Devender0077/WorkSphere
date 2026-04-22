import React, { useState } from 'react';
import { Check, ArrowLeft, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const PLANS = [
  { key: 'starter', name: 'Starter', price: 29, perEmp: 5, desc: 'For small teams getting started', features: ['Up to 10 employees', 'Basic attendance', 'Leave management', 'Email support'], cta: 'Start Free Trial' },
  { key: 'engage', name: 'Engage', price: 72, perEmp: 9, desc: 'Most popular — for growing teams', popular: true, features: ['Up to 100 employees', 'Payroll + Payslips', 'Performance reviews', 'Biometric devices', 'Priority support'], cta: 'Pick Engage' },
  { key: 'enterprise', name: 'Enterprise', price: 240, perEmp: 16, desc: 'For large organizations at scale', features: ['Unlimited employees', 'Dedicated success manager', 'Custom SSO & SAML', 'API + Webhooks', 'Advanced audit logs', 'SLA 99.9%'], cta: 'Contact Sales' },
];

export const SubscriptionPlansPage = () => {
  const [billing, setBilling] = useState('year');
  const [current] = useState('engage');
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Subscription</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Choose a plan that fits your company size and needs.</p>
        </div>
        <div className="inline-flex rounded-xl bg-secondary p-1">
          <button onClick={() => setBilling('month')} className={cn('px-4 py-1.5 rounded-lg text-[12.5px] font-semibold', billing === 'month' ? 'bg-card shadow-sm' : 'text-muted-foreground')}>Monthly</button>
          <button onClick={() => setBilling('year')} className={cn('px-4 py-1.5 rounded-lg text-[12.5px] font-semibold', billing === 'year' ? 'bg-card shadow-sm' : 'text-muted-foreground')}>Annual <span className="ml-1 text-[10px] text-primary">−20%</span></button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {PLANS.map((p) => {
          const price = billing === 'year' ? p.price : Math.round(p.price * 1.2 / 12);
          const isCurrent = current === p.key;
          return (
            <div key={p.key} className={cn('relative rounded-2xl border bg-card p-6', p.popular ? 'border-primary/40 shadow-lg shadow-primary/10' : 'border-border')}>
              {p.popular && <div className="absolute -top-3 left-6 text-[10.5px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-primary text-white">Most Popular</div>}
              <div className="text-[18px] font-bold text-foreground">{p.name}</div>
              <div className="text-[12.5px] text-muted-foreground min-h-[36px]">{p.desc}</div>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-[34px] font-extrabold text-foreground">US${price}</span>
                <span className="mb-1 text-[12px] text-muted-foreground">/ {billing === 'year' ? 'year' : 'month'}</span>
              </div>
              <div className="text-[11.5px] text-muted-foreground">US${p.perEmp} per employee</div>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => <li key={f} className="flex items-center gap-2 text-[13px] text-foreground"><Check className="h-4 w-4 text-primary" />{f}</li>)}
              </ul>
              <button onClick={() => navigate(`/billing/checkout/${p.key}`)} disabled={isCurrent} className={cn('mt-6 w-full h-11 rounded-xl font-semibold text-[13.5px]', isCurrent ? 'bg-secondary text-muted-foreground cursor-not-allowed' : p.popular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-[hsl(var(--navy))] text-white hover:opacity-90')}>
                {isCurrent ? 'Current Plan' : p.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h3 className="text-[16px] font-bold text-foreground">Billing history</h3>
        <div className="mt-3 divide-y divide-border">
          {[
            { id: 'INV-001', date: '01 Apr 2025', amount: 'US$72.00', status: 'Paid' },
            { id: 'INV-002', date: '01 Mar 2025', amount: 'US$72.00', status: 'Paid' },
            { id: 'INV-003', date: '01 Feb 2025', amount: 'US$72.00', status: 'Paid' },
          ].map((inv) => (
            <Link to={`/billing/invoice/${inv.id}`} key={inv.id} className="flex items-center justify-between py-3 hover:bg-secondary/30 px-2 rounded-lg">
              <div><div className="text-[13.5px] font-semibold text-foreground">{inv.id}</div><div className="text-[11.5px] text-muted-foreground">{inv.date}</div></div>
              <div className="text-[13px] font-semibold text-foreground">{inv.amount}</div>
              <span className="inline-flex rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{inv.status}</span>
              <span className="text-primary text-[12px] font-semibold">View</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ card: '', mmyy: '', cvc: '', name: '', country: 'Indonesia', address: '', city: '', province: '', code: '' });
  const submit = () => {
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); alert('Payment successful (MOCK). Thank you!'); navigate('/billing'); }, 900);
  };
  return (
    <div className="min-h-[calc(100vh-160px)] grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border">
      <div className="bg-primary text-white p-8 lg:p-12 relative">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-white/80 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="mt-10">
          <div className="text-[13px] text-white/70">Subscribe to Engage Plans</div>
          <div className="mt-2 flex items-end gap-2"><div className="text-[48px] font-extrabold">US$72,00</div><div className="mb-2 text-[11px] uppercase tracking-wide">PER<br/>YEAR</div></div>
        </div>
        <div className="my-8 border-t border-white/20" />
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><div className="text-[14px] font-semibold">Engage Plan</div><div className="text-[11.5px] text-white/70">Billed annually • US$72.00 per employee</div></div><div className="font-semibold">US$72,00</div></div>
          <div className="flex items-center justify-between"><div className="text-[14px]">Sub Total</div><div className="font-semibold">US$72,00</div></div>
        </div>
        <div className="my-8 border-t border-white/20" />
        <div className="flex items-center justify-between"><div className="text-[14px]">Promo Code <button className="ml-2 rounded-md bg-white/20 px-2 py-0.5 text-[10.5px] font-bold">INPUT CODE</button></div><div className="font-semibold">$0</div></div>
        <div className="my-8 border-t border-white/20" />
        <div className="flex items-center justify-between"><div className="text-[14px] font-semibold">Total</div><div className="text-[20px] font-extrabold">US$72,00</div></div>
      </div>
      <div className="bg-card p-8 lg:p-12">
        <h2 className="text-[24px] font-bold text-foreground">Pay with card</h2>
        <div className="mt-2 text-[13px] text-muted-foreground">Email : contact@unpixel.com</div>
        <label className="block mt-6"><span className="text-[13px] font-medium text-foreground">Card Information <span className="text-rose-500">*</span></span>
          <input value={form.card} onChange={(e) => setForm({ ...form, card: e.target.value })} placeholder="1234 1234 1234 1234" className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
          <div className="mt-2 grid grid-cols-2 gap-3">
            <input value={form.mmyy} onChange={(e) => setForm({ ...form, mmyy: e.target.value })} placeholder="MM/YY" className="h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
            <input value={form.cvc} onChange={(e) => setForm({ ...form, cvc: e.target.value })} placeholder="CVC" className="h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
          </div>
        </label>
        <label className="block mt-5"><span className="text-[13px] font-medium text-foreground">Name On Card <span className="text-rose-500">*</span></span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Input your full name" className="mt-2 w-full h-12 rounded-xl border border-primary bg-background px-4 text-[14px]" />
        </label>
        <div className="mt-5"><span className="text-[13px] font-medium text-foreground">Address <span className="text-rose-500">*</span></span>
          <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]"><option>Indonesia</option><option>Singapore</option><option>United States</option></select>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="mt-3 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="mt-3 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} placeholder="Province" className="h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Code" className="h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
          </div>
        </div>
        <button onClick={submit} disabled={submitting} className="mt-6 w-full h-12 rounded-xl bg-[hsl(var(--navy))] text-white text-[14px] font-semibold hover:opacity-90 inline-flex items-center justify-center gap-2"><Lock className="h-4 w-4" /> {submitting ? 'Processing…' : 'Subscribe'}</button>
        <p className="mt-3 text-[11px] text-muted-foreground">By confirming your subscription, you authorize HRDashboard Inc. to charge your card for this payment and future payments according to their terms. Payments are MOCKED in demo.</p>
      </div>
    </div>
  );
};

export const InvoicePage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-foreground hover:text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back</button>
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-10 w-10 rounded-lg bg-primary grid place-items-center text-white font-extrabold">H</div>
            <div className="mt-3 text-[13px] text-muted-foreground">HRDashboard Inc.<br/>123 Sudirman Street, Jakarta</div>
          </div>
          <div className="text-right">
            <div className="text-[22px] font-bold text-foreground">Invoice</div>
            <div className="text-[12.5px] text-muted-foreground mt-1">INV-001 • 01 Apr 2025</div>
            <span className="mt-2 inline-flex rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase bg-emerald-100 text-emerald-700">Paid</span>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 text-[13px]">
          <div><div className="text-muted-foreground">Billed to</div><div className="font-semibold text-foreground">Acme Corp<br/>Pristia Candra<br/>admin@acme.com</div></div>
          <div><div className="text-muted-foreground">Payment</div><div className="font-semibold text-foreground">Visa •••• 4242<br/>Paid on 01 Apr 2025</div></div>
        </div>
        <table className="mt-8 w-full text-[13px]"><thead className="border-b border-border text-left text-muted-foreground"><tr><th className="py-2 font-semibold">Description</th><th className="py-2 font-semibold text-right">Qty</th><th className="py-2 font-semibold text-right">Amount</th></tr></thead><tbody className="divide-y divide-border">
          <tr><td className="py-3 text-foreground">Engage Plan — Annual</td><td className="py-3 text-right">1</td><td className="py-3 text-right text-foreground">$72.00</td></tr>
        </tbody></table>
        <div className="mt-6 ml-auto w-64 space-y-2 text-[13px]">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>$72.00</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>$0.00</span></div>
          <div className="flex justify-between font-bold text-foreground border-t border-border pt-2"><span>Total</span><span>$72.00</span></div>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <button onClick={() => window.print()} className="h-11 rounded-xl bg-primary text-white px-5 text-[13px] font-semibold">Download PDF</button>
          <button className="h-11 rounded-xl border border-border bg-card px-5 text-[13px] font-semibold hover:bg-secondary">Email Receipt</button>
        </div>
      </div>
    </div>
  );
};
