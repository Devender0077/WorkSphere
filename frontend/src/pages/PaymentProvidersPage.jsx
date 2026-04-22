import React, { useEffect, useState } from 'react';
import { CreditCard, Check, AlertCircle, Loader2, Eye, EyeOff, Key, Webhook } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const PROVIDERS = [
  {
    key: 'stripe',
    name: 'Stripe',
    color: 'bg-indigo-600',
    docsUrl: 'https://dashboard.stripe.com/apikeys',
    fields: [
      { key: 'publishable_key', label: 'Publishable Key', placeholder: 'pk_live_... or pk_test_...', secret: false },
      { key: 'secret_key', label: 'Secret Key', placeholder: 'sk_live_... or sk_test_...', secret: true },
      { key: 'webhook_secret', label: 'Webhook Signing Secret', placeholder: 'whsec_...', secret: true },
    ],
  },
  {
    key: 'razorpay',
    name: 'Razorpay',
    color: 'bg-sky-600',
    docsUrl: 'https://dashboard.razorpay.com/app/keys',
    fields: [
      { key: 'key_id', label: 'Key ID', placeholder: 'rzp_live_... or rzp_test_...', secret: false },
      { key: 'key_secret', label: 'Key Secret', placeholder: '••••••••', secret: true },
      { key: 'webhook_secret', label: 'Webhook Secret', placeholder: '••••••••', secret: true },
    ],
  },
];

const PaymentProvidersPage = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [testResult, setTestResult] = useState({});
  const [show, setShow] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/platform/payment-providers');
      setConfigs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const update = (key, patch) => {
    setConfigs((prev) => {
      const found = prev.find((c) => c.provider === key);
      if (found) return prev.map((c) => c.provider === key ? { ...c, ...patch } : c);
      return [...prev, { provider: key, enabled: false, mode: 'test', ...patch }];
    });
  };

  const save = async (providerKey) => {
    const cfg = configs.find((c) => c.provider === providerKey);
    setSaving(providerKey);
    try {
      const { data } = await api.put(`/platform/payment-providers/${providerKey}`, {
        provider: providerKey,
        enabled: cfg?.enabled ?? false,
        mode: cfg?.mode ?? 'test',
        publishable_key: cfg?.publishable_key || null,
        secret_key: cfg?.secret_key || null,
        webhook_secret: cfg?.webhook_secret || null,
        key_id: cfg?.key_id || null,
        key_secret: cfg?.key_secret || null,
      });
      update(providerKey, data);
      setTestResult((r) => ({ ...r, [providerKey]: { ok: true, message: 'Saved.' } }));
    } catch (e) {
      setTestResult((r) => ({ ...r, [providerKey]: { ok: false, message: e?.response?.data?.detail || 'Save failed' } }));
    } finally {
      setSaving(null);
    }
  };

  const test = async (providerKey) => {
    setSaving(providerKey);
    try {
      const { data } = await api.post(`/platform/payment-providers/${providerKey}/test`);
      setTestResult((r) => ({ ...r, [providerKey]: data }));
    } catch (e) {
      setTestResult((r) => ({ ...r, [providerKey]: { ok: false, message: e?.response?.data?.detail || 'Test failed' } }));
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Payment Providers</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            Configure the payment processors tenants use to pay your platform subscription.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
        <div className="text-[12.5px] text-amber-900 dark:text-amber-200">
          Keys are stored server-side and are never exposed to tenants. Rotate keys periodically and keep production (live) and test keys separate.
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5">
        {PROVIDERS.map((p) => {
          const saved = configs.find((c) => c.provider === p.key) || { enabled: false, mode: 'test' };
          const tr = testResult[p.key];
          return (
            <div key={p.key} className="rounded-2xl border border-border bg-card p-5 sm:p-6" data-testid={`provider-card-${p.key}`}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn('h-12 w-12 rounded-xl text-white grid place-items-center font-bold text-[18px]', p.color)}>{p.name[0]}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-[17px] font-bold text-foreground">{p.name}</div>
                      {saved.enabled && <span className="inline-flex rounded-md bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10.5px] font-bold uppercase dark:bg-emerald-900/40 dark:text-emerald-300">Enabled</span>}
                    </div>
                    <a href={p.docsUrl} target="_blank" rel="noreferrer" className="mt-1 text-[12px] font-semibold text-primary hover:underline inline-flex items-center gap-1">
                      Get API keys →
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex rounded-xl bg-secondary p-1">
                    {['test', 'live'].map((m) => (
                      <button key={m} onClick={() => update(p.key, { mode: m })} className={cn('px-3 py-1 rounded-lg text-[11.5px] font-bold uppercase', saved.mode === m ? 'bg-card shadow-sm' : 'text-muted-foreground')}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-[12.5px] font-semibold text-foreground cursor-pointer">
                    <input type="checkbox" checked={!!saved.enabled} onChange={(e) => update(p.key, { enabled: e.target.checked })} className="h-4 w-4 rounded border-border accent-primary" data-testid={`provider-enable-${p.key}`} />
                    Enabled
                  </label>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {p.fields.map((f) => (
                  <div key={f.key}>
                    <label className="block">
                      <span className="text-[12.5px] font-semibold text-foreground inline-flex items-center gap-1">
                        {f.secret ? <Key className="h-3.5 w-3.5 text-muted-foreground" /> : <Webhook className="h-3.5 w-3.5 text-muted-foreground" />}
                        {f.label}
                      </span>
                      <div className="mt-1.5 relative">
                        <input
                          type={f.secret && !show[`${p.key}.${f.key}`] ? 'password' : 'text'}
                          value={saved[f.key] || ''}
                          onChange={(e) => update(p.key, { [f.key]: e.target.value })}
                          placeholder={saved[`${f.key}_masked`] || f.placeholder}
                          className="w-full h-11 rounded-xl border border-border bg-background pl-3 pr-10 text-[13px]"
                          data-testid={`provider-field-${p.key}-${f.key}`}
                        />
                        {f.secret && (
                          <button type="button" onClick={() => setShow((s) => ({ ...s, [`${p.key}.${f.key}`]: !s[`${p.key}.${f.key}`] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {show[`${p.key}.${f.key}`] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      {saved[`${f.key}_masked`] && !saved[f.key] && <div className="mt-1 text-[11px] text-muted-foreground">Stored: {saved[`${f.key}_masked`]}</div>}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <button onClick={() => save(p.key)} disabled={saving === p.key} className="h-11 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[13px] font-semibold hover:opacity-90 disabled:opacity-50" data-testid={`provider-save-${p.key}`}>
                  {saving === p.key ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => test(p.key)} disabled={saving === p.key} className="h-11 rounded-xl border border-border bg-card px-5 text-[13px] font-semibold hover:bg-secondary" data-testid={`provider-test-${p.key}`}>
                  Test connection
                </button>
                {tr && (
                  <div className={cn('inline-flex items-center gap-2 text-[12.5px] font-semibold rounded-lg px-3 py-2', tr.ok ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300')}>
                    {tr.ok ? <Check className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                    {tr.message || (tr.ok ? 'OK' : 'Failed')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentProvidersPage;
