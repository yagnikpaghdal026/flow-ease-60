import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore, useDataStore } from '@/lib/store';
import { expenseSchema, type ExpenseInput } from '@/lib/validators';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

export default function NewExpense() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const addExpense = useDataStore((state) => state.addExpense);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseDate: new Date().toISOString().split('T')[0],
      category: 'Food',
      paidBy: 'Employee',
      currency: 'USD',
    },
  });

  const onSubmit = (data: ExpenseInput) => {
    const newExpense = {
      id: Date.now().toString(),
      ownerId: user!.id,
      ownerName: user!.name,
      description: data.description,
      expenseDate: data.expenseDate,
      category: data.category,
      paidBy: data.paidBy,
      totalAmount: data.totalAmount,
      currency: data.currency,
      notes: data.notes,
      receiptUrl: data.receiptUrl,
      status: 'DRAFT' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addExpense(newExpense);
    toast.success('Expense created successfully');
    navigate('/expenses');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReceiptPreview(url);
      setValue('receiptUrl', url);
    }
  };

  const removeReceipt = () => {
    setReceiptPreview(null);
    setValue('receiptUrl', undefined);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">New Expense</h1>
          <p className="text-muted-foreground mt-1">
            Create a new expense report
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    {...register('description')}
                    placeholder="Client dinner, conference ticket, etc."
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenseDate">Expense Date *</Label>
                  <Input
                    id="expenseDate"
                    type="date"
                    {...register('expenseDate')}
                  />
                  {errors.expenseDate && (
                    <p className="text-sm text-destructive">{errors.expenseDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    onValueChange={(value) => setValue('category', value as any)}
                    defaultValue={watch('category')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Misc">Misc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paidBy">Paid By *</Label>
                  <Select
                    onValueChange={(value) => setValue('paidBy', value as any)}
                    defaultValue={watch('paidBy')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Company">Company Card</SelectItem>
                      <SelectItem value="Employee">Personal Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Amount *</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    {...register('totalAmount')}
                    placeholder="0.00"
                  />
                  {errors.totalAmount && (
                    <p className="text-sm text-destructive">{errors.totalAmount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select
                    onValueChange={(value) => setValue('currency', value as any)}
                    defaultValue={watch('currency')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  rows={3}
                  placeholder="Additional details about this expense..."
                />
              </div>

              <div className="space-y-2">
                <Label>Receipt</Label>
                {receiptPreview ? (
                  <div className="relative border border-border rounded-lg p-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeReceipt}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-4">
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="h-24 w-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Receipt uploaded</p>
                        <p className="text-xs text-muted-foreground">
                          Click the X to remove
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">Upload receipt</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        PDF, PNG, or JPG (max 10MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/expenses')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
