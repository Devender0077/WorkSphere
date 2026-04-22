import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '@/contexts/AuthContext';
import ProductTour from '@/components/tour/ProductTour';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
      <ProductTour />
    </div>
  );
};

export default DashboardLayout;
