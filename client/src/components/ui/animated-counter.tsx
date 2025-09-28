import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedCounter({ 
  value, 
  prefix = '', 
  suffix = '', 
  duration = 2000,
  decimals = 2 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startValue = 0;
    
    const animateValue = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * easeOutCubic;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    requestAnimationFrame(animateValue);
  }, [value, duration]);

  const formatValue = (val: number) => {
    if (prefix === '$') {
      return val.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
    return Math.floor(val).toLocaleString();
  };

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animated-counter"
    >
      {prefix}{formatValue(displayValue)}{suffix}
    </motion.span>
  );
}
