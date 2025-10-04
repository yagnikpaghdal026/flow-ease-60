import { Badge } from '@/components/ui/badge';
import type { ExpenseStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ExpenseStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<ExpenseStatus, { label: string; className: string }> = {
    DRAFT: {
      label: 'Draft',
      className: 'bg-muted text-muted-foreground',
    },
    SUBMITTED: {
      label: 'Pending',
      className: 'bg-warning-light text-warning border-warning/20',
    },
    APPROVED: {
      label: 'Approved',
      className: 'bg-success-light text-success border-success/20',
    },
    REJECTED: {
      label: 'Rejected',
      className: 'bg-destructive-light text-destructive border-destructive/20',
    },
  };

  const variant = variants[status];

  return (
    <Badge className={cn('border', variant.className)}>
      {variant.label}
    </Badge>
  );
}
