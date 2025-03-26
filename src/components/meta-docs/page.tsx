'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetaDocStep, metaDocSteps } from '@/lib/meta-docs-data';

export function MetaDocsPage() {
  const [activeStep, setActiveStep] = useState('required-details');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Handle step completion and proceed to the next step
  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      // Move to the next step
      const currentIndex = metaDocSteps.findIndex((step) => step.id === stepId);
      if (currentIndex < metaDocSteps.length - 1) {
        setActiveStep(metaDocSteps[currentIndex + 1].id);  // Proceed to the next step
      }
    }
  };

  // Get the selected step
  const selectedStep = metaDocSteps.find((step) => step.id === activeStep);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto  py-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-black">Getting Started with Facebook Meta Integration</h1>

        {/* Two sections (Sidebar + Content) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Sidebar */}
          <div className="lg:w-1/5 w-full space-y-4 flex-shrink-0 max-w-full pr-4 border-r">
            <h2 className="text-xl font-semibold text-black">Meta Integration Guide</h2>
            <nav className="space-y-2">
              {metaDocSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={cn(
                      'w-full text-left px-4 py-2 rounded-lg transition-colors',
                      'hover:bg-neutral-50 relative group',
                      activeStep === step.id
                        ? 'bg-[#EB6C33]/5 text-[#EB6C33]' 
                        : 'text-neutral-600'
                    )}
                  >
                    <div className="flex items-center">
                      <span className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3',
                        'border transition-colors',
                        activeStep === step.id
                          ? 'border-[#EB6C33] text-[#EB6C33] bg-[#EB6C33]/5' 
                          : isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-neutral-300 text-neutral-500'
                      )}>
                        {isCompleted ? <Check className="h-4 w-4" /> :index+1}
                      </span>
                      <span className="font-medium">{step.title}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Section - Content */}
          <div className="lg:w-4/5 w-full bg-white p-4 lg:p-8 border rounded-lg shadow-md max-w-full overflow-hidden">
            <div className="space-y-6">
              {/* Step Content */}
              <h2 className="text-2xl font-semibold text-black">{selectedStep?.title}</h2>
              <p className="text-lg text-gray-700">{selectedStep?.description}</p>

              {/* Displaying Substeps */}
              {selectedStep?.content.subSteps?.map((subStep, index) => (
                <div key={index} className="mt-6">
                  <h3 className="text-xl font-semibold text-black">{subStep.title}</h3>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    {subStep.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Displaying Code */}
              {selectedStep?.content.code?.map((code, index) => (
                <div key={index} className="relative mt-4">
                  <pre className="bg-neutral-50 p-4 rounded-lg overflow-x-auto">
                    <code className={`language-${code.language}`}>
                      {code.content}
                    </code>
                  </pre>
                </div>
              ))}

              <button
                onClick={() => handleStepComplete(activeStep)}
                className="mt-6 bg-[#EB6C33] text-white py-2 px-6 rounded-md hover:bg-[#D45F2F]"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
