'use client';

import { useEffect } from 'react';
import { MetaDocStep } from '@/lib/meta-docs-data';
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface StepTextProps {
  content: MetaDocStep['content'];
}

export function StepText({ content }: StepTextProps) {
  useEffect(() => {
    hljs.highlightAll();
  }, [content]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Helper function to render text with links
  const renderTextWithLinks = (text: string) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);
    return parts.map((part, index) => {
      // If part matches a URL, wrap it in an <a> tag
      if (urlPattern.test(part)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            {part}
          </a>
        );
      }
      return part; // Return plain text as is
    });
  };

  return (
    <>
      {content.text.map((text, index) => (
        <p key={index}>{renderTextWithLinks(text)}</p>
      ))}

      {content.subSteps?.map((subStep, index) => (
        <div key={index} className="mt-6">
          <h3 className="font-semibold text-lg">{subStep.title}</h3>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            {subStep.items.map((item, itemIndex) => (
              <li key={itemIndex}>{renderTextWithLinks(item)}</li>
            ))}
          </ul>
        </div>
      ))}

      {content.code?.map((code, index) => (
        <div key={index} className="relative mt-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleCopyCode(code.content)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <pre className="bg-neutral-50 p-4 rounded-lg">
            <code className={`language-${code.language}`}>
              {code.content}
            </code>
          </pre>
        </div>
      ))}
    </>
  );
}
