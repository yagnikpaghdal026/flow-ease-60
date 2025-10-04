import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { useDataStore } from '@/lib/store';
import { ArrowLeft, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const expenses = useDataStore((state) => state.expenses);
  
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Expense not found</h2>
          <Button onClick={() => navigate('/expenses')} className="mt-4">
            Back to Expenses
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/expenses')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Expenses
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{expense.description}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Created on {new Date(expense.createdAt).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={expense.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-base font-medium mt-1">
                  {new Date(expense.expenseDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-base font-medium mt-1">{expense.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid By</p>
                <p className="text-base font-medium mt-1">{expense.paidBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="text-base font-medium mt-1">
                  {expense.currency} {expense.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {expense.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                  <p className="text-base">{expense.notes}</p>
                </div>
              </>
            )}

            {expense.receiptUrl && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Receipt</p>
                  <div className="border border-border rounded-lg p-4">
                    <img
                      src={expense.receiptUrl}
                      alt="Receipt"
                      className="max-w-full h-auto rounded"
                    />
                  </div>
                </div>
              </>
            )}

            {expense.status === 'APPROVED' && expense.approvedBy && (
              <>
                <Separator />
                <div className="bg-success-light p-4 rounded-lg">
                  <p className="text-sm font-medium text-success">
                    Approved on {new Date(expense.approvedAt!).toLocaleString()}
                  </p>
                </div>
              </>
            )}

            {expense.status === 'REJECTED' && (
              <>
                <Separator />
                <div className="bg-destructive-light p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    This expense was rejected
                  </p>
                  {expense.rejectedReason && (
                    <p className="text-sm text-destructive/80">
                      Reason: {expense.rejectedReason}
                    </p>
                  )}
                </div>
              </>
            )}

            {expense.status === 'DRAFT' && (
              <div className="flex gap-3">
                <Link to={`/expenses/${expense.id}/edit`}>
                  <Button>Edit Expense</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
