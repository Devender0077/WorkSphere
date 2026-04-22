import React, { useState, useEffect } from 'react';
import { CalendarDays, Plus, Trash2, ChevronRight, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Toggle, Empty } from './common';

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DayRow = ({ d, onToggle, onTime }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2 w-32">
      <Toggle value={d.on} onChange={onToggle} />
      <span className="text-[13px] font-semibold text-foreground">{d.day}</span>
    </div>
    <input value={d.time} onChange={onTime} disabled={!d.on} className="flex-1 h-11 rounded-xl border border-border bg-background px-3 text-[13px] disabled:opacity-50" />
  </div>
);

const AddScheduleModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('Remote Work');
  const [effective, setEffective] = useState('2023-03-09');
  const [hours, setHours] = useState('8h 00m');
  const [type, setType] = useState('duration');
  const [saving, setSaving] = useState(false);
  const [days, setDays] = useState(
    DAYS.map((d) => ({ day: d, on: d !== 'Saturday' && d !== 'Sunday', time: '8h 00m' })),
  );
  const total = days.filter((d) => d.on).length * 8;

  const submit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const daysMap = {};
    days.filter((d) => d.on).forEach((d) => { daysMap[d.day] = d.time; });
    try {
      await onAdd({
        name: name.trim(),
        standard: hours,
        effective: effective,
        type: type === 'duration' ? 'Duration-based' : 'Clock-based',
        total: total + 'h 00m',
        days: daysMap,
        active: true,
      });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="ml-auto relative w-full max-w-lg bg-card h-full overflow-y-auto shadow-2xl" data-testid="add-schedule-modal">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-foreground">Add New Work Schedule</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          <label className="block">
            <span className="text-[13px] font-medium text-foreground">Schedule Name *</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" data-testid="schedule-name-input" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[13px] font-medium text-foreground">Effective from</span>
              <input type="date" value={effective} onChange={(e) => setEffective(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
            </label>
            <label className="block">
              <span className="text-[13px] font-medium text-foreground">Standard hours/day</span>
              <input value={hours} onChange={(e) => setHours(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border bg-background px-4 text-[14px]" />
            </label>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground mb-2">Schedule type</div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setType('duration')} className={cn('text-left rounded-xl border-2 p-3', type === 'duration' ? 'border-primary bg-primary/5' : 'border-border')}>
                <div className="text-[13px] font-bold text-foreground">Duration-based</div>
              </button>
              <button onClick={() => setType('clock')} className={cn('text-left rounded-xl border-2 p-3', type === 'clock' ? 'border-primary bg-primary/5' : 'border-border')}>
                <div className="text-[13px] font-bold text-foreground">Clock-based</div>
              </button>
            </div>
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground mb-2">Working Time</div>
            <div className="space-y-2">
              {days.map((d, i) => (
                <DayRow
                  key={d.day}
                  d={d}
                  onToggle={() => setDays(days.map((x, j) => j === i ? { ...x, on: !x.on } : x))}
                  onTime={(e) => setDays(days.map((x, j) => j === i ? { ...x, time: e.target.value } : x))}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-border flex items-center justify-between sticky bottom-0 bg-card">
          <div className="text-[12.5px] text-muted-foreground">
            Total Working Time: <span className="font-bold text-primary">{total}h 00m</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="h-11 rounded-xl border border-border bg-card px-5 text-[13px] font-semibold">Cancel</button>
            <button onClick={submit} disabled={saving || !name.trim()} className="h-11 rounded-xl bg-[hsl(var(--navy))] text-white px-5 text-[13px] font-semibold disabled:opacity-50" data-testid="schedule-submit-btn">
              {saving ? 'Saving...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const normalize = (s) => ({
  ...s,
  standard: s.standard_hours || s.standard || '8h 00m',
  effective: s.effective_from || s.effective || '—',
  type: s.schedule_type || s.type || 'Duration-based',
  total: s.total || '40h 00m',
  days: s.days || {},
  isDefault: s.is_default || s.isDefault || false,
});

const ScheduleCard = ({ s, expanded, onExpand, onToggle, onRemove }) => (
  <div className="rounded-2xl border border-border bg-background overflow-hidden" data-testid={'schedule-card-' + s.id}>
    <div className="w-full flex items-center justify-between px-5 py-4">
      <button onClick={onExpand} className="flex items-center gap-2 text-left flex-1" data-testid={'schedule-row-' + s.id}>
        <span className="text-[15px] font-bold text-foreground">{s.name}</span>
      </button>
      <div className="flex items-center gap-2">
        <Toggle value={!!s.active} onChange={() => onToggle(s)} />
        <button onClick={() => onRemove(s)} className="h-8 w-8 grid place-items-center rounded-lg bg-rose-500 text-white" data-testid={'schedule-delete-' + s.id}>
          <Trash2 className="h-4 w-4" />
        </button>
        <button onClick={onExpand} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
          <ChevronRight className={cn('h-5 w-5 text-muted-foreground transition-transform', expanded && 'rotate-90')} />
        </button>
      </div>
    </div>
    {expanded && (
      <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 text-[13px]">
        <div className="space-y-2">
          <InfoRow label="Standard hours/day" value={s.standard} />
          <InfoRow label="Effective from" value={s.effective} />
          <InfoRow label="Schedule type" value={s.type} />
          <InfoRow label="Total hours/week" value={s.total} />
        </div>
        <div>
          <div className="text-muted-foreground mb-2">Daily working hours</div>
          <div className="space-y-1">
            {Object.entries(s.days || {}).map((entry) => (
              <div key={entry[0]} className="flex justify-between">
                <span className="text-muted-foreground">{entry[0]}</span>
                <span className="font-semibold text-foreground">{entry[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

export const WorkScheduleTab = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/work-schedules');
      setSchedules(data.map(normalize));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggle = async (s) => {
    const patched = { ...s, active: !s.active };
    setSchedules((p) => p.map((x) => x.id === s.id ? patched : x));
    try { await api.patch('/work-schedules/' + s.id, { name: s.name, active: !s.active }); } catch { load(); }
  };

  const remove = async (s) => {
    if (!window.confirm('Delete schedule "' + s.name + '"?')) return;
    await api.delete('/work-schedules/' + s.id);
    setSchedules((p) => p.filter((x) => x.id !== s.id));
  };

  const add = async (s) => {
    const payload = {
      name: s.name,
      standard_hours: s.standard,
      effective_from: s.effective,
      schedule_type: s.type,
      total: s.total,
      days: s.days || {},
      active: true,
    };
    const { data } = await api.post('/work-schedules', payload);
    setSchedules((p) => [...p, normalize(data)]);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-[18px] font-bold text-foreground">Work Schedule</h3>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1.5 h-10 rounded-xl bg-[hsl(var(--navy))] text-white px-4 text-[12.5px] font-semibold" data-testid="add-schedule-btn">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>
      {loading && <div className="min-h-[150px] grid place-items-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>}
      {!loading && schedules.length === 0 && <Empty Icon={CalendarDays} title="No schedules yet" hint="Click Add New to create your first schedule." />}
      {!loading && schedules.length > 0 && (
        <div className="mt-5 space-y-4">
          {schedules.map((s) => (
            <ScheduleCard
              key={s.id}
              s={s}
              expanded={expanded === s.id}
              onExpand={() => setExpanded(expanded === s.id ? null : s.id)}
              onToggle={toggle}
              onRemove={remove}
            />
          ))}
        </div>
      )}
      {showModal && <AddScheduleModal onClose={() => setShowModal(false)} onAdd={add} />}
    </div>
  );
};
