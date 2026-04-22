import React from 'react';
import { Search, Mail, MessageSquareMore, ChevronDown, LogOut, Menu, Bell, Check, FileSignature, Wallet, CalendarClock, Users as UsersIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_CONFIG } from '@/data/mock';
import { cn } from '@/lib/utils';

const NOTIFICATIONS = [
  { id: 'n1', Icon: FileSignature, color: 'bg-primary/15 text-primary', title: 'New document to sign', desc: 'MoU — Acme x Unpixel is waiting for your signature.', time: '2m ago', unread: true, to: '/esign' },
  { id: 'n2', Icon: CalendarClock, color: 'bg-amber-500/15 text-amber-600', title: 'Time-off approved', desc: 'Your leave request for 15 Mar has been approved.', time: '1h ago', unread: true, to: '/time-off/requests' },
  { id: 'n3', Icon: Wallet, color: 'bg-emerald-500/15 text-emerald-600', title: 'Payslip available', desc: 'Your March payslip is ready to view.', time: '3h ago', unread: true, to: '/payroll/slips' },
  { id: 'n4', Icon: UsersIcon, color: 'bg-sky-500/15 text-sky-600', title: 'New hire onboarded', desc: 'Miracle Geidt joined the Design team.', time: 'Yesterday', unread: false, to: '/employees' },
];

const MESSAGES_PREVIEW = [
  { id: 'm1', name: 'Davis Rosser', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', text: 'Sure! let me tell you about what we...', time: '2m', unread: true },
  { id: 'm2', name: 'Emerson Levin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', text: 'Find out who is in charge of this...', time: '15m', unread: true },
  { id: 'm3', name: 'Lydia Franci', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', text: 'Sure! let me tell you about w...', time: '1h', unread: false },
];

const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [msgOpen, setMsgOpen] = React.useState(false);
  const [notifs, setNotifs] = React.useState(NOTIFICATIONS);
  const role = ROLE_CONFIG[user?.role];

  const unreadCount = notifs.filter((n) => n.unread).length;
  const unreadMsgs = MESSAGES_PREVIEW.filter((m) => m.unread).length;

  const markAllRead = () => setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  const closeAll = () => { setNotifOpen(false); setMsgOpen(false); setProfileOpen(false); };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border">
      <div className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 h-[64px] sm:h-[72px]">
        <button
          onClick={onMenuClick}
          className="md:hidden h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-foreground"
          data-testid="topbar-menu-btn"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full h-10 sm:h-11 rounded-xl bg-card border border-border pl-10 pr-16 sm:pr-20 text-[13px] sm:text-[14px] text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            data-testid="topbar-search"
          />
          <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[11px] font-semibold text-muted-foreground">⌘ F</kbd>
        </div>

        <nav className="hidden xl:flex items-center gap-7 text-[14px] font-medium text-foreground/80">
          <Link to="/documents" className="hover:text-foreground">Documents</Link>
          <Link to="/news" className="hover:text-foreground">News</Link>
          <Link to="/payroll/slips" className="hover:text-foreground">Payslip</Link>
          <Link to="/reports" className="hover:text-foreground">Report</Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {/* Messages popup */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setMsgOpen((o) => !o); }}
              className="relative h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"
              data-testid="topbar-messages-btn"
            >
              <Mail className="h-[18px] w-[18px]" />
              {unreadMsgs > 0 && <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-rose-500" />}
            </button>
            {msgOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMsgOpen(false)} />
                <div className="absolute right-0 z-30 mt-2 w-[320px] sm:w-[380px] rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div>
                      <div className="text-[15px] font-bold text-foreground">Messages</div>
                      <div className="text-[11.5px] text-muted-foreground">{unreadMsgs} unread</div>
                    </div>
                    <Link to="/messages" onClick={() => setMsgOpen(false)} className="text-[12px] font-semibold text-primary">Open Inbox</Link>
                  </div>
                  <div className="max-h-[380px] overflow-y-auto">
                    {MESSAGES_PREVIEW.map((m) => (
                      <Link
                        key={m.id}
                        to="/messages"
                        onClick={() => setMsgOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                      >
                        <img src={m.avatar} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-[13px] font-semibold text-foreground truncate">{m.name}</div>
                            <div className="text-[11px] text-muted-foreground shrink-0">{m.time}</div>
                          </div>
                          <div className="mt-0.5 text-[12.5px] text-muted-foreground truncate">{m.text}</div>
                        </div>
                        {m.unread && <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications popup */}
          <div className="relative">
            <button
              onClick={() => { closeAll(); setNotifOpen((o) => !o); }}
              className="relative h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"
              data-testid="topbar-notifications-btn"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-1 min-w-[18px] h-[18px] grid place-items-center px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold">{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <div
                  className="absolute right-0 z-30 mt-2 w-[340px] sm:w-[400px] rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
                  data-testid="notifications-popup"
                >
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div>
                      <div className="text-[15px] font-bold text-foreground">Notifications</div>
                      <div className="text-[11.5px] text-muted-foreground">{unreadCount} new</div>
                    </div>
                    <button onClick={markAllRead} className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline" data-testid="notifications-mark-read">
                      <Check className="h-3.5 w-3.5" /> Mark all read
                    </button>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto">
                    {notifs.map((n) => (
                      <Link
                        key={n.id}
                        to={n.to}
                        onClick={() => { setNotifOpen(false); setNotifs((p) => p.map((x) => x.id === n.id ? { ...x, unread: false } : x)); }}
                        className={cn('flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors', n.unread && 'bg-primary/5')}
                      >
                        <div className={cn('h-9 w-9 rounded-xl grid place-items-center shrink-0', n.color)}>
                          <n.Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-foreground">{n.title}</div>
                          <div className="text-[12px] text-muted-foreground line-clamp-2">{n.desc}</div>
                          <div className="mt-1 text-[11px] text-muted-foreground">{n.time}</div>
                        </div>
                        {n.unread && <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />}
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border">
                    <button onClick={() => { setNotifOpen(false); navigate('/setting'); }} className="w-full h-10 rounded-xl hover:bg-secondary text-[12.5px] font-semibold text-foreground">View all notifications</button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { closeAll(); setProfileOpen((o) => !o); }} className="flex items-center gap-2 pl-1 pr-1 sm:pr-2 py-1 rounded-full hover:bg-secondary" data-testid="topbar-profile-btn">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face'}
                alt=""
                className="h-8 w-8 rounded-full object-cover border border-border"
              />
              <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground" />
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-border bg-card shadow-xl p-4">
                  <div className="flex items-center gap-3">
                    <img src={user?.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold text-foreground truncate">{user?.name}</div>
                      <div className="text-[12px] text-muted-foreground truncate">{user?.email}</div>
                    </div>
                  </div>
                  {role && (
                    <span className={cn('mt-3 inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase', role.badgeClass)}>
                      {role.label}
                    </span>
                  )}
                  {user?.tenant_name && (
                    <div className="mt-3 text-[12px] text-muted-foreground">Tenant: <span className="font-semibold text-foreground">{user.tenant_name}</span></div>
                  )}
                  <div className="mt-3 space-y-1">
                    <Link to="/my-profile" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary">My Profile</Link>
                    <Link to="/setting" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-[13px] font-medium text-foreground hover:bg-secondary">Settings</Link>
                  </div>
                  <button onClick={logout} className="mt-3 w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-secondary hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-[13px] font-semibold" data-testid="topbar-logout-btn">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
