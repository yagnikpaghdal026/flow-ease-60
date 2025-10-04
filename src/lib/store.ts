import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Expense, ApprovalRule } from './types';

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Mock data store
interface DataState {
  expenses: Expense[];
  users: User[];
  approvalRules: ApprovalRule[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addApprovalRule: (rule: ApprovalRule) => void;
  updateApprovalRule: (id: string, rule: Partial<ApprovalRule>) => void;
  deleteApprovalRule: (id: string) => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@company.com', role: 'ADMIN', lastLogin: new Date().toISOString() },
  { id: '2', name: 'John Manager', email: 'john@company.com', role: 'MANAGER', lastLogin: new Date().toISOString() },
  { id: '3', name: 'Jane Employee', email: 'jane@company.com', role: 'EMPLOYEE', lastLogin: new Date().toISOString() },
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    ownerId: '3',
    ownerName: 'Jane Employee',
    description: 'Client dinner at Sushi Palace',
    expenseDate: '2025-01-15',
    category: 'Food',
    paidBy: 'Employee',
    totalAmount: 125.50,
    currency: 'USD',
    status: 'SUBMITTED',
    notes: 'Meeting with potential client',
    createdAt: '2025-01-15T18:30:00Z',
    updatedAt: '2025-01-15T18:30:00Z',
  },
  {
    id: '2',
    ownerId: '3',
    ownerName: 'Jane Employee',
    description: 'Flight to NYC for conference',
    expenseDate: '2025-01-10',
    category: 'Travel',
    paidBy: 'Company',
    totalAmount: 450.00,
    currency: 'USD',
    status: 'APPROVED',
    approvedBy: '2',
    approvedAt: '2025-01-11T10:00:00Z',
    createdAt: '2025-01-10T14:20:00Z',
    updatedAt: '2025-01-11T10:00:00Z',
  },
  {
    id: '3',
    ownerId: '3',
    ownerName: 'Jane Employee',
    description: 'New wireless keyboard',
    expenseDate: '2025-01-08',
    category: 'Office',
    paidBy: 'Employee',
    totalAmount: 89.99,
    currency: 'USD',
    status: 'DRAFT',
    createdAt: '2025-01-08T09:15:00Z',
    updatedAt: '2025-01-08T09:15:00Z',
  },
];

const mockRules: ApprovalRule[] = [
  {
    id: '1',
    name: 'Travel Expenses > $500',
    managerUserId: '2',
    managerName: 'John Manager',
    minAmount: 500,
    category: 'Travel',
  },
  {
    id: '2',
    name: 'All Office Supplies',
    managerUserId: '2',
    managerName: 'John Manager',
    category: 'Office',
  },
];

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      expenses: mockExpenses,
      users: mockUsers,
      approvalRules: mockRules,
      addExpense: (expense) =>
        set((state) => ({ expenses: [...state.expenses, expense] })),
      updateExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...expense, updatedAt: new Date().toISOString() } : e
          ),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      addUser: (user) =>
        set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, user) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
      addApprovalRule: (rule) =>
        set((state) => ({ approvalRules: [...state.approvalRules, rule] })),
      updateApprovalRule: (id, rule) =>
        set((state) => ({
          approvalRules: state.approvalRules.map((r) =>
            r.id === id ? { ...r, ...rule } : r
          ),
        })),
      deleteApprovalRule: (id) =>
        set((state) => ({
          approvalRules: state.approvalRules.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'data-storage',
    }
  )
);
