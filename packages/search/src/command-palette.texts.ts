import { defineKitTexts } from '@carefully-built/ui';

/**
 * Default copy of the command palette, per kit locale. Every entry is still a
 * prop; these only apply when the app leaves it out.
 */
export const commandPaletteTexts = defineKitTexts({
  en: {
    description: 'Search and open records.',
    closeLabel: 'Close search',
    loadingLabel: 'Loading...',
    noResultsLabel: 'No results found',
    navigateHintLabel: 'to navigate',
    openHintLabel: 'to open',
    closeHintLabel: 'to close',
    placeholder: 'Search...',
    title: 'Search',
    triggerLabel: 'Search',
    triggerTooltip: 'Search',
  },
  it: {
    description: 'Cerca e apri i record.',
    closeLabel: 'Chiudi la ricerca',
    loadingLabel: 'Caricamento…',
    noResultsLabel: 'Nessun risultato',
    navigateHintLabel: 'per spostarti',
    openHintLabel: 'per aprire',
    closeHintLabel: 'per chiudere',
    placeholder: 'Cerca…',
    title: 'Cerca',
    triggerLabel: 'Cerca',
    triggerTooltip: 'Cerca',
  },
});
