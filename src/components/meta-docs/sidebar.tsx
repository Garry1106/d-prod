"use client";

import { cn } from "@/lib/utils";
import { DocStep } from "@/lib/meta-docs-data";
import { SidebarItem } from "./sidebar-item";

interface SidebarProps {
  steps: DocStep[];
  activeStep: string;
  onStepSelect: (stepId: string) => void;
  className?: string;
}

export function Sidebar({ steps, activeStep, onStepSelect, className }: SidebarProps) {
  return (
    <div className={cn(
      "w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto hidden md:block",
      "md:sticky md:top-0",
      className
    )}>
      <div className="py-4">
        <h2 className="text-lg font-semibold mb-4">Documentation</h2>
        <nav className="space-y-1">
          {steps.map((step) => (
            <SidebarItem
              key={step.id}
              step={step}
              isActive={activeStep === step.id}
              onSelect={onStepSelect}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}