import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogOut } from 'lucide-react';

const ImpersonationBanner = () => {
  const { impersonation, stopImpersonation } = useAuth();
  if (!impersonation) return null;
  const orig = impersonation.original_user;
  const imp = impersonation.impersonating;
  return (
    <div className="sticky top-0 z-30 bg-amber-500 text-amber-950 border-b border-amber-600">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 py-2.5 flex-wrap">
        <Shield className="h-4 w-4 shrink-0" />
        <div className="flex-1 text-[12.5px] font-semibold min-w-0">
          <span className="truncate block sm:inline">
            Impersonating <b>{imp?.name}</b> ({imp?.email}) · tenant <b>{imp?.tenant_name || '—'}</b>
          </span>
          <span className="hidden sm:inline mx-2 opacity-70">•</span>
          <span className="hidden md:inline">Logged in originally as <b>{orig?.name}</b></span>
        </div>
        <button
          onClick={stopImpersonation}
          className="inline-flex items-center gap-1.5 h-8 rounded-lg bg-amber-950 text-amber-50 px-3 text-[12px] font-semibold hover:bg-black/80"
          data-testid="stop-impersonation-btn"
        >
          <LogOut className="h-3.5 w-3.5" /> Exit impersonation
        </button>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
