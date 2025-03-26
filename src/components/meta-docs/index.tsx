"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/meta-docs/sidebar';
import { ContentSection } from '@/components/meta-docs/content-section'
import { documentationSteps } from '@/lib/meta-docs-data';

export default function MetaDocsPage() {
  const [steps, setSteps] = useState(documentationSteps);
  const [activeStep, setActiveStep] = useState(steps[0].id);

  const handleStepSelect = (stepId: string) => {
    setSteps(steps.map(step => ({
      ...step,
      completed: step.id === activeStep ? true : step.completed
    })));
    setActiveStep(stepId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        steps={steps}
        activeStep={activeStep}
        onStepSelect={handleStepSelect}
      />
      <ContentSection
        steps={steps}
        activeStep={activeStep}
        onStepSelect={handleStepSelect}
      />
    </div>
  );
}