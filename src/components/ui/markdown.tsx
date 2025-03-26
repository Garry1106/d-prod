import React from 'react'; 
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { marked } from 'marked';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  React.useEffect(() => {
    hljs.highlightAll();
  }, [content]);

  const renderer = new marked.Renderer();
  
  // Updated link renderer to handle title being null or undefined
  renderer.link = ({ href, title, tokens }: { href: string, title: string | null | undefined, tokens: any[] }) => {
    const safeTitle = title || ''; // Provide a fallback if title is null or undefined
    return `<a href="${href}" title="${safeTitle}" class="text-[#EB6C33] hover:underline" target="_blank" rel="noopener noreferrer">${tokens.map(token => token.text).join('')}</a>`;
  };

  renderer.list = (body, ordered, start) => {
    const type = ordered ? 'ol' : 'ul';
    const startAttr = ordered && start ? ` start="${start}"` : '';
    return `<${type}${startAttr} class="space-y-2 my-4 list-none pl-4">${body}</${type}>`;
  };

  renderer.listitem = (text) => {
    return `<li class="flex items-start">
      <span class="mr-2 mt-1.5 flex-shrink-0">•</span>
      <span class="flex-1">${text}</span>
    </li>`;
  };

  renderer.blockquote = (quote) => {
    return `<blockquote class="border-l-4 border-[#EB6C33] pl-4 my-4 text-gray-600 italic">${quote}</blockquote>`;
  };

  renderer.code = (code, language) => {
    const validLanguage = hljs.getLanguage(language || '') ? language : 'plaintext';
    const highlighted = validLanguage 
      ? hljs.highlight(code, { language: validLanguage }).value 
      : hljs.highlightAuto(code).value;
  
    // Ensure that the value is properly extracted as a string
    const highlightedCode = typeof highlighted === 'string' ? highlighted : '';
  
    return `<pre class="!p-4 !bg-gray-900 !rounded-lg overflow-x-auto"><code class="!bg-transparent !p-0">${highlightedCode}</code></pre>`;
  };

  const html = marked(content, { 
    renderer,
    breaks: true,
    gfm: true
  });

  return (
    <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-800 prose-headings:scroll-mt-20 prose-h2:text-xl md:prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-lg md:prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6 prose-p:text-gray-600 prose-p:leading-relaxed prose-code:text-[#EB6C33] prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:rounded-lg prose-strong:text-gray-800" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
