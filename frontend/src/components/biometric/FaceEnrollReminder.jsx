import React, { useEffect, useState } from 'react';
import { ScanFace, Clock, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const DEADLINE_KEY_PREFIX = 'hrd-face-deadline-';
const ENROLLED_KEY_PREFIX = 'hrd-face-enrolled-';

export const useFaceEnrollment = () => {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (!user) return;
    const en = localStorage.getItem(`${ENROLLED_KEY_PREFIX}${user.id}`);
    if (en) { setEnrolled(true); setImg(en); return; }
    let d = localStorage.getItem(`${DEADLINE_KEY_PREFIX}${user.id}`);
    if (!d) {
      d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(`${DEADLINE_KEY_PREFIX}${user.id}`, d);
    }
    setDeadline(new Date(d));
  }, [user]);

  const enroll = (imageData) => {
    if (!user) return;
    localStorage.setItem(`${ENROLLED_KEY_PREFIX}${user.id}`, imageData || 'enrolled');
    localStorage.removeItem(`${DEADLINE_KEY_PREFIX}${user.id}`);
    setEnrolled(true);
    setImg(imageData);
    setDeadline(null);
  };

  const daysRemaining = deadline ? Math.max(0, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))) : null;

  return { enrolled, deadline, daysRemaining, enroll, img };
};

export const FaceEnrollReminder = ({ onEnrollClick }) => {
  const { user } = useAuth();
  const { enrolled, daysRemaining } = useFaceEnrollment();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('hrd-face-banner-dismissed') === '1');

  if (!user || user.role !== 'employee' || enrolled || dismissed) return null;

  const overdue = daysRemaining === 0;
  const urgent = daysRemaining !== null && daysRemaining <= 2;

  return (
    <div className={cn(
      'rounded-2xl border px-5 py-4 flex items-center gap-4 flex-wrap',
      overdue ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60'
              : urgent ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60'
              : 'bg-primary/5 border-primary/20'
    )}>
      <div className={cn('h-11 w-11 rounded-xl grid place-items-center',
        overdue ? 'bg-rose-500 text-white' : urgent ? 'bg-amber-500 text-white' : 'bg-primary text-white'
      )}>
        <ScanFace className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-[220px]">
        <div className="text-[14px] font-bold text-foreground">
          {overdue ? 'Face enrollment overdue' : 'Enroll your Face ID'}
        </div>
        <div className="text-[12.5px] text-muted-foreground flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {overdue ? 'Please enroll immediately to avoid attendance issues.' : (
            <span><b>{daysRemaining}</b> day{daysRemaining === 1 ? '' : 's'} remaining. Complete face enrollment for biometric check-in.</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onEnrollClick} className={cn('h-10 px-4 rounded-xl text-[13px] font-semibold text-white', overdue ? 'bg-rose-500 hover:bg-rose-600' : 'bg-primary hover:bg-primary/90')}>Enroll now</button>
        <button onClick={() => { sessionStorage.setItem('hrd-face-banner-dismissed', '1'); setDismissed(true); }} className="h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
};

export const FaceEnrollReminderWrapper = () => {
  const navigate = useNavigate();
  return <FaceEnrollReminder onEnrollClick={() => navigate('/my-profile')} />;
};
