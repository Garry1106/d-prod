"use client";

import { Markdown } from "@/components/ui/markdown";
import { documentationContent ,DocStep} from "@/lib/meta-docs-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentHeader } from "./content-header";


interface ContentSectionProps {
  activeStep: string;
  steps: DocStep[];
  onStepSelect: (stepId: string) => void;
}

export function ContentSection({ activeStep, steps, onStepSelect }: ContentSectionProps) {
  const content = documentationContent[activeStep as keyof typeof documentationContent];

  return (
    <div className="flex-1 min-h-screen">
      <ContentHeader
        title={content.title}
        steps={steps}
        activeStep={activeStep}
        onStepSelect={onStepSelect}
      />
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          <div className="mb-8">
            <div className="h-1 w-20 bg-[#EB6C33] mt-4"></div>
          </div>
          <div className="prose-sm md:prose-base">
            {/* <Markdown content={content.content} /> */}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}