import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Navbar } from "@/components/navigation/navbar";
import Home from "@/pages/home";
import About from "@/pages/about";
import { ExpenseForm } from "@/components/dashboard/expense-form";
import { AIAdvice } from "@/components/dashboard/ai-advice";
import NotFound from "@/pages/not-found";

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/add-expense" component={ExpenseForm} />
          <Route path="/ai-advice" component={AIAdvice} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function Router() {
  return (
    <AuthGuard>
      <AppContent />
    </AuthGuard>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
