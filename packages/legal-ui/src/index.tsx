import { ArrowLeft } from 'lucide-react';

import type { ReactNode } from 'react';

import { cn } from '@carefully-built/ui';

export { privacyPolicyText, termsAndConditionsText } from './legal-texts';

export interface LegalDocumentClassNames {
  readonly root?: string;
  readonly logoBar?: string;
  readonly logoLink?: string;
  readonly main?: string;
  readonly container?: string;
  readonly header?: string;
  readonly backWrapper?: string;
  readonly backLink?: string;
  readonly title?: string;
  readonly action?: string;
  readonly content?: string;
  readonly heading?: string;
  readonly standaloneHeading?: string;
  readonly paragraph?: string;
  readonly link?: string;
}

export interface LegalDocumentProps {
  readonly title: string;
  readonly content: string;
  readonly logo?: ReactNode;
  readonly logoHref?: string;
  readonly backHref?: string;
  readonly backLabel?: string;
  readonly action?: ReactNode;
  readonly standaloneHeadings?: ReadonlySet<string>;
  readonly className?: string;
  readonly classes?: LegalDocumentClassNames;
}

const defaultStandaloneHeadings = new Set([
  'Introduction',
  'Information we collect',
  'How we use information',
  'Legal bases',
  'Service providers',
  'Cookies and analytics',
  'Data retention',
  'Security',
  'International transfers',
  'Your rights',
  'Children',
  'Changes',
  'Contact',
]);

function formatParagraph(paragraph: string): string {
  return paragraph.replaceAll('👉 ', '').trim();
}

function isUrlParagraph(paragraph: string): boolean {
  return /^https?:\/\//.test(paragraph.trim()) || /^www\./.test(paragraph.trim());
}

function isNumberedHeading(paragraph: string): boolean {
  return /^\d+(\.\d+)?\s+/.test(paragraph.trim());
}

export function LegalDocument({
  title,
  content,
  logo,
  logoHref = '/',
  backHref = '/login',
  backLabel = 'Go back',
  action,
  standaloneHeadings = defaultStandaloneHeadings,
  className,
  classes,
}: LegalDocumentProps): React.ReactElement {
  const paragraphs = content
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className={cn('bg-background min-h-screen', className, classes?.root)}>
      {logo ? (
        <div className={cn('px-5 py-5 sm:px-6 lg:px-8', classes?.logoBar)}>
          <a href={logoHref} className={cn('inline-flex', classes?.logoLink)}>
            {logo}
          </a>
        </div>
      ) : null}

      <main className={cn('px-5 pt-4 pb-16 sm:px-6 lg:px-8 lg:pb-24', classes?.main)}>
        <div className={cn('mx-auto flex w-full max-w-[946px] flex-col gap-8', classes?.container)}>
          <div className={cn('grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]', classes?.header)}>
            <div className={cn('flex justify-start', classes?.backWrapper)}>
              <a
                href={backHref}
                className={cn(
                  'text-foreground inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70',
                  classes?.backLink,
                )}
              >
                <ArrowLeft className="size-4" />
                {backLabel}
              </a>
            </div>

            <h1
              className={cn(
                'text-foreground text-center text-[28px] font-semibold tracking-[-0.03em] sm:text-[32px]',
                classes?.title,
              )}
            >
              {title}
            </h1>

            <div className={cn('flex justify-start sm:justify-end', classes?.action)}>
              {action ?? null}
            </div>
          </div>

          <div
            className={cn(
              'space-y-6 text-[15px] leading-7 tracking-[-0.018em] text-[#242529]',
              classes?.content,
            )}
          >
            {paragraphs.map((paragraph, index) =>
              isNumberedHeading(paragraph) ? (
                <h2
                  key={`${title}-${index}`}
                  className={cn(
                    'text-foreground pt-2 text-[19px] leading-7 font-semibold tracking-[-0.03em]',
                    classes?.heading,
                  )}
                >
                  {paragraph}
                </h2>
              ) : standaloneHeadings.has(paragraph.trim()) ? (
                <h3
                  key={`${title}-${index}`}
                  className={cn(
                    'text-foreground pt-1 text-[17px] leading-7 font-semibold tracking-[-0.025em]',
                    classes?.standaloneHeading,
                  )}
                >
                  {paragraph}
                </h3>
              ) : isUrlParagraph(paragraph) ? (
                <p key={`${title}-${index}`} className={cn('break-words', classes?.paragraph)}>
                  <a
                    href={paragraph.startsWith('http') ? paragraph : `https://${paragraph}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn('underline underline-offset-4', classes?.link)}
                  >
                    {paragraph}
                  </a>
                </p>
              ) : (
                <p
                  key={`${title}-${index}`}
                  className={cn('whitespace-pre-line', classes?.paragraph)}
                >
                  {formatParagraph(paragraph)}
                </p>
              ),
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
