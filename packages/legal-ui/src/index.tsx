import { ArrowLeft } from 'lucide-react';

import type { ReactNode } from 'react';

export { privacyPolicyText, termsAndConditionsText } from './legal-texts';

export interface LegalDocumentProps {
  readonly title: string;
  readonly content: string;
  readonly logo?: ReactNode;
  readonly logoHref?: string;
  readonly backHref?: string;
  readonly backLabel?: string;
  readonly action?: ReactNode;
  readonly standaloneHeadings?: ReadonlySet<string>;
}

const defaultStandaloneHeadings = new Set([
  'Titolare del Trattamento',
  'Dati Personali',
  'Categoria di Dati Personali trattati',
  'Modalità di Trattamento dei Dati Personali',
  'Finalità del Trattamento dei Dati personali e Base giuridica',
  'Comunicazione dei Dati',
  'Tempi del Trattamento',
  'Cookie',
  'Luogo del Trattamento e trasferimento dei Dati all’estero',
  "Esercizio dei diritti dell'interessato",
  'Strumenti utilizzati per il Trattamento dei Dati Personali',
  'FORM DI CONTATTO',
  'STATISTICA',
  'TOOL DI AUTOMAZIONE',
  'INTERAZIONE CON I SOCIAL NETWORK',
  'REMARKETING E RETARGETING',
  'Modifiche a questa Privacy Policy',
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
  backLabel = 'Torna indietro',
  action,
  standaloneHeadings = defaultStandaloneHeadings,
}: LegalDocumentProps): React.ReactElement {
  const paragraphs = content
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="bg-background min-h-screen">
      {logo ? (
        <div className="px-5 py-5 sm:px-6 lg:px-8">
          <a href={logoHref} className="inline-flex">
            {logo}
          </a>
        </div>
      ) : null}

      <main className="px-5 pt-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto flex w-full max-w-[946px] flex-col gap-8">
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div className="flex justify-start">
              <a
                href={backHref}
                className="text-foreground inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
              >
                <ArrowLeft className="size-4" />
                {backLabel}
              </a>
            </div>

            <h1 className="text-foreground text-center text-[28px] font-semibold tracking-[-0.03em] sm:text-[32px]">
              {title}
            </h1>

            <div className="flex justify-start sm:justify-end">{action ?? null}</div>
          </div>

          <div className="space-y-6 text-[15px] leading-7 tracking-[-0.018em] text-[#242529]">
            {paragraphs.map((paragraph, index) =>
              isNumberedHeading(paragraph) ? (
                <h2
                  key={`${title}-${index}`}
                  className="text-foreground pt-2 text-[19px] leading-7 font-semibold tracking-[-0.03em]"
                >
                  {paragraph}
                </h2>
              ) : standaloneHeadings.has(paragraph.trim()) ? (
                <h3
                  key={`${title}-${index}`}
                  className="text-foreground pt-1 text-[17px] leading-7 font-semibold tracking-[-0.025em]"
                >
                  {paragraph}
                </h3>
              ) : isUrlParagraph(paragraph) ? (
                <p key={`${title}-${index}`} className="break-words">
                  <a
                    href={paragraph.startsWith('http') ? paragraph : `https://${paragraph}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    {paragraph}
                  </a>
                </p>
              ) : (
                <p key={`${title}-${index}`} className="whitespace-pre-line">
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
