import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDataStore } from '@/lib/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { approvalRuleSchema, type ApprovalRuleInput } from '@/lib/validators';

export default function AdminRules() {
  const { approvalRules, users, addApprovalRule, deleteApprovalRule } = useDataStore();
  const [ruleOpen, setRuleOpen] = useState(false);

  const managers = users.filter((u) => u.role === 'MANAGER' || u.role === 'ADMIN');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApprovalRuleInput>({
    resolver: zodResolver(approvalRuleSchema),
    defaultValues: {
      category: 'All',
    },
  });

  const onSubmit = (data: ApprovalRuleInput) => {
    const manager = users.find((u) => u.id === data.managerUserId);
    const newRule = {
      id: Date.now().toString(),
      name: data.name,
      managerUserId: data.managerUserId,
      managerName: manager?.name,
      category: data.category,
      minAmount: data.minAmount || undefined,
      maxAmount: data.maxAmount || undefined,
      percentageThreshold: data.percentageThreshold || undefined,
    };
    addApprovalRule(newRule);
    toast.success('Approval rule created');
    setRuleOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    deleteApprovalRule(id);
    toast.success('Approval rule deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Approval Rules</h1>
            <p className="text-muted-foreground mt-1">
              Configure automatic approval routing and thresholds
            </p>
          </div>
          <Dialog open={ruleOpen} onOpenChange={setRuleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Approval Rule</DialogTitle>
                <DialogDescription>
                  Define criteria for when expenses require approval
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Travel expenses over $500"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">Assigned Manager</Label>
                  <Select
                    onValueChange={(v) => setValue('managerUserId', v)}
                    value={watch('managerUserId')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name} ({manager.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.managerUserId && (
                    <p className="text-sm text-destructive">{errors.managerUserId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(v) => setValue('category', v as any)}
                    value={watch('category')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Misc">Misc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Minimum Amount (optional)</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      step="0.01"
                      {...register('minAmount')}
                      placeholder="0.00"
                    />
                    {errors.minAmount && (
                      <p className="text-sm text-destructive">{errors.minAmount.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Maximum Amount (optional)</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      step="0.01"
                      {...register('maxAmount')}
                      placeholder="No limit"
                    />
                    {errors.maxAmount && (
                      <p className="text-sm text-destructive">{errors.maxAmount.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="percentageThreshold">
                    Percentage Threshold (optional)
                  </Label>
                  <Input
                    id="percentageThreshold"
                    type="number"
                    step="1"
                    max="100"
                    {...register('percentageThreshold')}
                    placeholder="e.g., 80 for 80%"
                  />
                  {errors.percentageThreshold && (
                    <p className="text-sm text-destructive">
                      {errors.percentageThreshold.message}
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setRuleOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Rule</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount Range</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvalRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No approval rules configured. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                approvalRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>{rule.managerName}</TableCell>
                    <TableCell>{rule.category}</TableCell>
                    <TableCell>
                      {rule.minAmount || rule.maxAmount ? (
                        <>
                          {rule.minAmount ? `$${rule.minAmount}` : 'Any'} -{' '}
                          {rule.maxAmount ? `$${rule.maxAmount}` : 'Any'}
                        </>
                      ) : (
                        'Any amount'
                      )}
                    </TableCell>
                    <TableCell>
                      {rule.percentageThreshold ? `${rule.percentageThreshold}%` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(rule.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
