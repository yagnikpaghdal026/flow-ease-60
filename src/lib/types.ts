export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type ExpenseStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLogin?: string;
}

export interface Expense {
  id: string;
  ownerId: string;
  ownerName?: string;
  description: string;
  expenseDate: string;
  category: 'Food' | 'Travel' | 'Office' | 'Misc';
  paidBy: 'Company' | 'Employee';
  totalAmount: number;
  currency: 'USD' | 'EUR' | 'INR' | 'GBP';
  notes?: string;
  status: ExpenseStatus;
  receiptUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRule {
  id: string;
  name: string;
  managerUserId: string;
  managerName?: string;
  minAmount?: number;
  maxAmount?: number;
  percentageThreshold?: number;
  category?: 'Food' | 'Travel' | 'Office' | 'Misc' | 'All';
}
