import React, { useState } from 'react';
import { Plus, Clock, Pencil, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const INITIAL = [
  { id: 'n1', title: 'Promotion Announcement', author: 'Jakob Geidt', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', date: '09 Feb 2023', status: 'Published' },
  { id: 'n2', title: 'Security Policy', author: 'Brandon Curtis', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face', date: '09 Feb 2023', status: 'Published' },
  { id: 'n3', title: 'Use of Company Property Policy', author: 'Madelyn Saris', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', date: '09 Feb 2023', status: 'Published' },
  { id: 'n4', title: 'Company Vehicle Policy', author: 'Marilyn Saris', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', date: '09 Feb 2023', status: 'Draft' },
];

const STATUS = {
  Published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Draft: 'bg-secondary text-muted-foreground',
};

const NewsPage = () => {
  const [list, setList] = useState(INITIAL);
  const [filter, setFilter] = useState('Published');
  const visible = list.filter((n) => n.status === filter);
  const remove = (id) => setList(list.filter((n) => n.id !== id));
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Latest News</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">List News</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-11 rounded-xl border border-border bg-card px-4 text-[13px]">
            <option>Published</option>
            <option>Draft</option>
          </select>
          <div className="inline-flex items-center gap-2 h-11 rounded-xl border border-border bg-card px-4 text-[13px]"><Calendar className="h-4 w-4 text-muted-foreground" /> 01 Jan 2023 - 10 Mar 2023</div>
          <button className="inline-flex items-center gap-2 h-11 rounded-xl bg-[hsl(var(--navy))] px-4 text-[13.5px] font-semibold text-white hover:opacity-90"><Plus className="h-4 w-4" /> Add New</button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visible.map((n) => (
          <div key={n.id} className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[16px] font-bold text-foreground">{n.title}</div>
              <div className="mt-2 flex items-center gap-3 text-[12.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><img src={n.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />{n.author}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {n.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('inline-flex rounded-md px-2.5 py-1 text-[10.5px] font-bold uppercase', STATUS[n.status])}>{n.status}</span>
              <button className="h-9 w-9 grid place-items-center rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(n.id)} className="h-9 w-9 grid place-items-center rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {visible.length === 0 && <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No {filter.toLowerCase()} news yet.</div>}
      </div>
    </div>
  );
};

export default NewsPage;
