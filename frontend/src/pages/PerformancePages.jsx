import React, { useState } from 'react';
import { Star, Target, TrendingUp, Plus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const REVIEWS = [
  { emp: 'Pristia Candra', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', period: 'Q1 2025', score: 4.6, status: 'Completed', reviewer: 'Skylar Calzoni' },
  { emp: 'Hanna Baptista', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', period: 'Q1 2025', score: 4.2, status: 'In Review', reviewer: 'Skylar Calzoni' },
  { emp: 'Rayna Torff', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', period: 'Q1 2025', score: 4.8, status: 'Completed', reviewer: 'Skylar Calzoni' },
  { emp: 'James George', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', period: 'Q1 2025', score: 0, status: 'Not Started', reviewer: 'Skylar Calzoni' },
];

const GOALS = [
  { title: 'Improve onboarding NPS to 70', progress: 68, due: 'Q2 2025', owner: 'Pristia' },
  { title: 'Launch employee wellness program', progress: 32, due: 'Q3 2025', owner: 'Hanna' },
  { title: 'Reduce time-to-hire to 21 days', progress: 85, due: 'Q2 2025', owner: 'Rayna' },
  { title: 'Roll out OKR framework to all teams', progress: 50, due: 'Q2 2025', owner: 'Pristia' },
];

const SCORE_COLOR = (s) => s >= 4.5 ? 'text-emerald-600' : s >= 4 ? 'text-primary' : s >= 3 ? 'text-amber-600' : 'text-rose-600';
const STATUS_COLOR = {
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'In Review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Not Started': 'bg-secondary text-muted-foreground',
};

export const PerformanceReviewsPage = () => (
  <div>
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-[30px] font-bold text-foreground">Performance Reviews</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">Run quarterly review cycles with your team.</p>
      </div>
      <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> Start Cycle</button>
    </div>

    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { l: 'Avg. Score', v: '4.4', Icon: Star, cls: 'text-primary' },
        { l: 'Completed', v: '2/4', Icon: CheckCircle2, cls: 'text-foreground' },
        { l: 'Top Performer', v: 'Rayna T.', Icon: TrendingUp, cls: 'text-foreground' },
        { l: 'Cycle', v: 'Q1 2025', Icon: Target, cls: 'text-foreground' },
      ].map((s) => (
        <div key={s.l} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground"><s.Icon className="h-4 w-4" /><span className="text-[12px]">{s.l}</span></div>
          <div className={cn('mt-2 text-[24px] font-bold', s.cls)}>{s.v}</div>
        </div>
      ))}
    </div>

    <div className="mt-5 rounded-2xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-[13px] min-w-[780px]">
        <thead className="border-b border-border">
          <tr className="text-left text-primary">
            <th className="p-4 font-semibold">Employee</th>
            <th className="p-4 font-semibold">Period</th>
            <th className="p-4 font-semibold">Reviewer</th>
            <th className="p-4 font-semibold">Score</th>
            <th className="p-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {REVIEWS.map((r) => (
            <tr key={r.emp} className="hover:bg-secondary/40">
              <td className="p-4"><div className="flex items-center gap-3"><img src={r.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /><div className="font-semibold text-foreground">{r.emp}</div></div></td>
              <td className="p-4 text-foreground">{r.period}</td>
              <td className="p-4 text-foreground">{r.reviewer}</td>
              <td className="p-4">
                {r.score > 0 ? (
                  <div className="flex items-center gap-2">
                    <Star className={cn('h-4 w-4', SCORE_COLOR(r.score))} fill="currentColor" />
                    <span className={cn('font-bold', SCORE_COLOR(r.score))}>{r.score}</span>
                  </div>
                ) : <span className="text-muted-foreground">—</span>}
              </td>
              <td className="p-4"><span className={cn('inline-flex rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase', STATUS_COLOR[r.status])}>{r.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const GoalsPage = () => (
  <div>
    <div className="flex items-start justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-[30px] font-bold text-foreground">Goals &amp; OKRs</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">Track what matters this quarter.</p>
      </div>
      <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> Add Goal</button>
    </div>

    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {GOALS.map((g, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[15px] font-bold text-foreground">{g.title}</div>
              <div className="text-[12px] text-muted-foreground mt-1">Owner: {g.owner} • Due {g.due}</div>
            </div>
            <span className="text-[20px] font-bold text-primary">{g.progress}%</span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${g.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);
