'use client';

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { MetaDocStep } from '@/lib/meta-docs-data';
import { StepsList } from './steps-list';

interface MobileNavigationProps {
  steps: MetaDocStep[];
  activeStep: string;
  onStepSelect: (stepId: string) => void;
  completedSteps: string[];
}

export function MobileNavigation({ 
  steps, 
  activeStep, 
  onStepSelect, 
  completedSteps 
}: MobileNavigationProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b p-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="p-6">
            <SheetTitle className="text-2xl font-bold mb-6 text-neutral-900">
              Meta Integration Guide
            </SheetTitle>
            <StepsList
              steps={steps}
              activeStep={activeStep}
              onStepSelect={onStepSelect}
              completedSteps={completedSteps}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}