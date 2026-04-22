import React, { useState } from 'react';
import { Search, Paperclip, Mic, MoreVertical, Check, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

const THREADS = [
  { id: 't1', name: 'Davis Rosser', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', last: 'Sure! let me tell you about what we...', time: '2 m Ago', unread: 2, online: true },
  { id: 't2', name: 'Emerson Levin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', last: 'You : Find out who is in charge of thi...', time: '2 m Ago', online: true },
  { id: 't3', name: 'Lydia Franci', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', last: 'You : Sure! let me tell you about w...', time: '2 m Ago', online: true },
  { id: 't4', name: 'Miracle Botosh', initials: 'MB', last: 'You : Sure! let me tell you about w...', time: '2 m Ago', online: true },
  { id: 't5', name: 'Zaire Mango', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face', last: 'Sure! let me tell you about what we can...', time: '2 m Ago', online: true },
  { id: 't6', name: 'Ashlynn Bergson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', last: 'You : Sure! let me tell you about w...', time: '2 m Ago' },
  { id: 't7', name: 'Kierra Calzoni', initials: 'KC', last: 'You : Sure! let me tell you about w...', time: '2 m Ago' },
];

const INITIAL_MSGS = [
  { from: 'me', text: 'Hello Marilyn! consectetur adipiscing elit ames.', time: '09:10' },
  { from: 'them', text: 'Fames eros urna, felis morbi a est est.', time: '09:40' },
  { from: 'me', text: 'How confident are we on presenting this?', time: '09:50' },
  { from: 'them', type: 'image', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=70', caption: 'Find out who is in charge of this portion of the process.', time: '10:00' },
];

const MessagesPage = () => {
  const [active, setActive] = useState('t1');
  const [tab, setTab] = useState('All');
  const [msgs, setMsgs] = useState(INITIAL_MSGS);
  const [draft, setDraft] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs([...msgs, { from: 'me', text: draft, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setDraft('');
  };

  const activeThread = THREADS.find((t) => t.id === active);
  const filtered = THREADS.filter((t) => tab === 'Unread' ? t.unread : true);

  return (
    <div className="h-[calc(100vh-120px)] min-h-[500px]">
      <h1 className="text-[26px] font-bold text-foreground mb-4">Message</h1>
      <div className="rounded-2xl border border-border bg-card overflow-hidden h-full grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr]">
        {/* Threads */}
        <aside className={cn('border-r border-border flex flex-col min-h-0', mobileShowThread && 'hidden md:flex')}>
          <div className="p-4">
            <div className="relative">
              <input placeholder="Search message..." className="w-full h-11 rounded-xl bg-background border border-border pl-4 pr-10 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 flex items-center gap-5 border-b border-border">
              {['All', 'Unread'].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={cn('relative pb-2 text-[13px] font-semibold', tab === t ? 'text-primary' : 'text-muted-foreground')}>
                  {t}
                  {tab === t && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary" />}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {filtered.map((t) => (
              <button key={t.id} onClick={() => { setActive(t.id); setMobileShowThread(true); }} className={cn('w-full rounded-xl p-3 flex items-center gap-3 text-left transition-colors', active === t.id ? 'bg-secondary' : 'hover:bg-secondary/40')}>
                <div className="relative">
                  {t.avatar ? <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <div className="h-11 w-11 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-[13px] font-bold">{t.initials}</div>}
                  {t.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-semibold text-foreground truncate">{t.name}</span>
                    <span className="text-[11px] text-muted-foreground">{t.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[12px] text-muted-foreground truncate">{t.last}</span>
                    {t.unread && <span className="h-5 w-5 grid place-items-center rounded-full bg-rose-500 text-white text-[10.5px] font-bold ml-2">{t.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <section className={cn('flex flex-col min-h-0', !mobileShowThread && 'hidden md:flex')}>
          <div className="flex items-center gap-3 px-4 md:px-6 h-[72px] border-b border-border">
            <button onClick={() => setMobileShowThread(false)} className="md:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary">←</button>
            {activeThread?.avatar && <img src={activeThread.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />}
            <div className="flex-1">
              <div className="text-[15px] font-bold text-foreground">{activeThread?.name}</div>
              <div className="text-[11.5px] text-muted-foreground">Last Seen 09:40</div>
            </div>
            <button className="h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"><Phone className="h-4 w-4" /></button>
            <button className="h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"><Video className="h-4 w-4" /></button>
            <button className="h-10 w-10 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"><MoreVertical className="h-4 w-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
                <div className="max-w-[80%] md:max-w-[60%]">
                  {m.type === 'image' ? (
                    <div className={cn('rounded-2xl overflow-hidden border', m.from === 'me' ? 'bg-primary/10 border-primary/20' : 'bg-secondary border-border')}>
                      <img src={m.url} alt="" className="w-full object-cover" />
                      {m.caption && <div className="px-3 py-2 text-[13px] text-foreground">{m.caption}</div>}
                    </div>
                  ) : (
                    <div className={cn('rounded-2xl px-4 py-2.5 text-[13.5px]', m.from === 'me' ? 'bg-primary/15 text-foreground' : 'bg-secondary text-foreground')}>{m.text}</div>
                  )}
                  <div className={cn('mt-1 flex items-center gap-1 text-[11px] text-muted-foreground', m.from === 'me' ? 'justify-end' : 'justify-start')}>
                    {m.time} {m.from === 'me' && <Check className="h-3 w-3 text-primary" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-3 md:p-4 flex items-center gap-2">
            <button className="h-11 w-11 grid place-items-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"><Paperclip className="h-4 w-4" /></button>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Write message here..." className="flex-1 h-11 rounded-xl bg-background border border-border px-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={send} className="h-11 w-11 grid place-items-center rounded-full bg-primary text-white hover:bg-primary/90"><Mic className="h-4 w-4" /></button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MessagesPage;
