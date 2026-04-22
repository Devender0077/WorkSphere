import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail, Phone, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { STATUS_COLORS } from '@/data/mock';
import { cn } from '@/lib/utils';

const DirectoryPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/employees'); setList(data); } catch (e) {}
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = list.filter((e) => (e.first_name + ' ' + e.last_name + ' ' + e.title).toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[30px] font-bold text-foreground">Directory</h1>
          <p className="mt-1 text-[13.5px] text-muted-foreground">Browse your team at a glance.</p>
        </div>
      </div>

      <div className="mt-5 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people, roles..." className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      </div>

      {loading ? (
        <div className="min-h-[40vh] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
      ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <Link key={e.id} to={`/employees/${e.id}`} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-4">
                {e.avatar ? (
                  <img src={e.avatar} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-[18px] font-bold">{(e.first_name?.[0]||'')+(e.last_name?.[0]||'')}</div>
                )}
                <div className="min-w-0">
                  <div className="text-[15px] font-bold text-foreground group-hover:text-primary truncate">{e.first_name} {e.last_name}</div>
                  <div className="text-[12.5px] text-muted-foreground">{e.title}</div>
                  <span className={cn('mt-2 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase', STATUS_COLORS[e.status] || '')}>{e.status}</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground truncate"><Mail className="h-3.5 w-3.5" />{e.email}</div>
                <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground"><Phone className="h-3.5 w-3.5" />{e.phone || '—'}</div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center text-muted-foreground py-10">No people found.</div>}
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
