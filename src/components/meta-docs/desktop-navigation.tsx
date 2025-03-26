'use client';

import { MetaDocStep } from '@/lib/meta-docs-data';
import { StepsList } from './steps-list';

interface DesktopNavigationProps {
  steps: MetaDocStep[];
  activeStep: string;
  onStepSelect: (stepId: string) => void;
  completedSteps: string[];
}

export function DesktopNavigation({
  steps,
  activeStep,
  onStepSelect,
  completedSteps
}: DesktopNavigationProps) {
  return (
    <div className=" max-w-30 border-neutral-200">
      <div className="sticky top-0 px-2 py-2 ">
        <h1 className="text-2xl font-bold mb-6 px-2 text-neutral-900">
          Meta Integration Guide
        </h1>
        <StepsList
          steps={steps}
          activeStep={activeStep}
          onStepSelect={onStepSelect}
          completedSteps={completedSteps}
        />
      </div>
    </div>
  );
}