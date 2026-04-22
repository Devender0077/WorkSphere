import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={cn('relative h-6 w-11 rounded-full transition-colors', value ? 'bg-primary' : 'bg-secondary')}
    data-testid="toggle-btn"
  >
    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform grid place-items-center', value ? 'left-[22px]' : 'left-0.5')}>
      {value && <Check className="h-3 w-3 text-primary" />}
    </span>
  </button>
);

export const Empty = ({ Icon, title, hint }) => (
  <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-8 text-center">
    <Icon className="h-8 w-8 text-muted-foreground mx-auto" />
    <div className="mt-3 text-[14px] font-semibold text-foreground">{title}</div>
    <div className="mt-1 text-[12.5px] text-muted-foreground">{hint}</div>
  </div>
);
