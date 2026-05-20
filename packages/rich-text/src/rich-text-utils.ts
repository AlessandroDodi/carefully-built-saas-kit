import type { JSONContent } from '@tiptap/react';

const EMPTY_DOCUMENT: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
    },
  ],
};

export function isRichTextDocument(value: unknown): value is JSONContent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as { type?: unknown }).type === 'doc'
  );
}

export function parseSerializedRichTextDocument(value: string): JSONContent | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    return isRichTextDocument(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function buildParagraph(text: string): JSONContent {
  return {
    type: 'paragraph',
    content: text
      ? [
          {
            type: 'text',
            text,
          },
        ]
      : undefined,
  };
}

function extractText(node: JSONContent | undefined): string {
  if (!node) {
    return '';
  }

  const nodeText = typeof node.text === 'string' ? node.text : '';
  const childText = Array.isArray(node.content)
    ? node.content.map(extractText).filter(Boolean).join(' ')
    : '';

  return [nodeText, childText].filter(Boolean).join(' ').trim();
}

export function createRichTextDocumentFromText(text: string): JSONContent {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return EMPTY_DOCUMENT;
  }

  const paragraphs = normalizedText
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return {
    type: 'doc',
    content: paragraphs.length > 0 ? paragraphs.map(buildParagraph) : [buildParagraph(normalizedText)],
  };
}

export function parseRichTextContent(value: string | undefined | null): JSONContent {
  if (!value) {
    return EMPTY_DOCUMENT;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return isRichTextDocument(parsed) ? parsed : createRichTextDocumentFromText(value);
  } catch {
    return createRichTextDocumentFromText(value);
  }
}

export function stringifyRichTextContent(value: JSONContent): string {
  return JSON.stringify(value);
}

export function getPlainTextFromRichText(value: string | undefined | null): string {
  const document = parseRichTextContent(value);
  return extractText(document).replace(/\s+/g, ' ').trim();
}

export function hasRichTextContent(value: string | undefined | null): boolean {
  return getPlainTextFromRichText(value).length > 0;
}
