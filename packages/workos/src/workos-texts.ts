import { defineKitTexts } from '@carefully-built/ui';

/**
 * Default copy of the organization components, one entry per kit locale.
 * Every string is still a prop or label option; these only apply when the
 * app leaves it out.
 */
export const orgSwitcherTexts = defineKitTexts({
  en: {
    organizationsTitle: 'Organizations',
    organizationFallback: 'Organization',
    selectOrganization: 'Select organization',
    noOrganization: 'No organization',
    createOrganization: 'Create organization',
    superAdmin: 'Super admin',
    signOutLabel: 'Log out',
  },
  it: {
    organizationsTitle: 'Organizzazioni',
    organizationFallback: 'Organizzazione',
    selectOrganization: 'Seleziona un’organizzazione',
    noOrganization: 'Nessuna organizzazione',
    createOrganization: 'Nuova organizzazione',
    superAdmin: 'Super admin',
    signOutLabel: 'Esci',
  },
});

export const createOrganizationTexts = defineKitTexts({
  en: {
    triggerLabel: 'Create organization',
    title: 'Create organization',
    description: 'Create a new organization to invite your team and collaborate.',
    confirmLabel: 'Create',
    logoLabel: 'Organization logo',
    nameLabel: 'Organization name',
    namePlaceholder: 'Immobiliare in Cloud',
    createError: 'Unable to create the organization',
    genericError: 'An error occurred',
  },
  it: {
    triggerLabel: 'Nuova organizzazione',
    title: 'Nuova organizzazione',
    description: 'Crea una nuova organizzazione per invitare il team e lavorare insieme.',
    confirmLabel: 'Crea',
    logoLabel: 'Logo dell’organizzazione',
    nameLabel: 'Nome dell’organizzazione',
    namePlaceholder: 'Immobiliare in Cloud',
    createError: 'Impossibile creare l’organizzazione',
    genericError: 'Si è verificato un errore',
  },
});

export const organizationLogoTexts = defineKitTexts({
  en: {
    previewAlt: 'Organization logo preview',
    helperText: 'Formats: .jpeg, .png',
    caption: 'PNG, JPG up to 2MB',
    unsupportedType: 'Upload a PNG or JPG file',
    tooLarge: 'The logo must be smaller than 2MB',
    readError: 'Unable to read the selected file',
    uploadError: 'Unable to upload the logo',
  },
  it: {
    previewAlt: 'Anteprima del logo dell’organizzazione',
    helperText: 'Formati: .jpeg, .png',
    caption: 'PNG o JPG fino a 2MB',
    unsupportedType: 'Carica un file PNG o JPG',
    tooLarge: 'Il logo deve pesare meno di 2MB',
    readError: 'Impossibile leggere il file selezionato',
    uploadError: 'Impossibile caricare il logo',
  },
});

export const organizationProfileTexts = defineKitTexts({
  en: {
    description: 'Update your organization details.',
    editButton: 'Edit',
    logoAlt: 'Organization logo',
    logoLabel: 'Organization logo',
    nameLabel: 'Organization name',
    roleFallback: 'Member',
    saveButton: 'Save changes',
    saveError: 'Unable to update the organization',
    saveSuccess: 'Organization updated',
    title: 'Edit organization',
  },
  it: {
    description: 'Aggiorna i dati dell’organizzazione.',
    editButton: 'Modifica',
    logoAlt: 'Logo dell’organizzazione',
    logoLabel: 'Logo dell’organizzazione',
    nameLabel: 'Nome dell’organizzazione',
    roleFallback: 'Membro',
    saveButton: 'Salva modifiche',
    saveError: 'Impossibile aggiornare l’organizzazione',
    saveSuccess: 'Organizzazione aggiornata',
    title: 'Modifica organizzazione',
  },
});
