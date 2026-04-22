import React, { useState } from 'react';
import { Plus, MapPin, Briefcase, Users, MoreHorizontal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const JOBS = [
  { id: 'J-001', title: 'Senior UI/UX Designer', team: 'Design', location: 'Remote', applicants: 48, type: 'Full-Time', status: 'Open', posted: '5 days ago' },
  { id: 'J-002', title: 'Product Manager', team: 'Product', location: 'Jakarta, ID', applicants: 27, type: 'Full-Time', status: 'Open', posted: '1 week ago' },
  { id: 'J-003', title: 'Backend Engineer', team: 'Engineering', location: 'Remote', applicants: 63, type: 'Full-Time', status: 'Open', posted: '2 weeks ago' },
  { id: 'J-004', title: 'HR Associate', team: 'People', location: 'Jakarta, ID', applicants: 19, type: 'Contract', status: 'Paused', posted: '3 weeks ago' },
  { id: 'J-005', title: 'Marketing Lead', team: 'Marketing', location: 'Singapore', applicants: 12, type: 'Full-Time', status: 'Closed', posted: '1 month ago' },
];

const PIPELINE = {
  'Applied': [
    { name: 'Ava Nguyen', title: 'UI Designer', rating: 4.6, avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face' },
    { name: 'Dylan Ross', title: 'Product Manager', rating: 4.1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
    { name: 'Lia Cordes', title: 'UI Designer', rating: 3.9, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face' },
  ],
  'Screening': [
    { name: 'Nico Berra', title: 'Engineer', rating: 4.4, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face' },
    { name: 'Priya Rao', title: 'Engineer', rating: 4.8, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' },
  ],
  'Interview': [
    { name: 'Jordan Lane', title: 'Designer', rating: 4.3, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
  ],
  'Offer': [
    { name: 'Sam Irving', title: 'Product Manager', rating: 4.7, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
  ],
  'Hired': [
    { name: 'Mia Torres', title: 'Designer', rating: 4.9, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face' },
  ],
};

const STATUS_COLOR = {
  Open: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Paused: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Closed: 'bg-secondary text-muted-foreground',
};

export const JobsPage = () => (
  <div>
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-[30px] font-bold text-foreground">Open Jobs</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">Manage the roles you’re hiring for.</p>
      </div>
      <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> New Job</button>
    </div>

    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { l: 'Open Roles', v: 3, cls: 'text-primary' },
        { l: 'Total Applicants', v: 169, cls: 'text-foreground' },
        { l: 'Hired (YTD)', v: 12, cls: 'text-emerald-600' },
        { l: 'Avg. Time to Hire', v: '24d', cls: 'text-foreground' },
      ].map((s) => (
        <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
          <div className="text-[12px] text-muted-foreground">{s.l}</div>
          <div className={cn('mt-2 text-[26px] font-bold', s.cls)}>{s.v}</div>
        </div>
      ))}
    </div>

    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {JOBS.map((j) => (
        <div key={j.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={cn('inline-flex rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', STATUS_COLOR[j.status])}>{j.status}</span>
                <span className="text-[11.5px] text-muted-foreground">{j.posted}</span>
              </div>
              <div className="mt-2 text-[16px] font-bold text-foreground">{j.title}</div>
              <div className="mt-1 flex items-center gap-3 text-[12.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {j.team}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.location}</span>
                <span>{j.type}</span>
              </div>
            </div>
            <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-[13px] text-muted-foreground"><Users className="h-4 w-4" /> {j.applicants} applicants</div>
            <button className="h-9 rounded-lg border border-border bg-card hover:bg-secondary px-4 text-[12.5px] font-semibold">View Pipeline</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ApplicantsPage = () => (
  <div>
    <h1 className="text-[30px] font-bold text-foreground">Applicants Pipeline</h1>
    <p className="mt-1 text-[13.5px] text-muted-foreground">Move candidates through hiring stages.</p>

    <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
      {Object.entries(PIPELINE).map(([stage, cands]) => (
        <div key={stage} className="rounded-2xl border border-border bg-card p-3 min-w-[220px]">
          <div className="px-2 pb-3 pt-1 flex items-center justify-between">
            <span className="text-[13px] font-bold text-foreground">{stage}</span>
            <span className="text-[11.5px] font-semibold text-muted-foreground">{cands.length}</span>
          </div>
          <div className="space-y-2">
            {cands.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-foreground truncate">{c.name}</div>
                    <div className="text-[11.5px] text-muted-foreground">{c.title}</div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[11.5px]">
                  <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
                  <span className="font-semibold text-foreground">{c.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
