import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronsLeft, Grid, Users, ClipboardList, Clock, Calendar, Wallet, TrendingUp, Briefcase, HelpCircle, Settings, Sun, Moon, Building2, Shield, User, LogOut } from 'lucide-react';
import { getMenu } from '@/data/menu';
import { ROLE_CONFIG } from '@/data/mock';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const ICONS = {
  grid: Grid, users: Users, clipboard: ClipboardList, clock: Clock, calendar: Calendar,
  wallet: Wallet, 'trending-up': TrendingUp, briefcase: Briefcase,
  'help-circle': HelpCircle, settings: Settings, building: Building2, shield: Shield, user: User,
};

const Logo = ({ collapsed }) => (
  <div className="flex items-center gap-2">
    <div className="h-8 w-8 rounded-lg bg-primary grid place-items-center text-white font-extrabold shadow-sm">H</div>
    {!collapsed && <span className="text-[17px] font-bold tracking-tight text-foreground">HRDashboard</span>}
  </div>
);

const MenuItem = ({ item, collapsed }) => {
  const location = useLocation();
  const isActiveGroup = item.children?.some((c) => location.pathname === c.to || location.pathname.startsWith(c.to + '/'));
  const [open, setOpen] = useState(isActiveGroup);
  const Icon = ICONS[item.icon] || Grid;

  if (!item.children) {
    return (
      <NavLink
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
          cn(
            'sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium',
            isActive
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          )
        }
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && item.badge && (
          <span className="ml-auto grid place-items-center h-5 w-5 rounded-full bg-rose-500 text-white text-[11px] font-semibold">{item.badge}</span>
        )}
        {!collapsed && item.key === 'dashboard' && !item.badge && (
          <Grid className="ml-auto h-[14px] w-[14px] opacity-80" />
        )}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'sidebar-link w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium',
          isActiveGroup ? 'text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        )}
      >
        <Icon className={cn('h-[18px] w-[18px] shrink-0', isActiveGroup && 'text-primary')} />
        {!collapsed && (
          <>
            <span className="truncate">{item.label}</span>
            <ChevronDown className={cn('ml-auto h-4 w-4 transition-transform', open && 'rotate-180')} />
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="mt-1 ml-4 pl-4 border-l border-border space-y-1">
          {item.children.map((child) => (
            <NavLink
              key={child.key}
              to={child.to}
              className={({ isActive }) =>
                cn(
                  'block rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors',
                  isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const menu = getMenu(user?.role || 'employee');
  const role = ROLE_CONFIG[user?.role];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r border-border bg-[hsl(var(--sidebar-bg))] transition-[width] duration-200',
        collapsed ? 'w-[78px]' : 'w-[260px]'
      )}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Logo collapsed={collapsed} />
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="text-muted-foreground hover:text-foreground">
            <ChevronsLeft className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      {!collapsed && role && (
        <div className="mx-3 mb-3 rounded-xl border border-border bg-secondary/50 px-3 py-2">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Signed in as</div>
          <div className="mt-0.5 text-[13px] font-semibold text-foreground truncate">{user?.tenant_name || 'Platform'}</div>
          <span className={cn('mt-1 inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', role.badgeClass)}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {role.label}
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {menu.main.map((item) => (
          <MenuItem key={item.key} item={item} collapsed={collapsed} />
        ))}
      </div>

      <div className="px-3 pb-4 space-y-1 border-t border-border pt-3">
        {menu.bottom.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium',
                  isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto grid place-items-center h-5 w-5 rounded-full bg-rose-500 text-white text-[11px] font-semibold">{item.badge}</span>
              )}
            </NavLink>
          );
        })}
        <button
          onClick={logout}
          className="sidebar-link w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-muted-foreground hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>

        {!collapsed ? (
          <div className="mt-3 p-1 rounded-full bg-secondary inline-flex w-full max-w-[200px]">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                'flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                theme === 'light' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              <Sun className="h-3.5 w-3.5 text-amber-500" /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                'flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                theme === 'dark' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              <Moon className="h-3.5 w-3.5" /> Dark
            </button>
          </div>
        ) : (
          <button onClick={() => setCollapsed(false)} className="mt-2 flex items-center justify-center h-9 w-full rounded-xl bg-secondary text-muted-foreground hover:text-foreground">
            <ChevronsLeft className="h-4 w-4 rotate-180" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
