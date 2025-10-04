import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import {
  Receipt,
  Plus,
  CheckSquare,
  Users,
  Settings,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    title: 'My Expenses',
    href: '/expenses',
    icon: Receipt,
    roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'],
  },
  {
    title: 'New Expense',
    href: '/expenses/new',
    icon: Plus,
    roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'],
  },
  {
    title: 'Approvals',
    href: '/approvals',
    icon: CheckSquare,
    roles: ['MANAGER', 'ADMIN'],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Approval Rules',
    href: '/admin/rules',
    icon: Settings,
    roles: ['ADMIN'],
  },
];

export function SideNav() {
  const user = useAuthStore((state) => state.user);

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="w-64 border-r border-border bg-sidebar">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ExpenseFlow
        </h1>
      </div>

      <nav className="p-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
