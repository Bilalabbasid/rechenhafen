import React from 'react';
import {
  Calendar,
  Percent,
  TrendingUp,
  CreditCard,
  Home,
  Zap,
  Car,
  Briefcase,
  Activity,
  Heart,
  Hammer,
  Maximize2,
  Shuffle,
  Utensils,
  Building2,
  BarChart2,
  Calculator,
  Receipt,
  Landmark,
  LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Receipt,
  Landmark,
  Calendar,
  Percent,
  TrendingUp,
  CreditCard,
  Home,
  Zap,
  Car,
  Briefcase,
  Activity,
  Heart,
  Hammer,
  Maximize2,
  Shuffle,
  Utensils,
  Building2,
  BarChart2,
  Calculator,
};

interface CategoryIconProps extends LucideProps {
  name: string;
}

export default function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const IconComponent = ICON_MAP[name] || Calculator;
  return <IconComponent {...props} />;
}
