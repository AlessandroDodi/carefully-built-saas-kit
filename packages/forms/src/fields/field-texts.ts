import { defineKitTexts } from '@carefully-built/ui';

/**
 * Default copy of the form fields, per kit locale. Every entry is still a prop
 * on its field; these only apply when the app leaves the prop out.
 */
export const passwordFieldTexts = defineKitTexts({
  en: { showPasswordLabel: 'Show password', hidePasswordLabel: 'Hide password' },
  it: { showPasswordLabel: 'Mostra password', hidePasswordLabel: 'Nascondi password' },
});

export const booleanChipFieldTexts = defineKitTexts({
  en: { yesLabel: 'Yes', noLabel: 'No' },
  it: { yesLabel: 'Sì', noLabel: 'No' },
});

export const dateFieldTexts = defineKitTexts({
  en: { placeholder: 'Select date', clearLabel: 'Clear', displayLocale: 'en-US' },
  it: { placeholder: 'Seleziona una data', clearLabel: 'Cancella', displayLocale: 'it-IT' },
});

export const chipSelectFieldTexts = defineKitTexts({
  en: { allLabel: 'All' },
  it: { allLabel: 'Tutti' },
});

export const multiSelectDropdownFieldTexts = defineKitTexts({
  en: { placeholder: 'Select options' },
  it: { placeholder: 'Seleziona le opzioni' },
});

export const selectFieldTexts = defineKitTexts({
  en: { placeholder: 'Select...' },
  it: { placeholder: 'Seleziona…' },
});

export const phoneInputTexts = defineKitTexts({
  en: {
    label: 'Phone',
    countryLocale: 'en-US',
    countryPlaceholder: 'Country',
    countrySearchPlaceholder: 'Search country or prefix...',
    countryEmptyMessage: 'No results found',
  },
  it: {
    label: 'Telefono',
    countryLocale: 'it-IT',
    countryPlaceholder: 'Paese',
    countrySearchPlaceholder: 'Cerca paese o prefisso…',
    countryEmptyMessage: 'Nessun risultato',
  },
});

export const vatInputTexts = defineKitTexts({
  en: {
    label: 'VAT number',
    countryLocale: 'en-US',
    countryPlaceholder: 'Country',
    countrySearchPlaceholder: 'Search country...',
    countryEmptyMessage: 'No results found',
  },
  it: {
    label: 'Partita IVA',
    countryLocale: 'it-IT',
    countryPlaceholder: 'Paese',
    countrySearchPlaceholder: 'Cerca paese…',
    countryEmptyMessage: 'Nessun risultato',
  },
});
