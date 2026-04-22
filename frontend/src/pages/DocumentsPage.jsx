import React, { useState } from 'react';
import { Plus, FileText, Calendar, ChevronsUpDown, X, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const INITIAL = [
  { id: 'd1', name: 'Esential Tax', createdBy: 'Jennifer Law', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', date: '24 Mar 2023', desc: 'Files about the importance of essential tasks', files: 5, size: '22 mb', share: 'Everyone' },
  { id: 'd2', name: 'Project Manager', createdBy: 'Dulce Philips', avatar: null, initials: 'DP', date: '21 Jan 2023', desc: '-', files: 3, size: '15 mb', share: 'Everyone' },
  { id: 'd3', name: 'UIUX Designer', createdBy: 'Miracle Franci', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', date: '10 Jan 2023', desc: 'Standard of procedure about UI UX Design Team', files: 2, size: '11 mb', share: 'Everyone' },
  { id: 'd4', name: 'IT Development', createdBy: 'Davis Curtis', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', date: '01 Jan 2022', desc: 'Standard of procedure about IT Dev Team', files: 4, size: '20 mb', share: 'Everyone' },
];

const GROUPS = ['Onboarding Group', 'Offboarding Group', 'Probationary Group', 'All Employee', 'Fulltime Employee (Non-resigned employee)'];

const ShareModal = ({ open, onClose, onShare }) => {
  const [mode, setMode] = useState('Employee Group');
  const [groups, setGroups] = useState(GROUPS);
  if (!open) return null;
  const removeGroup = (g) => setGroups(groups.filter((x) => x !== g));
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl rounded-2xl bg-card border border-border shadow-2xl p-8">
        <h2 className="text-[22px] font-bold text-foreground text-center">Share With</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Everyone', 'Department', 'Offices', 'Employee Group'].map((m) => (
            <button key={m} onClick={() => setMode(m)} className={cn('h-14 rounded-xl border flex items-center justify-between px-4 text-[13.5px] font-semibold transition-colors', mode === m ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-foreground hover:bg-secondary')}>
              {m}
              <span className={cn('h-4 w-4 rounded-full border-2 grid place-items-center', mode === m ? 'border-primary' : 'border-border')}>{mode === m && <span className="h-2 w-2 rounded-full bg-primary" />}</span>
            </button>
          ))}
        </div>
        {mode === 'Employee Group' && (
          <div className="mt-4 rounded-xl border border-border bg-background p-3 flex flex-wrap gap-2">
            {groups.map((g) => (
              <span key={g} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[12.5px] text-foreground">
                <button onClick={() => removeGroup(g)} className="text-muted-foreground hover:text-rose-500"><X className="h-3.5 w-3.5" /></button>
                {g}
              </span>
            ))}
          </div>
        )}
        <div className="mt-7 flex items-center justify-center gap-3">
          <button onClick={onClose} className="h-12 px-8 rounded-xl border border-border bg-card text-[13.5px] font-semibold hover:bg-secondary">Cancel</button>
          <button onClick={() => { onShare && onShare(); onClose(); }} className="h-12 px-8 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold hover:opacity-90">Share Now</button>
        </div>
      </div>
    </div>
  );
};

const DocumentsPage = () => {
  const [list] = useState(INITIAL);
  const [share, setShare] = useState(false);
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Documents</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">These are the uploaded documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 h-11 rounded-xl border border-border bg-card px-4 text-[13px]">
            <Calendar className="h-4 w-4 text-muted-foreground" /> 01 Jan 2023 - 10 Mar 2023
          </div>
          <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> New Folder</button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-[13px] min-w-[980px]">
          <thead className="border-b border-border">
            <tr className="text-left text-primary">
              {['Name', 'Created By', 'Created Date', 'Description', 'Number Of Files', 'Size', 'Share With'].map((h) => (
                <th key={h} className="p-4 font-semibold"><span className="inline-flex items-center gap-1">{h} <ChevronsUpDown className="h-3 w-3 text-muted-foreground" /></span></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((d) => (
              <tr key={d.id} className="hover:bg-secondary/40">
                <td className="p-4"><div className="flex items-center gap-2 text-foreground"><FileText className="h-4 w-4 text-muted-foreground" />{d.name}</div></td>
                <td className="p-4"><div className="flex items-center gap-2">{d.avatar ? <img src={d.avatar} alt="" className="h-7 w-7 rounded-full object-cover" /> : <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[11px] font-bold">{d.initials}</div>}<span className="text-foreground">{d.createdBy}</span></div></td>
                <td className="p-4"><div className="inline-flex items-center gap-1.5 text-foreground"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {d.date}</div></td>
                <td className="p-4 text-muted-foreground max-w-[260px] truncate">{d.desc}</td>
                <td className="p-4 text-foreground">{d.files}</td>
                <td className="p-4 text-foreground">{d.size}</td>
                <td className="p-4"><button onClick={() => setShare(true)} className="inline-flex items-center gap-1 text-primary font-semibold">{d.share}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-lg border border-border text-muted-foreground hover:bg-secondary">&lt;</button>
            <button className="h-8 w-8 rounded-lg bg-secondary text-foreground text-[12.5px] font-semibold">1</button>
            <button className="h-8 w-8 rounded-lg border border-border text-muted-foreground hover:bg-secondary">&gt;</button>
          </div>
          <div className="text-[12.5px] text-muted-foreground">Showing 1 to 10 of 4 entries · <span className="font-semibold text-foreground">Show 10</span></div>
        </div>
      </div>
      <ShareModal open={share} onClose={() => setShare(false)} />
    </div>
  );
};

export default DocumentsPage;
