import React, { useEffect, useState } from 'react';
import { ScanFace, Plug, Wifi, WifiOff, Check, X as XIcon, RefreshCw, Copy, Loader2, Trash2, Plus, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const VENDORS = {
  essl: { name: 'eSSL', desc: 'Real-time push & sync with eSSL biometric devices (X990, K30 Pro, iClock Series).', color: 'bg-sky-500/10 text-sky-600', docsUrl: '#' },
  ezteck: { name: 'eZTeck', desc: 'Cloud sync with eZTeck face & fingerprint terminals. Supports adms push protocol.', color: 'bg-emerald-500/10 text-emerald-600', docsUrl: '#' },
};

const INITIAL_DEVICES = [
  { id: 'd1', vendor: 'essl', name: 'HQ — Main Entrance', serial: 'ESL-4421-99', ip: '10.0.12.54', port: 4370, status: 'online', lastSync: 'just now', employees: 42 },
  { id: 'd2', vendor: 'essl', name: 'HQ — Exit Gate', serial: 'ESL-4421-42', ip: '10.0.12.55', port: 4370, status: 'online', lastSync: '2 min ago', employees: 42 },
  { id: 'd3', vendor: 'ezteck', name: 'Branch — Jakarta', serial: 'EZT-7743-18', ip: '10.12.7.9', port: 8080, status: 'offline', lastSync: '24 min ago', employees: 19 },
];

const WEBHOOK_URL = 'https://hr-management-ui-1.preview.emergentagent.com/api/biometric/webhook';

const BiometricSettingsPage = () => {
  const [enabled, setEnabled] = useState({ essl: true, ezteck: true });
  const [pushMode, setPushMode] = useState('realtime'); // realtime | polling
  const [pollInterval, setPollInterval] = useState(60);
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [adding, setAdding] = useState(null); // vendor key or null
  const [newDev, setNewDev] = useState({ name: '', serial: '', ip: '', port: 4370 });
  const [testing, setTesting] = useState(null);
  const [copied, setCopied] = useState(false);

  // Simulate live device heartbeat updates
  useEffect(() => {
    const t = setInterval(() => {
      setDevices((ds) => ds.map((d) => d.status === 'online' ? { ...d, lastSync: 'just now' } : d));
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const testConnection = async (id) => {
    setTesting(id);
    await new Promise((r) => setTimeout(r, 1200));
    setDevices((ds) => ds.map((d) => d.id === id ? { ...d, status: Math.random() > 0.15 ? 'online' : 'offline', lastSync: 'just now' } : d));
    setTesting(null);
  };

  const addDevice = () => {
    if (!newDev.name || !newDev.serial || !newDev.ip) return;
    setDevices([{ id: `d${Date.now()}`, vendor: adding, ...newDev, port: Number(newDev.port) || 4370, status: 'pending', lastSync: '—', employees: 0 }, ...devices]);
    setAdding(null);
    setNewDev({ name: '', serial: '', ip: '', port: 4370 });
  };

  const removeDevice = (id) => setDevices((ds) => ds.filter((d) => d.id !== id));

  const copyWebhook = () => { navigator.clipboard?.writeText(WEBHOOK_URL); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Biometric &amp; Face Recognition</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Enable vendor integrations, register devices and sync attendance in real time.</p>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60 px-4 py-3 text-[12.5px]">
        <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
        Device sync status below is <b>MOCKED</b> for demo. Point real devices at your webhook URL to receive live events.
      </div>

      {/* Vendor cards */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Object.entries(VENDORS).map(([key, v]) => (
          <div key={key} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn('h-11 w-11 rounded-xl grid place-items-center', v.color)}><ScanFace className="h-5 w-5" /></div>
                <div>
                  <div className="text-[17px] font-bold text-foreground">{v.name}</div>
                  <div className="text-[12px] text-muted-foreground max-w-sm">{v.desc}</div>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <span className="text-[12px] font-semibold text-muted-foreground">{enabled[key] ? 'Enabled' : 'Disabled'}</span>
                <span className={cn('relative h-6 w-11 rounded-full transition-colors', enabled[key] ? 'bg-primary' : 'bg-secondary')} onClick={() => setEnabled({ ...enabled, [key]: !enabled[key] })}>
                  <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', enabled[key] ? 'left-[22px]' : 'left-0.5')} />
                </span>
              </label>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-secondary/60 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">Devices</div>
                <div className="text-[16px] font-bold text-foreground">{devices.filter((d) => d.vendor === key).length}</div>
              </div>
              <div className="rounded-xl bg-secondary/60 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">Online</div>
                <div className="text-[16px] font-bold text-emerald-600">{devices.filter((d) => d.vendor === key && d.status === 'online').length}</div>
              </div>
              <div className="rounded-xl bg-secondary/60 px-3 py-2">
                <div className="text-[11px] text-muted-foreground">Sync Mode</div>
                <div className="text-[13px] font-bold text-foreground capitalize">{pushMode}</div>
              </div>
            </div>

            <button onClick={() => setAdding(key)} disabled={!enabled[key]} className="mt-4 w-full h-10 rounded-xl bg-[hsl(var(--navy))] text-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50"><Plus className="h-4 w-4" /> Add {v.name} device</button>
          </div>
        ))}
      </div>

      {/* Sync settings */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-6">
        <h3 className="text-[16px] font-bold text-foreground">Real-time Sync</h3>
        <p className="text-[12.5px] text-muted-foreground">Configure how events flow from devices into HRDashboard.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <div className="rounded-xl border border-border bg-background p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0 font-mono text-[12.5px] text-foreground truncate">{WEBHOOK_URL}</div>
            <button onClick={copyWebhook} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-[12.5px] font-semibold">
              {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
            </button>
          </div>
          <div className="inline-flex rounded-xl bg-secondary p-1">
            {['realtime', 'polling'].map((m) => (
              <button key={m} onClick={() => setPushMode(m)} className={cn('px-4 py-1.5 rounded-lg text-[12.5px] font-semibold capitalize', pushMode === m ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground')}>{m}</button>
            ))}
          </div>
        </div>
        {pushMode === 'polling' && (
          <div className="mt-3 flex items-center gap-3 text-[13px]">
            <span className="text-muted-foreground">Poll every</span>
            <input type="number" min="10" value={pollInterval} onChange={(e) => setPollInterval(Number(e.target.value))} className="w-24 h-10 rounded-lg border border-border bg-background px-3" />
            <span className="text-muted-foreground">seconds</span>
          </div>
        )}
      </div>

      {/* Devices table */}
      <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <div className="text-[16px] font-bold text-foreground">Registered Devices</div>
            <div className="text-[12px] text-muted-foreground">Live heartbeat from your biometric terminals.</div>
          </div>
        </div>
        <table className="w-full text-[13px] min-w-[880px]">
          <thead className="border-b border-border">
            <tr className="text-left text-primary">
              <th className="p-4 font-semibold">Device</th>
              <th className="p-4 font-semibold">Vendor</th>
              <th className="p-4 font-semibold">IP : Port</th>
              <th className="p-4 font-semibold">Serial</th>
              <th className="p-4 font-semibold">Employees</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Last Sync</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {devices.map((d) => (
              <tr key={d.id} className="hover:bg-secondary/40">
                <td className="p-4 font-semibold text-foreground">{d.name}</td>
                <td className="p-4 text-foreground">{VENDORS[d.vendor].name}</td>
                <td className="p-4 font-mono text-[12.5px] text-foreground">{d.ip}:{d.port}</td>
                <td className="p-4 font-mono text-[12.5px] text-muted-foreground">{d.serial}</td>
                <td className="p-4 text-foreground">{d.employees}</td>
                <td className="p-4">
                  {d.status === 'online' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"><Wifi className="h-3 w-3" /><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online</span>
                  ) : d.status === 'offline' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"><WifiOff className="h-3 w-3" /> Offline</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Pending</span>
                  )}
                </td>
                <td className="p-4 text-muted-foreground">{d.lastSync}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => testConnection(d.id)} disabled={testing === d.id} className="h-8 px-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-[12px] font-semibold inline-flex items-center gap-1">
                      {testing === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />} Test
                    </button>
                    <button onClick={() => removeDevice(d.id)} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white hover:opacity-90"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {devices.length === 0 && <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">No devices registered yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {adding && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAdding(null)} />
          <aside className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-card border-l border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-7 pt-7 pb-4">
              <h2 className="text-[20px] font-bold text-foreground">Add {VENDORS[adding].name} Device</h2>
              <button onClick={() => setAdding(null)} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><XIcon className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-4">
              <label className="block"><span className="text-[13px] font-medium text-foreground">Device Name</span><input value={newDev.name} onChange={(e) => setNewDev({ ...newDev, name: e.target.value })} placeholder="HQ Main Gate" className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" /></label>
              <label className="block"><span className="text-[13px] font-medium text-foreground">Serial Number</span><input value={newDev.serial} onChange={(e) => setNewDev({ ...newDev, serial: e.target.value })} placeholder="ESL-XXXX-XX" className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] font-mono" /></label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block col-span-1"><span className="text-[13px] font-medium text-foreground">Device IP</span><input value={newDev.ip} onChange={(e) => setNewDev({ ...newDev, ip: e.target.value })} placeholder="10.0.12.54" className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] font-mono" /></label>
                <label className="block col-span-1"><span className="text-[13px] font-medium text-foreground">Port</span><input type="number" value={newDev.port} onChange={(e) => setNewDev({ ...newDev, port: e.target.value })} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px] font-mono" /></label>
              </div>
            </div>
            <div className="px-7 pb-7 pt-4 border-t border-border flex items-center gap-3">
              <button onClick={() => setAdding(null)} className="flex-1 h-12 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Cancel</button>
              <button onClick={addDevice} className="flex-1 h-12 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold hover:opacity-90"><Plug className="inline h-4 w-4 mr-1" /> Register</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default BiometricSettingsPage;
