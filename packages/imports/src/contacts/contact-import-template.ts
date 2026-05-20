import { CONTACT_IMPORT_HEADERS } from './contact-import-schema';

export function buildContactImportCsvTemplate(): string {
  return [
    CONTACT_IMPORT_HEADERS.join(','),
    'Mario,Rossi,mario@example.com,+39 3331234567,Acquirente,Lead caldo,1990-05-05',
  ].join('\n');
}
