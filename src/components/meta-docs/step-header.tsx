'use client';

import { LucideIcon } from 'lucide-react';
import { StepIcon } from './step-icon';


interface StepHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function StepHeader({ title, description, icon }: StepHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="text-[#EB6C33]">
        <StepIcon icon={icon} />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-neutral-900">{title}</h2>
        <p className="text-neutral-600 mt-1">{description}</p>
      </div>
    </div>
  );
}