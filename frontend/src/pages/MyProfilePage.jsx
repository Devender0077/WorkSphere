import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Mail, Phone, Globe, Loader2 } from 'lucide-react';
import { ROLE_CONFIG, STATUS_COLORS } from '@/data/mock';
import { cn } from '@/lib/utils';

const MyProfilePage = () => {
  const { user } = useAuth();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = ROLE_CONFIG[user?.role];

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/employees');
        setEmp(data[0] || null);
      } catch (e) {}
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="min-h-[40vh] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-[30px] font-bold text-foreground">My Profile</h1>
      <p className="mt-1 text-[13.5px] text-muted-foreground">Your personal information and employment details.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col items-center text-center">
            <img src={user?.avatar} alt="" className="h-28 w-28 rounded-full object-cover" />
            <h2 className="mt-4 text-[22px] font-bold text-foreground">{user?.name}</h2>
            <p className="text-[13px] text-muted-foreground">{user?.title || emp?.title}</p>
            {role && <span className={cn('mt-3 inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-bold uppercase', role.badgeClass)}>{role.label}</span>}
          </div>
          <div className="my-6 border-t border-border" />
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[13.5px] text-foreground"><Mail className="h-4 w-4 text-muted-foreground" />{user?.email}</div>
            <div className="flex items-center gap-3 text-[13.5px] text-foreground"><Phone className="h-4 w-4 text-muted-foreground" />{emp?.phone || '—'}</div>
            <div className="flex items-center gap-3 text-[13.5px] text-foreground"><Globe className="h-4 w-4 text-muted-foreground" />GMT +07:00</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div>
            <h3 className="text-[16px] font-bold text-foreground mb-3">Employment</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-[12px] text-muted-foreground">Department</div><div className="text-[14px] font-semibold text-foreground">{emp?.department || user?.department || '—'}</div></div>
              <div><div className="text-[12px] text-muted-foreground">Office</div><div className="text-[14px] font-semibold text-foreground">{emp?.office || '—'}</div></div>
              <div><div className="text-[12px] text-muted-foreground">Join Date</div><div className="text-[14px] font-semibold text-foreground">{emp?.join_date || '—'}</div></div>
              <div><div className="text-[12px] text-muted-foreground">Status</div><div><span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', STATUS_COLORS[emp?.status] || '')}>{emp?.status || 'Active'}</span></div></div>
            </div>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-foreground mb-3">Permissions Granted</h3>
            <div className="flex flex-wrap gap-2">
              {(user?.permissions || []).map((p) => (
                <span key={p} className="inline-flex items-center rounded-md bg-secondary text-foreground px-2 py-1 text-[11.5px] font-medium">{p}</span>
              ))}
              {(!user?.permissions || user?.permissions.length === 0) && <span className="text-muted-foreground text-[13px]">No permissions assigned.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
