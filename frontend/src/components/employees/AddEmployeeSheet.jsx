import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const AddEmployeeSheet = ({ open, onClose, onCreate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('Candra');
  const [email, setEmail] = useState('pristia@gmail.com');
  const [joinDate, setJoinDate] = useState('23 Mar 2023');
  const [touched, setTouched] = useState(false);

  if (!open) return null;

  const firstNameError = touched && !firstName;

  const submit = () => {
    setTouched(true);
    if (!firstName) return;
    onCreate({ firstName, lastName, email, joinDate });
    setFirstName('');
    setTouched(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-card border-l border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-7 pt-7 pb-4">
          <h2 className="text-[20px] font-bold text-foreground">Add New Profile</h2>
          <button onClick={onClose} className="h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-5">
          <label className="block">
            <span className="text-[13px] font-medium text-foreground">First Name <span className="text-rose-500">*</span></span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouched(true)}
              className={cn(
                'mt-2 w-full h-12 rounded-xl border px-4 text-[14px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                firstNameError ? 'border-rose-500' : 'border-border'
              )}
            />
            {firstNameError && <span className="mt-2 inline-block text-[12px] text-rose-500">ⓘ This field is required.</span>}
          </label>

          <label className="block">
            <span className="text-[13px] font-medium text-foreground">Last Name <span className="text-rose-500">*</span></span>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border px-4 text-[14px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </label>

          <label className="block">
            <span className="text-[13px] font-medium text-foreground">Email Address <span className="text-rose-500">*</span></span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full h-12 rounded-xl border border-border px-4 text-[14px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </label>

          <label className="block">
            <span className="text-[13px] font-medium text-foreground">Join Date <span className="text-rose-500">*</span></span>
            <div className="relative mt-2">
              <input value={joinDate} onChange={(e) => setJoinDate(e.target.value)} className="w-full h-12 rounded-xl border border-border bg-background pl-4 pr-12 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </label>
        </div>

        <div className="px-7 pb-7 pt-4 border-t border-border flex items-center gap-3">
          <button onClick={onClose} className="flex-1 h-12 rounded-xl border border-border bg-card text-[13.5px] font-semibold text-foreground hover:bg-secondary">Cancel</button>
          <button onClick={submit} className="flex-1 h-12 rounded-xl bg-[hsl(var(--navy))] text-white text-[13.5px] font-semibold hover:opacity-90">Create</button>
        </div>
      </aside>
    </div>
  );
};

export default AddEmployeeSheet;
