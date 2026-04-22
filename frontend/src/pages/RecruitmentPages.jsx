import React, { useState } from 'react';
import { Plus, MapPin, Briefcase, Users, MoreHorizontal, Star, Search, Mail, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const JOBS = [
  { id: 'J-000', title: '3D Designer', team: 'Designer', location: 'Unpixel HQ', applicants: 0, type: 'Full-Time', status: 'Active', posted: '3m ago' },
  { id: 'J-001', title: 'UI UX Designer', team: 'Designer', location: 'Unpixel HQ', applicants: 10, type: 'Full-Time', status: 'Active', posted: '3m ago' },
  { id: 'J-002', title: 'Senior Android Developer', team: 'IT', location: 'Unpixel Indonesia', applicants: 115, type: 'Full-Time', status: 'Closed', posted: '3m ago' },
  { id: 'J-003', title: 'Senior Android Developer', team: 'IT', location: 'Unpixel Indonesia', applicants: 115, type: 'Full-Time', status: 'Unactive', posted: '3m ago' },
  { id: 'J-004', title: 'Product Manager', team: 'Product', location: 'Jakarta, ID', applicants: 27, type: 'Full-Time', status: 'Active', posted: '1 week ago' },
  { id: 'J-005', title: 'Backend Engineer', team: 'Engineering', location: 'Remote', applicants: 63, type: 'Full-Time', status: 'Active', posted: '2 weeks ago' },
];

const PIPELINE = {
  'Applied': [
    { name: 'Ava Nguyen', title: 'UI Designer', rating: 4.6, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', email: 'ava@example.com' },
    { name: 'Dylan Ross', title: 'Product Manager', rating: 4.1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', email: 'dylan@example.com' },
    { name: 'Lia Cordes', title: 'UI Designer', rating: 3.9, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', email: 'lia@example.com' },
  ],
  'Screening': [
    { name: 'Nico Berra', title: 'Engineer', rating: 4.4, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face', email: 'nico@example.com' },
    { name: 'Priya Rao', title: 'Engineer', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', email: 'priya@example.com' },
  ],
  'Interview': [
    { name: 'Jordan Lane', title: 'Designer', rating: 4.3, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', email: 'jordan@example.com' },
  ],
  'Offer': [
    { name: 'Sam Irving', title: 'Product Manager', rating: 4.7, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', email: 'sam@example.com' },
  ],
  'Hired': [
    { name: 'Mia Torres', title: 'Designer', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', email: 'mia@example.com' },
  ],
};

const STATUS_COLOR = {
  Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Closed: 'bg-secondary text-muted-foreground',
  Unactive: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

const APPLICANT_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
];

export const JobsPage = () => {
  const [jobs, setJobs] = useState(JOBS);
  const [search, setSearch] = useState('');
  const filtered = jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()));

  const updateStatus = (id, status) => setJobs(jobs.map((j) => j.id === id ? { ...j, status } : j));

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Recruitment</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Here's all job list</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search what you need" className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-4 text-[13px]" data-testid="jobs-search" />
          </div>
          <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90" data-testid="add-job-btn">
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {filtered.map((j) => (
          <div key={j.id} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors" data-testid={`job-card-${j.id}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-[17px] font-bold text-foreground">{j.title}</div>
                  <span className={cn('inline-flex rounded-md px-2.5 py-0.5 text-[10.5px] font-bold uppercase', STATUS_COLOR[j.status])}>{j.status}</span>
                </div>
                <div className="mt-1 text-[12.5px] text-muted-foreground">{j.team} . {j.location}</div>
                <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    {j.applicants > 0 && (
                      <div className="flex -space-x-2">
                        {APPLICANT_AVATARS.map((a, i) => <img key={i} src={a} alt="" className="h-6 w-6 rounded-full border-2 border-card object-cover" />)}
                      </div>
                    )}
                    <span className="text-[13px] text-muted-foreground">{j.applicants} Candidates Applied</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <select value={j.status} onChange={(e) => updateStatus(j.id, e.target.value)} className={cn('h-10 rounded-xl border border-border bg-background pl-3 pr-8 text-[12.5px] font-semibold appearance-none cursor-pointer')}>
                    <option>Active</option><option>Closed</option><option>Unactive</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                <button className="h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="mt-2 text-right text-[12px] text-muted-foreground">Created {j.posted}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CandidatesPage = () => {
  const allCandidates = Object.entries(PIPELINE).flatMap(([stage, list]) => list.map((c) => ({ ...c, stage })));
  const [view, setView] = useState('kanban');
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Candidates</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Track applicants across hiring stages</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search candidates" className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-4 text-[13px]" />
          </div>
          <div className="inline-flex rounded-xl bg-secondary p-1">
            <button onClick={() => setView('kanban')} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-semibold', view === 'kanban' ? 'bg-card shadow-sm' : 'text-muted-foreground')} data-testid="view-kanban-btn">Kanban</button>
            <button onClick={() => setView('list')} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-semibold', view === 'list' ? 'bg-card shadow-sm' : 'text-muted-foreground')} data-testid="view-list-btn">List</button>
          </div>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
          {Object.entries(PIPELINE).map(([stage, cands]) => (
            <div key={stage} className="rounded-2xl border border-border bg-card p-3 min-w-[220px]">
              <div className="px-2 pb-3 pt-1 flex items-center justify-between">
                <span className="text-[13px] font-bold text-foreground">{stage}</span>
                <span className="text-[11.5px] font-semibold text-muted-foreground h-5 min-w-[20px] px-1.5 grid place-items-center rounded-full bg-secondary">{cands.length}</span>
              </div>
              <div className="space-y-2">
                {cands.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())).map((c, i) => (
                  <div key={i} className="rounded-xl border border-border bg-background p-3 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-foreground truncate">{c.name}</div>
                        <div className="text-[11.5px] text-muted-foreground">{c.title}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11.5px]">
                        <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
                        <span className="font-semibold text-foreground">{c.rating}</span>
                      </div>
                      <button className="text-[11px] text-primary font-semibold hover:underline">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-border bg-card overflow-x-auto">
          <table className="w-full text-[13px] min-w-[720px]">
            <thead className="border-b border-border bg-secondary/30">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-semibold">Candidate</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Stage</th>
                <th className="p-4 font-semibold">Rating</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allCandidates.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())).map((c, i) => (
                <tr key={i} className="hover:bg-secondary/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                      <div><div className="font-semibold text-foreground">{c.name}</div><div className="text-[11.5px] text-muted-foreground">{c.title}</div></div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{c.email}</td>
                  <td className="p-4"><span className="inline-flex rounded-md bg-primary/10 text-primary px-2.5 py-0.5 text-[10.5px] font-bold uppercase">{c.stage}</span></td>
                  <td className="p-4"><div className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" /><span className="font-semibold text-foreground">{c.rating}</span></div></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="h-8 w-8 grid place-items-center rounded-lg bg-secondary hover:bg-secondary/80"><Mail className="h-4 w-4 text-muted-foreground" /></button>
                      <button className="h-8 w-8 grid place-items-center rounded-lg bg-secondary hover:bg-secondary/80"><Phone className="h-4 w-4 text-muted-foreground" /></button>
                      <button className="h-8 rounded-lg bg-primary text-white px-3 text-[12px] font-semibold">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const RecruitmentSettingsPage = () => {
  const [pipelines, setPipelines] = useState([
    { id: 1, name: 'Default Pipeline', stages: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'] },
    { id: 2, name: 'Engineering Pipeline', stages: ['Applied', 'Take-home', 'Tech Interview', 'Final', 'Offer', 'Hired'] },
  ]);

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground">Recruitment Settings</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Configure hiring pipelines and scoring</p>
        </div>
        <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> New Pipeline
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {pipelines.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-[15px] font-bold text-foreground">{p.name}</div>
              <button className="text-[12.5px] font-semibold text-primary hover:underline">Edit stages</button>
            </div>
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
              {p.stages.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="rounded-xl border border-border bg-background px-4 py-2 text-[12.5px] font-semibold text-foreground whitespace-nowrap">{s}</div>
                  {i < p.stages.length - 1 && <div className="w-6 h-px bg-border shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="text-[15px] font-bold text-foreground">Scoring Rubric</div>
          <p className="mt-1 text-[12.5px] text-muted-foreground">Used when reviewing candidates.</p>
          <div className="mt-4 space-y-3">
            {[{ l: 'Technical Skills', v: 30 }, { l: 'Communication', v: 25 }, { l: 'Culture Fit', v: 25 }, { l: 'Experience', v: 20 }].map((r) => (
              <div key={r.l} className="flex items-center gap-3">
                <div className="w-48 text-[13px] font-semibold text-foreground">{r.l}</div>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${r.v}%` }} /></div>
                <div className="w-10 text-right text-[12.5px] font-bold text-foreground">{r.v}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep backward-compatible export
export const ApplicantsPage = CandidatesPage;
