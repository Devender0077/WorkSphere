import React from 'react';
import { Link } from 'react-router-dom';

const AuthShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="authLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {Array.from({ length: 16 }).map((_, i) => (
          <path
            key={i}
            d={`M -100 ${100 + i * 50} C 300 ${50 + i * 55} 900 ${200 + i * 48} 1600 ${80 + i * 52}`}
            fill="none"
            stroke="url(#authLine)"
            strokeWidth="1"
          />
        ))}
      </svg>

      <header className="relative z-10 flex items-center justify-between px-6 md:px-14 py-6">
        <Link to="/login" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary grid place-items-center text-white font-extrabold">H</div>
          <span className="text-[18px] font-bold tracking-tight text-foreground">HRDashboard</span>
        </Link>
      </header>

      <main className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="relative z-10 text-center py-8 text-[11.5px] text-muted-foreground">
        © 2025 HRDashboard. Alrights reserved. <a href="#" className="font-semibold text-foreground ml-2">Terms &amp; Conditions</a> <span className="mx-1">·</span> <a href="#" className="font-semibold text-foreground">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default AuthShell;
