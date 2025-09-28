import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { signOut, getCurrentUser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  BarChart3, 
  Plus, 
  Bot, 
  Info, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
  });

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: BarChart3 },
    { href: '/add-expense', label: 'Add Expense', icon: Plus },
    { href: '/ai-advice', label: 'AI Advice', icon: Bot },
    { href: '/about', label: 'About', icon: Info },
  ];

  return (
    <>
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Budget Buddy</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.a
                    className={`nav-item text-foreground hover:text-primary font-medium transition-colors ${
                      location === item.href ? 'text-primary' : ''
                    }`}
                    whileHover={{ y: -2 }}
                    data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    {item.label}
                  </motion.a>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 text-primary" />
                <span data-testid="text-user-email">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 ${
          mobileMenuOpen ? 'block' : 'hidden'
        }`}
        initial={{ y: 100 }}
        animate={{ y: mobileMenuOpen ? 0 : 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="grid grid-cols-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex flex-col items-center py-2 transition-colors ${
                    location === item.href 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-link-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
