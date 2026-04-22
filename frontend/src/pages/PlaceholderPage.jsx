import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title, description }) => (
  <div className="max-w-5xl">
    <h1 className="text-[26px] font-bold text-foreground">{title}</h1>
    <p className="mt-1 text-[13.5px] text-muted-foreground">{description || 'This module is part of the HR Dashboard kit.'}</p>

    <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-16 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-secondary grid place-items-center text-muted-foreground">
        <Construction className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-[16px] font-semibold text-foreground">{title} coming soon</h3>
      <p className="mt-2 text-[13px] text-muted-foreground max-w-md mx-auto">
        This page is a placeholder following the HRDashboard UI Kit. The layout, theming (light/dark), and navigation already match the design system.
      </p>
    </div>
  </div>
);

export default PlaceholderPage;
