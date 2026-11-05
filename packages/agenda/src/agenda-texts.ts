import { defineKitTexts } from '@carefully-built/ui';

import type { FallbackActivityType } from './activity-types';
import type { AgendaPageMessages } from './activity-page-state';

/**
 * Default copy of the agenda package, one entry per kit locale. Components read
 * it through `useKitTexts`, so a host sets the language once with
 * `KitLocaleProvider`; explicit props still win. Pure helpers take the relevant
 * value as a parameter instead (their English default is unchanged).
 */
export const agendaTexts = defineKitTexts<{
  /** BCP-47 tag for dates and times. */
  readonly localeCode: string;
  readonly busy: string;
  readonly viewModes: { readonly list: string; readonly day: string; readonly week: string; readonly month: string };
  readonly list: {
    readonly emptyTitle: string;
    readonly emptyDescription: string;
    readonly addActivity: string;
  };
  readonly form: {
    readonly title: string;
    readonly titlePlaceholder: string;
    readonly type: string;
    readonly date: string;
    readonly start: string;
    readonly end: string;
    readonly allDay: string;
    readonly allDayDescription: string;
    readonly participants: string;
    readonly participantsPlaceholder: string;
    readonly associations: string;
    readonly associationsPlaceholder: string;
    readonly visibility: string;
    readonly visibilityPublic: string;
    readonly visibilityPrivate: string;
    readonly completed: string;
    readonly markCompleted: string;
    readonly completionDescription: string;
    readonly description: string;
    readonly descriptionPlaceholder: string;
    readonly titleRequired: string;
    readonly typeRequired: string;
    readonly participantsRequired: string;
    readonly dateRequired: string;
    readonly startRequired: string;
    readonly endRequired: string;
  };
  readonly widget: {
    readonly title: string;
    readonly emptyTitle: string;
    readonly emptyDescription: string;
    readonly noTime: string;
    readonly today: string;
    readonly previousDay: string;
    readonly nextDay: string;
  };
  readonly shiftTimeline: { readonly empty: string; readonly ariaLabel: string };
  readonly defaultActivityTypes: readonly FallbackActivityType[];
  readonly pageMessages: AgendaPageMessages;
}>({
  en: {
    localeCode: 'en-US',
    busy: 'Busy',
    viewModes: { list: 'List', day: 'Day', week: 'Week', month: 'Month' },
    list: {
      emptyTitle: 'No activities found',
      emptyDescription: 'Create the first activity or change the filters to see more results.',
      addActivity: 'Add activity',
    },
    form: {
      title: 'Activity name',
      titlePlaceholder: 'Follow up with Maya',
      type: 'Type',
      date: 'Date',
      start: 'Start',
      end: 'End',
      allDay: 'All day',
      allDayDescription: 'Block the full selected day.',
      participants: 'Participants',
      participantsPlaceholder: 'Select participants',
      associations: 'Related records',
      associationsPlaceholder: 'Attach contacts or documents',
      visibility: 'Visibility',
      visibilityPublic: 'Public',
      visibilityPrivate: 'Private',
      completed: 'Activity completed',
      markCompleted: 'Mark as completed',
      completionDescription: 'Track whether this activity is still open.',
      description: 'Description',
      descriptionPlaceholder: 'Add details...',
      titleRequired: 'Activity name is required.',
      typeRequired: 'Select an activity type.',
      participantsRequired: 'Select at least one participant.',
      dateRequired: 'Date is required.',
      startRequired: 'Start time is required.',
      endRequired: 'End time is required.',
    },
    widget: {
      title: 'Agenda',
      emptyTitle: 'No events',
      emptyDescription: 'There are no appointments for the selected day.',
      noTime: 'No time set',
      today: 'Today',
      previousDay: 'Previous day',
      nextDay: 'Next day',
    },
    shiftTimeline: { empty: 'No shifts scheduled', ariaLabel: 'Shift timeline' },
    defaultActivityTypes: [
      { label: 'Meeting', color: '#0EA5E9' },
      { label: 'Call', color: '#06B6D4' },
      { label: 'Visit', color: '#EA580C' },
      { label: 'Review', color: '#713DFF' },
    ],
    pageMessages: {
      activityTypeFilterLabel: 'Activity type',
      operatorFilterLabel: 'Operator',
      unnamedUser: 'User',
      activityTypeNotFound: 'Activity type not found.',
      activityTypeCreateFailed: 'Unable to create the selected activity type.',
      currentUserNotFound: 'Current user not found.',
      activityAdded: 'Activity added',
      activityUpdated: 'Activity updated',
      activitySaveFailed: 'An error occurred while saving the activity.',
      activityCalendarSyncFailed: 'Activity saved, but it could not be synced with Google Calendar.',
      activityMoved: 'Activity moved',
      activityMoveFailed: 'Unable to move the activity.',
      activityArchived: 'Activity archived',
      activityArchiveFailed: 'Unable to archive the activity.',
      activityCalendarDeleteFailed:
        'Activity archived in the app, but it could not be deleted from Google Calendar.',
      activityTypeAdded: 'Activity type added',
      activityTypeAddFailed: 'Unable to create the activity type.',
      activityTypeUpdated: 'Activity type updated',
      activityTypeUpdateFailed: 'Unable to update the activity type.',
      activityTypeArchived: 'Activity type archived',
      activityTypeArchiveFailed: 'Unable to archive the activity type.',
    },
  },
  it: {
    localeCode: 'it-IT',
    busy: 'Occupato',
    viewModes: { list: 'Elenco', day: 'Giorno', week: 'Settimana', month: 'Mese' },
    list: {
      emptyTitle: 'Nessuna attività',
      emptyDescription: 'Crea la prima attività o cambia i filtri per vedere altri risultati.',
      addActivity: 'Nuova attività',
    },
    form: {
      title: 'Titolo',
      titlePlaceholder: 'Sopralluogo in via Roma',
      type: 'Tipo',
      date: 'Data',
      start: 'Inizio',
      end: 'Fine',
      allDay: 'Tutto il giorno',
      allDayDescription: 'Occupa l’intera giornata selezionata.',
      participants: 'Partecipanti',
      participantsPlaceholder: 'Scegli i partecipanti',
      associations: 'Collegato a',
      associationsPlaceholder: 'Collega contatti o documenti',
      visibility: 'Visibilità',
      visibilityPublic: 'Pubblica',
      visibilityPrivate: 'Privata',
      completed: 'Attività completata',
      markCompleted: 'Segna come completata',
      completionDescription: 'Indica se l’attività è ancora aperta.',
      description: 'Descrizione',
      descriptionPlaceholder: 'Aggiungi dettagli…',
      titleRequired: 'Inserisci un titolo.',
      typeRequired: 'Scegli un tipo di attività.',
      participantsRequired: 'Scegli almeno un partecipante.',
      dateRequired: 'Inserisci la data.',
      startRequired: 'Inserisci l’ora di inizio.',
      endRequired: 'Inserisci l’ora di fine.',
    },
    widget: {
      title: 'Agenda',
      emptyTitle: 'Nessun evento',
      emptyDescription: 'Nessun appuntamento nel giorno selezionato.',
      noTime: 'Orario non indicato',
      today: 'Oggi',
      previousDay: 'Giorno precedente',
      nextDay: 'Giorno successivo',
    },
    shiftTimeline: { empty: 'Nessun turno in programma', ariaLabel: 'Turni della giornata' },
    defaultActivityTypes: [
      { label: 'Riunione', color: '#0EA5E9' },
      { label: 'Chiamata', color: '#06B6D4' },
      { label: 'Visita', color: '#EA580C' },
      { label: 'Revisione', color: '#713DFF' },
    ],
    pageMessages: {
      activityTypeFilterLabel: 'Tipo di attività',
      operatorFilterLabel: 'Operatore',
      unnamedUser: 'Utente',
      activityTypeNotFound: 'Tipo di attività non trovato.',
      activityTypeCreateFailed: 'Non è stato possibile creare il tipo di attività scelto.',
      currentUserNotFound: 'Utente corrente non trovato.',
      activityAdded: 'Attività aggiunta',
      activityUpdated: 'Attività aggiornata',
      activitySaveFailed: 'Non è stato possibile salvare l’attività.',
      activityCalendarSyncFailed:
        'Attività salvata, ma non è stato possibile sincronizzarla con Google Calendar.',
      activityMoved: 'Attività spostata',
      activityMoveFailed: 'Non è stato possibile spostare l’attività.',
      activityArchived: 'Attività archiviata',
      activityArchiveFailed: 'Non è stato possibile archiviare l’attività.',
      activityCalendarDeleteFailed:
        'Attività archiviata, ma non è stato possibile eliminarla da Google Calendar.',
      activityTypeAdded: 'Tipo di attività aggiunto',
      activityTypeAddFailed: 'Non è stato possibile creare il tipo di attività.',
      activityTypeUpdated: 'Tipo di attività aggiornato',
      activityTypeUpdateFailed: 'Non è stato possibile aggiornare il tipo di attività.',
      activityTypeArchived: 'Tipo di attività archiviato',
      activityTypeArchiveFailed: 'Non è stato possibile archiviare il tipo di attività.',
    },
  },
});
