import { Fragment } from 'react';

import type { JSONContent } from '@tiptap/react';
import type React from 'react';

import { cn } from '@carefully-built/ui';
import { parseRichTextContent } from './rich-text-utils';

export interface RichTextRendererProps {
  readonly value: string | null | undefined;
  readonly className?: string;
}

type RichTextMark = NonNullable<JSONContent['marks']>[number];

function renderRichTextMarks(text: React.ReactNode, marks: readonly RichTextMark[] = []): React.ReactNode {
  return marks.reduce((content, mark, index) => {
    const key = `${mark.type}-${String(index)}`;

    switch (mark.type) {
      case 'bold':
        return <strong key={key}>{content}</strong>;
      case 'italic':
        return <em key={key}>{content}</em>;
      case 'strike':
        return <s key={key}>{content}</s>;
      case 'code':
        return <code key={key}>{content}</code>;
      case 'link': {
        const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : '';
        return href ? (
          <a key={key} href={href} target="_blank" rel="noreferrer">
            {content}
          </a>
        ) : content;
      }
      default:
        return content;
    }
  }, text);
}

function renderRichTextChildren(node: JSONContent, keyPrefix: string): React.ReactNode {
  return node.content?.map((child, index) => renderRichTextNode(child, `${keyPrefix}-${String(index)}`)) ?? null;
}

function renderRichTextHeading(level: number, key: string, children: React.ReactNode): React.ReactNode {
  if (level === 1) return <h1 key={key}>{children}</h1>;
  if (level === 2) return <h2 key={key}>{children}</h2>;
  if (level === 4) return <h4 key={key}>{children}</h4>;
  if (level === 5) return <h5 key={key}>{children}</h5>;
  if (level === 6) return <h6 key={key}>{children}</h6>;
  return <h3 key={key}>{children}</h3>;
}

function renderRichTextTable(key: string, children: React.ReactNode): React.ReactNode {
  return (
    <div key={key} className="overflow-x-auto">
      <table>{children}</table>
    </div>
  );
}

function renderRichTextNode(node: JSONContent, key: string): React.ReactNode {
  if (node.type === 'text') {
    return <Fragment key={key}>{renderRichTextMarks(node.text ?? '', node.marks)}</Fragment>;
  }

  if (node.type === 'hardBreak') {
    return <br key={key} />;
  }

  const children = renderRichTextChildren(node, key);
  switch (node.type) {
    case 'doc':
      return <>{children}</>;
    case 'paragraph':
      return <p key={key}>{children}</p>;
    case 'heading':
      return renderRichTextHeading(typeof node.attrs?.level === 'number' ? node.attrs.level : 3, key, children);
    case 'bulletList':
      return <ul key={key}>{children}</ul>;
    case 'orderedList':
      return <ol key={key}>{children}</ol>;
    case 'listItem':
      return <li key={key}>{children}</li>;
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>;
    case 'horizontalRule':
      return <hr key={key} />;
    case 'table':
      return renderRichTextTable(key, children);
    case 'tableRow':
      return <tr key={key}>{children}</tr>;
    case 'tableHeader':
      return <th key={key}>{children}</th>;
    case 'tableCell':
      return <td key={key}>{children}</td>;
    default:
      return children;
  }
}

export function RichTextRenderer({ value, className }: RichTextRendererProps): React.ReactElement {
  const document = parseRichTextContent(value);

  return (
    <div
      className={cn(
        'max-w-5xl space-y-3 text-[13px] leading-6 text-[#4a5565] sm:text-[14px]',
        '[&_a]:font-medium [&_a]:text-[#12161d] [&_a]:underline [&_a]:underline-offset-2',
        '[&_blockquote]:border-l-2 [&_blockquote]:border-[#d9dde3] [&_blockquote]:pl-4 [&_blockquote]:text-[#61656e] [&_code]:rounded [&_code]:bg-[#f4f6f8] [&_code]:px-1 [&_code]:py-0.5',
        '[&_h1]:text-[24px] [&_h1]:font-medium [&_h1]:leading-8 [&_h1]:text-[#0a0a0a] [&_h2]:text-[21px] [&_h2]:font-medium [&_h2]:leading-8 [&_h2]:text-[#0a0a0a] [&_h3]:text-[18px] [&_h3]:font-medium [&_h3]:leading-7 [&_h3]:text-[#0a0a0a]',
        '[&_hr]:border-[#e5e7eb] [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-[#12161d]',
        '[&_table]:min-w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#d9dde3] [&_td]:p-2 [&_th]:border [&_th]:border-[#d9dde3] [&_th]:bg-[#f4f6f8] [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold',
        '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
        className
      )}
    >
      {renderRichTextNode(document, 'root')}
    </div>
  );
}
