import React from 'react';
import { Search, Mail, MessageSquareMore, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TopBar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border">
      <div className="flex items-center gap-4 px-6 lg:px-8 h-[72px]">
        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full h-11 rounded-xl bg-card border border-border pl-10 pr-20 text-[14px] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[11px] font-semibold text-muted-foreground">
            ⌘ F
          </kbd>
        </div>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-foreground/80">
          <a href="#" className="hover:text-foreground">Documents</a>
          <a href="#" className="hover:text-foreground">News</a>
          <a href="#" className="hover:text-foreground">Payslip</a>
          <a href="#" className="hover:text-foreground">Report</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="relative h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground">
            <Mail className="h-[18px] w-[18px]" />
            <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <button className="relative h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground">
            <MessageSquareMore className="h-[18px] w-[18px]" />
            <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-secondary">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'}
              alt=""
              className="h-8 w-8 rounded-full object-cover border border-border"
            />
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
