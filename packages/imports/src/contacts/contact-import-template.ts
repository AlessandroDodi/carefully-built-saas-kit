import { CONTACT_IMPORT_HEADERS } from './contact-import-schema';

export function buildContactImportCsvTemplate(): string {
  return [
    CONTACT_IMPORT_HEADERS.join(','),
    'Maya Chen,Northstar Studio,maya@example.com,+1 415 555 0198,Founder,Alessandro,proposal,42000,Met at the product demo',
  ].join('\n');
}
