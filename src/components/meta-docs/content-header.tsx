"use client";

import { MobileNav } from "./mobile-nav";
import { DocStep } from "@/lib/meta-docs-data";

interface ContentHeaderProps {
  title: string;
  steps: DocStep[];
  activeStep: string;
  onStepSelect: (stepId: string) => void;
}

export function ContentHeader({ title, steps, activeStep, onStepSelect }: ContentHeaderProps) {
  return (
    <div className="sticky top-0 z-50 flex items-center h-16 bg-white border-b border-gray-200 px-4">
      <MobileNav
        steps={steps}
        activeStep={activeStep}
        onStepSelect={onStepSelect}
      />
      <div className="flex-1 flex justify-center md:justify-start">
        <h1 className="text-xl font-semibold text-gray-900 truncate">
          {title}
        </h1>
      </div>
    </div>
  );
}