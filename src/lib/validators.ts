import { z } from 'zod';

export const expenseSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  expenseDate: z.string().min(1, 'Date is required'),
  category: z.enum(['Food', 'Travel', 'Office', 'Misc']),
  paidBy: z.enum(['Company', 'Employee']),
  totalAmount: z.coerce.number().positive('Amount must be positive'),
  currency: z.enum(['USD', 'EUR', 'INR', 'GBP']),
  notes: z.string().optional(),
  receiptUrl: z.string().optional(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;

export const approvalRuleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  managerUserId: z.string().min(1, 'Manager is required'),
  minAmount: z.coerce.number().nonnegative().optional(),
  maxAmount: z.coerce.number().nonnegative().optional(),
  percentageThreshold: z.coerce.number().min(0).max(100).optional(),
  category: z.enum(['Food', 'Travel', 'Office', 'Misc', 'All']),
});

export type ApprovalRuleInput = z.infer<typeof approvalRuleSchema>;

export const userInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
});

export type UserInviteInput = z.infer<typeof userInviteSchema>;
