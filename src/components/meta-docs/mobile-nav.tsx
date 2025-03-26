"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { DocStep } from "@/lib/meta-docs-data";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface MobileNavProps {
  steps: DocStep[];
  activeStep: string;
  onStepSelect: (stepId: string) => void;
}

export function MobileNav({ steps, activeStep, onStepSelect }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const handleStepSelect = (stepId: string) => {
    onStepSelect(stepId);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
          <VisuallyHidden>Toggle navigation menu</VisuallyHidden>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <VisuallyHidden>Navigation Menu</VisuallyHidden>
        <Sidebar
          steps={steps}
          activeStep={activeStep}
          onStepSelect={handleStepSelect}
          className="border-none"
        />
      </SheetContent>
    </Sheet>
  );
}