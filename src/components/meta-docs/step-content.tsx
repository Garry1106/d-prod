'use client';

import { MetaDocStep } from '@/lib/meta-docs-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepHeader } from './step-header';
import { StepText } from './step-text';

interface StepContentProps {
  step: MetaDocStep;
  onComplete: () => void;
}

export function StepContent({ step, onComplete }: StepContentProps) {
  return (
    <div className="max-w-3xl">
      <StepHeader 
        title={step.title}
        description={step.description}
        icon={step.icon}
      />
      <Card className="border border-neutral-200">
        <div className="p-6 prose prose-neutral max-w-none">
          <StepText content={step.content} />
          <div className="mt-8 flex justify-end">
            <Button onClick={onComplete} className="bg-[#EB6C33] hover:bg-[#EB6C33]/90">
              Procced -{'>'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}