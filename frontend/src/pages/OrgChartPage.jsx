import React, { useEffect, useState } from 'react';
import { Loader2, User } from 'lucide-react';
import api from '@/lib/api';

const Node = ({ e }) => (
  <div className="flex flex-col items-center">
    <div className="rounded-2xl border border-border bg-card px-4 py-3 min-w-[180px] text-center">
      {e.avatar ? (
        <img src={e.avatar} alt="" className="h-12 w-12 rounded-full object-cover mx-auto" />
      ) : (
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto"><User className="h-5 w-5" /></div>
      )}
      <div className="mt-2 text-[13px] font-semibold text-foreground">{e.first_name} {e.last_name}</div>
      <div className="text-[11.5px] text-muted-foreground">{e.title}</div>
    </div>
  </div>
);

const OrgChartPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get('/employees'); setList(data); } catch (e) {}
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;

  const leaders = list.filter((e) => /director|manager|lead/i.test(e.title)).slice(0, 1);
  const managers = list.filter((e) => /manager|lead/i.test(e.title) && !leaders.includes(e)).slice(0, 3);
  const ics = list.filter((e) => !leaders.includes(e) && !managers.includes(e));

  return (
    <div>
      <h1 className="text-[30px] font-bold text-foreground">Organization Chart</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">Visualize reporting lines across your team.</p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-8 overflow-x-auto">
        <div className="min-w-[820px] space-y-10">
          {/* Leader */}
          <div className="flex justify-center">
            {leaders[0] ? <Node e={leaders[0]} /> : <div className="text-muted-foreground">No leader</div>}
          </div>
          <div className="flex justify-center">
            <div className="h-8 w-px bg-border" />
          </div>
          {/* Managers */}
          <div className="grid grid-cols-3 gap-6 justify-items-center">
            {managers.map((m) => <Node key={m.id} e={m} />)}
          </div>
          <div className="flex justify-center">
            <div className="h-8 w-px bg-border" />
          </div>
          {/* ICs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {ics.slice(0, 8).map((i) => <Node key={i.id} e={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChartPage;
