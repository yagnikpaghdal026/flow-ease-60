import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Expenses from "./pages/Expenses";
import NewExpense from "./pages/NewExpense";
import ExpenseDetail from "./pages/ExpenseDetail";
import Approvals from "./pages/Approvals";
import AdminUsers from "./pages/AdminUsers";
import AdminRules from "./pages/AdminRules";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/expenses" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/new" element={<NewExpense />} />
          <Route path="/expenses/:id" element={<ExpenseDetail />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/rules" element={<AdminRules />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
