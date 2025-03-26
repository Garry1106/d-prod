'use client';

import { cn } from '@/lib/utils';
import { MetaDocStep } from '@/lib/meta-docs-data';
import { Check } from 'lucide-react';

interface StepsListProps {
  steps: MetaDocStep[];
  activeStep: string;
  onStepSelect: (stepId: string) => void;
  completedSteps: string[];
}

export function StepsList({ steps, activeStep, onStepSelect, completedSteps }: StepsListProps) {
  return (
    <nav className="space-y-1">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        return (
          <button
            key={step.id}
            onClick={() => onStepSelect(step.id)}
            className={cn(
              'text-left px-2 py-2 rounded-lg transition-colors max-w-sm', // Add `max-w-xs` to limit the width
              'hover:bg-neutral-50 ',
              activeStep === step.id 
                ? 'bg-[#EB6C33]/5 text-[#EB6C33]' 
                : 'text-neutral-600'
            )}
          >
            <div className="flex items-center">
              <span className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-sm mr-3',
                'border transition-colors',
                activeStep === step.id 
                  ? 'border-[#EB6C33] text-[#EB6C33] bg-[#EB6C33]/5' 
                  : isCompleted
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-neutral-300 text-neutral-500'
              )}>
                {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              <span className="font-medium">{step.title}</span>
            </div>
          </button>
        )
      })}
    </nav>
  );
}
