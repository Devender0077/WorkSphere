import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Upload, Type, CalendarDays, CheckSquare, PenLine, Stamp, Trash2, Send, Check, Clock, X, Eye, Users, ArrowLeft, Download, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

const FIELD_TYPES = [
  { key: 'text', label: 'Text', Icon: Type, color: 'bg-sky-500' },
  { key: 'date', label: 'Date', Icon: CalendarDays, color: 'bg-amber-500' },
  { key: 'checkbox', label: 'Checkbox', Icon: CheckSquare, color: 'bg-violet-500' },
  { key: 'signature', label: 'Signature', Icon: PenLine, color: 'bg-primary' },
  { key: 'stamp', label: 'Stamp', Icon: Stamp, color: 'bg-rose-500' },
];

const DOCUMENTS = [
  { id: 'd1', title: 'MoU — Acme x Unpixel', status: 'Pending', parties: 2, signed: 1, from: 'Alex Morgan', updated: '2 hours ago' },
  { id: 'd2', title: 'Employment Contract — Hanna', status: 'Completed', parties: 2, signed: 2, from: 'Pristia Candra', updated: 'Yesterday' },
  { id: 'd3', title: 'NDA — Vendor Agreement', status: 'Pending', parties: 3, signed: 1, from: 'Pristia Candra', updated: '3 days ago' },
  { id: 'd4', title: 'Offer Letter — James George', status: 'Declined', parties: 2, signed: 0, from: 'Pristia Candra', updated: '1 week ago' },
];

const TEMPLATES = [
  { id: 't1', name: 'Employment Contract', fields: 8, uses: 42, updated: '12 Mar 2025' },
  { id: 't2', name: 'Non-Disclosure Agreement', fields: 5, uses: 28, updated: '28 Feb 2025' },
  { id: 't3', name: 'Memorandum of Understanding', fields: 12, uses: 9, updated: '05 Mar 2025' },
  { id: 't4', name: 'Offer Letter', fields: 6, uses: 36, updated: '18 Mar 2025' },
];

const STATUS_COLOR = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Declined: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Draft: 'bg-secondary text-muted-foreground',
};

export const ESignInboxPage = () => {
  const [tab, setTab] = useState('All');
  const filtered = DOCUMENTS.filter((d) => tab === 'All' ? true : d.status === tab);
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">E-Sign</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Send, sign and manage documents in-platform — your own DocuSign.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/esign/templates" className="inline-flex items-center gap-2 h-11 rounded-xl border border-border bg-card px-4 text-[13.5px] font-semibold hover:bg-secondary">Templates</Link>
          <Link to="/esign/builder/new" className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> New Document</Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { l: 'Waiting for me', v: 1, c: 'text-amber-600' },
          { l: 'Waiting for others', v: 2, c: 'text-sky-600' },
          { l: 'Completed', v: 1, c: 'text-primary' },
          { l: 'Declined', v: 1, c: 'text-rose-600' },
        ].map((s) => (<div key={s.l} className="rounded-2xl border border-border bg-card p-5"><div className="text-[12px] text-muted-foreground">{s.l}</div><div className={cn('mt-2 text-[28px] font-bold', s.c)}>{s.v}</div></div>))}
      </div>

      <div className="mt-5 inline-flex rounded-xl bg-secondary p-1">
        {['All', 'Pending', 'Completed', 'Declined'].map((t) => (<button key={t} onClick={() => setTab(t)} className={cn('px-4 py-1.5 rounded-lg text-[12.5px] font-semibold', tab === t ? 'bg-card shadow-sm' : 'text-muted-foreground')}>{t}</button>))}
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-[13px] min-w-[780px]">
          <thead className="border-b border-border"><tr className="text-left text-primary">
            <th className="p-4 font-semibold">Document</th><th className="p-4 font-semibold">From</th><th className="p-4 font-semibold">Signers</th><th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold">Updated</th><th className="p-4 font-semibold">Action</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {filtered.map((d) => (<tr key={d.id} className="hover:bg-secondary/40">
              <td className="p-4"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><FileText className="h-5 w-5" /></div><div className="font-semibold text-foreground">{d.title}</div></div></td>
              <td className="p-4 text-foreground">{d.from}</td>
              <td className="p-4"><div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" />{d.signed}/{d.parties}</div></td>
              <td className="p-4"><span className={cn('inline-flex rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase', STATUS_COLOR[d.status])}>{d.status}</span></td>
              <td className="p-4 text-muted-foreground">{d.updated}</td>
              <td className="p-4"><Link to={`/esign/sign/${d.id}`} className="inline-flex items-center gap-1 text-primary font-semibold"><Eye className="h-4 w-4" /> View</Link></td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ESignTemplatesPage = () => (
  <div>
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div><Link to="/esign" className="inline-flex items-center gap-2 text-foreground hover:text-primary mb-2"><ArrowLeft className="h-4 w-4" /> Back to E-Sign</Link><h1 className="text-[30px] font-bold text-foreground">Templates</h1><p className="mt-1 text-[13.5px] text-muted-foreground">Reusable document templates with pre-placed fields.</p></div>
      <Link to="/esign/builder/new?template=true" className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> New Template</Link>
    </div>
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {TEMPLATES.map((t) => (
        <div key={t.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="h-32 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border grid place-items-center"><FileText className="h-10 w-10 text-primary" /></div>
          <div className="mt-4 flex items-start justify-between">
            <div><div className="text-[15px] font-bold text-foreground">{t.name}</div><div className="text-[12px] text-muted-foreground">{t.fields} fields • used {t.uses}x</div></div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Link to={`/esign/builder/${t.id}?template=true`} className="flex-1 h-10 rounded-xl border border-border bg-card hover:bg-secondary text-[12.5px] font-semibold grid place-items-center">Edit</Link>
            <button className="h-10 w-10 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/80"><Copy className="h-4 w-4" /></button>
            <Link to="/esign/builder/new" className="h-10 rounded-xl bg-primary text-white px-3 text-[12.5px] font-semibold grid place-items-center">Use</Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ESignBuilderPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 upload, 2 fields, 3 signers
  const [docName, setDocName] = useState('Untitled Document');
  const [fileName, setFileName] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedType, setSelectedType] = useState('signature');
  const [signers, setSigners] = useState([{ name: 'Pristia Candra', email: 'admin@acme.com', role: 'Sender', order: 1 }, { name: '', email: '', role: 'Signer', order: 2 }]);
  const [message, setMessage] = useState('Please review and sign this document.');
  const [sending, setSending] = useState(false);
  const canvasRef = useRef(null);

  const onUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name); setDocName(f.name.replace(/\.[^.]+$/, '')); setStep(2);
  };
  const addFieldAt = (e) => {
    if (!selectedType || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const type = FIELD_TYPES.find((t) => t.key === selectedType);
    setFields([...fields, { id: `f${Date.now()}`, type: selectedType, x, y, w: type.key === 'signature' || type.key === 'stamp' ? 18 : 14, h: type.key === 'signature' || type.key === 'stamp' ? 6 : 4, signer: 2 }]);
  };
  const removeField = (id, e) => { e.stopPropagation(); setFields(fields.filter((f) => f.id !== id)); };
  const send = () => { setSending(true); setTimeout(() => { setSending(false); alert('Document sent for signature (MOCK). Signers will receive an email.'); navigate('/esign'); }, 900); };

  const steps = ['Upload', 'Place Fields', 'Add Signers'];

  return (
    <div>
      <Link to="/esign" className="inline-flex items-center gap-2 text-foreground hover:text-primary mb-2"><ArrowLeft className="h-4 w-4" /> Exit builder</Link>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <input value={docName} onChange={(e) => setDocName(e.target.value)} className="text-[26px] font-bold text-foreground bg-transparent focus:outline-none focus:bg-secondary/50 rounded-lg px-2 -mx-2" />
          <p className="mt-1 text-[13px] text-muted-foreground">Design your document and route for signatures.</p>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (<div key={s} className="flex items-center gap-2">
            <span className={cn('h-7 w-7 grid place-items-center rounded-full text-[12px] font-bold', step > i + 1 ? 'bg-primary text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground')}>{step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
            <span className={cn('text-[12.5px] font-semibold hidden sm:inline', step === i + 1 ? 'text-foreground' : 'text-muted-foreground')}>{s}</span>
            {i < 2 && <span className="w-6 h-px bg-border mx-1" />}
          </div>))}
        </div>
      </div>

      {step === 1 && (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-border bg-card p-16 text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 text-primary grid place-items-center"><Upload className="h-6 w-6" /></div>
          <div className="mt-4 text-[16px] font-bold text-foreground">Upload PDF or Word document</div>
          <div className="text-[12.5px] text-muted-foreground">Drag & drop or click to browse • up to 20 MB</div>
          <label className="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[hsl(var(--navy))] text-white text-[13px] font-semibold cursor-pointer hover:opacity-90">
            <Upload className="h-4 w-4" /> Choose file
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={onUpload} />
          </label>
          <div className="mt-6 text-[12px] text-muted-foreground">Or <button onClick={() => { setFileName('sample-mou.pdf'); setStep(2); }} className="text-primary font-semibold">use a sample document</button></div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          <div className="rounded-2xl border border-border bg-card p-3 self-start">
            <div className="px-2 py-2 text-[11px] font-bold uppercase text-muted-foreground tracking-wide">Field tools</div>
            {FIELD_TYPES.map((f) => (<button key={f.key} onClick={() => setSelectedType(f.key)} className={cn('w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-left', selectedType === f.key ? 'bg-primary/10 text-primary border border-primary/40' : 'text-foreground hover:bg-secondary')}>
              <span className={cn('h-8 w-8 rounded-lg text-white grid place-items-center', f.color)}><f.Icon className="h-4 w-4" /></span>
              {f.label}
            </button>))}
            <div className="mt-3 px-2 py-2 text-[11px] text-muted-foreground">Click on the page to drop a field. Click the × on a field to remove it.</div>
          </div>

          <div>
            <div className="text-[11.5px] text-muted-foreground mb-2">File: <span className="font-semibold text-foreground">{fileName}</span></div>
            <div ref={canvasRef} onClick={addFieldAt} className="relative w-full rounded-2xl border border-border bg-white dark:bg-slate-100 shadow-inner cursor-crosshair" style={{ aspectRatio: '8.5 / 11' }}>
              {/* fake document content */}
              <div className="absolute inset-0 p-10 pointer-events-none text-slate-800">
                <div className="text-[26px] font-bold">Memorandum of Understanding</div>
                <div className="mt-2 text-[12px] text-slate-500">Between Acme Corp and Unpixel Studio</div>
                <div className="mt-8 text-[12px] leading-6">This agreement, entered into on this day by and between Acme Corp and Unpixel Studio, outlines the terms of collaboration between the two parties. Both parties agree to the following conditions as set forth below. The purpose of this MoU is to formalize the partnership and define respective responsibilities, deliverables and timelines.</div>
                <div className="mt-6 text-[12px] leading-6">Party A shall provide project management services. Party B shall provide design and development resources. Any amendments to this agreement must be made in writing and signed by both parties.</div>
                <div className="mt-16 grid grid-cols-2 gap-10 text-[12px]">
                  <div>
                    <div className="border-t border-slate-400 pt-2 font-semibold">Party A — Signature</div>
                    <div className="mt-1 text-slate-500">Date: ____________</div>
                  </div>
                  <div>
                    <div className="border-t border-slate-400 pt-2 font-semibold">Party B — Signature</div>
                    <div className="mt-1 text-slate-500">Date: ____________</div>
                  </div>
                </div>
              </div>
              {fields.map((f) => {
                const meta = FIELD_TYPES.find((t) => t.key === f.type);
                return (
                  <div key={f.id} onClick={(e) => e.stopPropagation()} className="absolute group" style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, height: `${f.h}%` }}>
                    <div className={cn('h-full w-full rounded-md border-2 border-dashed bg-white/90 flex items-center gap-1.5 px-2 text-[11px] font-semibold text-slate-800', meta.color.replace('bg-', 'border-'))}>
                      <meta.Icon className="h-3 w-3" /> {meta.label} #{signers.findIndex((s) => s.order === f.signer) + 1 || '?'}
                    </div>
                    <button onClick={(e) => removeField(f.id, e)} className="absolute -top-2 -right-2 h-5 w-5 grid place-items-center rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100"><X className="h-3 w-3" /></button>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-[12.5px] text-muted-foreground">{fields.length} field{fields.length !== 1 ? 's' : ''} placed</div>
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="h-11 rounded-xl border border-border bg-card px-5 text-[13px] font-semibold hover:bg-secondary">Back</button>
                <button onClick={() => setStep(3)} disabled={fields.length === 0} className="h-11 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[13px] font-semibold disabled:opacity-50">Continue to signers</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 max-w-2xl">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-[16px] font-bold text-foreground">Who needs to sign?</h3>
            <div className="mt-4 space-y-3">
              {signers.map((s, i) => (<div key={i} className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center text-[13px] font-bold">{s.order}</span>
                <input value={s.name} onChange={(e) => { const a = [...signers]; a[i].name = e.target.value; setSigners(a); }} placeholder="Full name" className="flex-1 h-11 rounded-xl border border-border bg-background px-3 text-[13px]" />
                <input value={s.email} onChange={(e) => { const a = [...signers]; a[i].email = e.target.value; setSigners(a); }} placeholder="email@example.com" className="flex-[1.3] h-11 rounded-xl border border-border bg-background px-3 text-[13px]" />
                <select value={s.role} onChange={(e) => { const a = [...signers]; a[i].role = e.target.value; setSigners(a); }} className="h-11 rounded-xl border border-border bg-background px-2 text-[12.5px]"><option>Signer</option><option>Viewer</option><option>Approver</option></select>
              </div>))}
              <button onClick={() => setSigners([...signers, { name: '', email: '', role: 'Signer', order: signers.length + 1 }])} className="inline-flex items-center gap-2 h-10 rounded-xl bg-secondary hover:bg-secondary/80 px-3 text-[12.5px] font-semibold"><Plus className="h-3.5 w-3.5" /> Add signer</button>
            </div>
            <label className="block mt-5"><span className="text-[13px] font-medium text-foreground">Message</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-border bg-background p-4 text-[13px]" /></label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => setStep(2)} className="h-11 rounded-xl border border-border bg-card px-5 text-[13px] font-semibold hover:bg-secondary">Back</button>
            <button onClick={send} disabled={sending} className="flex-1 h-11 rounded-xl bg-primary text-white px-5 text-[13px] font-semibold inline-flex items-center justify-center gap-2"><Send className="h-4 w-4" /> {sending ? 'Sending…' : 'Send for signature'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ESignSignPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  const [sigOpen, setSigOpen] = useState(false);
  const [signing, setSigning] = useState(false);
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const demoFields = [
    { id: 'f1', type: 'text', label: 'Your full name', x: 10, y: 72, w: 28, h: 4 },
    { id: 'f2', type: 'date', label: 'Date', x: 10, y: 78, w: 16, h: 4 },
    { id: 'f3', type: 'signature', label: 'Signature', x: 52, y: 72, w: 28, h: 7 },
    { id: 'f4', type: 'checkbox', label: 'I agree to terms', x: 52, y: 82, w: 6, h: 4 },
  ];

  const startDraw = (e) => { drawing.current = true; const c = canvasRef.current; const ctx = c.getContext('2d'); ctx.lineWidth = 2; ctx.strokeStyle = '#0F172A'; ctx.lineCap = 'round'; ctx.beginPath(); const r = c.getBoundingClientRect(); ctx.moveTo((e.clientX || e.touches[0].clientX) - r.left, (e.clientY || e.touches[0].clientY) - r.top); };
  const draw = (e) => { if (!drawing.current) return; const c = canvasRef.current; const ctx = c.getContext('2d'); const r = c.getBoundingClientRect(); ctx.lineTo((e.clientX || e.touches?.[0]?.clientX) - r.left, (e.clientY || e.touches?.[0]?.clientY) - r.top); ctx.stroke(); };
  const endDraw = () => { drawing.current = false; };
  const clearSig = () => { const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); };
  const applySig = () => { const c = canvasRef.current; setValues({ ...values, f3: c.toDataURL() }); setSigOpen(false); };

  const submit = () => { setSigning(true); setTimeout(() => { setSigning(false); alert('Document signed (MOCK). All parties will be notified.'); navigate('/esign'); }, 900); };

  return (
    <div>
      <Link to="/esign" className="inline-flex items-center gap-2 text-foreground hover:text-primary mb-2"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div><h1 className="text-[26px] font-bold text-foreground">MoU — Acme x Unpixel</h1><p className="mt-1 text-[13px] text-muted-foreground">Please review and complete the highlighted fields.</p></div>
        <button className="inline-flex items-center gap-2 h-11 rounded-xl border border-border bg-card px-4 text-[13px] font-semibold hover:bg-secondary"><Download className="h-4 w-4" /> Download</button>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 px-4 py-3 text-[13px] flex items-center gap-2"><Clock className="h-4 w-4" /> 4 fields remaining. Click a highlighted field to fill it in.</div>

      <div className="mt-4 relative w-full max-w-4xl mx-auto rounded-2xl border border-border bg-white dark:bg-slate-100 shadow" style={{ aspectRatio: '8.5 / 11' }}>
        <div className="absolute inset-0 p-10 pointer-events-none text-slate-800">
          <div className="text-[26px] font-bold">Memorandum of Understanding</div>
          <div className="mt-2 text-[12px] text-slate-500">Between Acme Corp and Unpixel Studio</div>
          <div className="mt-8 text-[12px] leading-6">This agreement, entered into on this day by and between Acme Corp and Unpixel Studio, outlines the terms of collaboration between the two parties...</div>
        </div>
        {demoFields.map((f) => {
          const filled = !!values[f.id];
          return (
            <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, height: `${f.h}%` }}>
              {f.type === 'text' && (<input value={values[f.id] || ''} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} placeholder={f.label} className={cn('h-full w-full rounded border px-2 text-[12px] font-semibold bg-yellow-50 text-slate-800', filled ? 'border-emerald-500' : 'border-amber-500')} />)}
              {f.type === 'date' && (<input type="date" value={values[f.id] || ''} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} className={cn('h-full w-full rounded border px-2 text-[12px] bg-yellow-50 text-slate-800', filled ? 'border-emerald-500' : 'border-amber-500')} />)}
              {f.type === 'checkbox' && (<button onClick={() => setValues({ ...values, [f.id]: !values[f.id] })} className={cn('h-full w-full rounded border grid place-items-center bg-yellow-50', filled ? 'border-emerald-500 bg-primary text-white' : 'border-amber-500')}>{filled && <Check className="h-4 w-4" />}</button>)}
              {f.type === 'signature' && (<button onClick={() => setSigOpen(true)} className={cn('h-full w-full rounded border text-[11.5px] font-semibold bg-yellow-50 text-slate-700 flex items-center justify-center gap-1.5', filled ? 'border-emerald-500' : 'border-amber-500')}>
                {filled ? <img src={values[f.id]} alt="sig" className="max-h-full" /> : <><PenLine className="h-3.5 w-3.5" /> Click to sign</>}
              </button>)}
            </div>
          );
        })}
      </div>

      <div className="mt-6 max-w-4xl mx-auto flex items-center justify-between">
        <div className="text-[12.5px] text-muted-foreground">{Object.keys(values).filter((k) => values[k]).length} / {demoFields.length} completed</div>
        <div className="flex items-center gap-3">
          <button className="h-11 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 px-5 text-[13px] font-semibold dark:bg-rose-950/30 dark:border-rose-900/50">Decline</button>
          <button onClick={submit} disabled={signing} className="h-11 rounded-xl bg-primary text-white px-6 text-[13px] font-semibold hover:bg-primary/90 disabled:opacity-50">{signing ? 'Submitting…' : 'Finish & Submit'}</button>
        </div>
      </div>

      {sigOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSigOpen(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg rounded-2xl bg-card border border-border shadow-2xl p-6">
            <h3 className="text-[18px] font-bold text-foreground">Draw your signature</h3>
            <p className="text-[12px] text-muted-foreground">Sign using your mouse or finger.</p>
            <canvas ref={canvasRef} width={480} height={180} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} className="mt-4 w-full rounded-xl border-2 border-dashed border-border bg-white" />
            <div className="mt-3 flex items-center gap-3">
              <button onClick={clearSig} className="flex-1 h-11 rounded-xl border border-border bg-card text-[13px] font-semibold hover:bg-secondary">Clear</button>
              <button onClick={() => setSigOpen(false)} className="flex-1 h-11 rounded-xl border border-border bg-card text-[13px] font-semibold hover:bg-secondary">Cancel</button>
              <button onClick={applySig} className="flex-[1.3] h-11 rounded-xl bg-primary text-white text-[13px] font-semibold hover:bg-primary/90">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
