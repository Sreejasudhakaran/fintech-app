import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Code2, Database, Brain } from 'lucide-react';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">About Budget Buddy</h2>
        <p className="text-muted-foreground">Meet the team behind your financial success</p>
      </div>

      <div className="flex justify-center">
        <motion.div
          className="card-flip w-80 h-48"
          whileHover={{ rotateY: 180 }}
          style={{ perspective: 1000 }}
        >
          <motion.div
            className="card-inner relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
            transition={{ duration: 0.6 }}
          >
            {/* Front of Card */}
            <Card className="card-front absolute inset-0 card-shadow" style={{ backfaceVisibility: 'hidden' }}>
              <CardContent className="bg-gradient-to-br from-primary to-accent rounded-xl p-8 flex flex-col justify-center items-center text-center text-white h-full">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    👤
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold mb-2">App Published by</h3>
                <p className="text-lg" data-testid="text-publisher">Sreeja Thati</p>
              </CardContent>
            </Card>

            {/* Back of Card */}
            <Card 
              className="card-back absolute inset-0 card-shadow" 
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)' 
              }}
            >
              <CardContent className="rounded-xl p-8 flex flex-col justify-center items-center text-center h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Built with Love</h3>
                <p className="text-muted-foreground mb-4">
                  Empowering smart financial decisions through technology
                </p>
                <div className="flex space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="text-accent"
                  >
                    <Code2 className="h-6 w-6" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="text-accent"
                  >
                    <Database className="h-6 w-6" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="text-accent"
                  >
                    <Brain className="h-6 w-6" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 text-center"
      >
        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Secure Supabase Authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>AI-Powered Savings Advice</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Interactive Charts & Analytics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Mobile-Responsive Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Real-time Expense Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Smooth Animations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
