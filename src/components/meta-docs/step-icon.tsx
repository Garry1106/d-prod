'use client';

import { LucideIcon } from 'lucide-react';

interface StepIconProps {
  icon: LucideIcon;
}

export function StepIcon({ icon: Icon }: StepIconProps) {
  return <Icon className="w-5 h-5" />;
}