import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <SideNav />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
