'use client';

import { internal_IntlContext as IntlContext } from '@workos-inc/widgets';
import { Fragment, useEffect, useMemo } from 'react';

import type { ReactNode } from 'react';

/** English default message → translation. Placeholders like `{email}` stay as they are. */
export type WorkOsWidgetsCatalog = Readonly<Record<string, string>>;

interface MessageDescriptor {
  readonly id: string;
  readonly defaultMessage: string;
  readonly description?: string;
}

function interpolate(message: string, values: Record<string, unknown> | undefined): string | ReactNode[] {
  if (!values) return message;
  const parts: ReactNode[] = [];
  let allStrings = true;
  let last = 0;
  for (const match of message.matchAll(/\{(\w+)\}/g)) {
    const [placeholder, key] = match;
    const index = match.index ?? 0;
    if (index > last) parts.push(message.slice(last, index));
    const value = key !== undefined && key in values ? values[key] : placeholder;
    if (typeof value !== 'string' && typeof value !== 'number') allStrings = false;
    parts.push(value as ReactNode);
    last = index + placeholder.length;
  }
  if (last < message.length) parts.push(message.slice(last));
  if (allStrings) return parts.map(String).join('');
  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>);
}

export interface WorkOsWidgetsIntlProps {
  readonly locale: string;
  /** Translations by English default message; untranslated strings fall back to English. */
  readonly catalog: WorkOsWidgetsCatalog;
  readonly children: ReactNode;
}

/**
 * Translates the WorkOS widgets (profile, security, sessions, members, Pipes)
 * through their optional intl context, without pulling in react-intl.
 */
export function WorkOsWidgetsIntl({ locale, catalog, children }: WorkOsWidgetsIntlProps): React.ReactElement {
  const value = useMemo(
    () => ({
      locale,
      formatMessage: ((descriptor: MessageDescriptor, values?: Record<string, unknown>) =>
        interpolate(catalog[descriptor.defaultMessage] ?? descriptor.defaultMessage, values)) as never,
    }),
    [locale, catalog],
  );
  useEffect(() => translateLiterals(catalog), [catalog]);
  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
}

// Widget DOM, including dropdowns and dialogs portaled outside the widget root.
const WIDGET_SCOPE = '.woswidgets-widget, .woswidgets-dropdown, .woswidgets-select-dropdown, .woswidgets-dialog, .rt-TooltipContent';

/**
 * Some widget text skips the intl context: the role filter's "All" is hardcoded
 * and role names come from the WorkOS API as configured ("Member", "Admin").
 * Text nodes that are exactly a catalog key (or a comma list of keys, as in
 * the multi-role tooltip) get swapped in place.
 */
function translateLiterals(catalog: WorkOsWidgetsCatalog): () => void {
  // Text already in the target language is left alone, so a translation that is
  // itself a key (or equal to its key, like "Password") can never be rewritten
  // again: every write fires the observer, and rewriting would loop forever.
  const translatedValues = new Set(Object.values(catalog));
  const translate = (raw: string): string | undefined => {
    const text = raw.trim();
    if (!text || translatedValues.has(text)) return undefined;
    const exact = catalog[text];
    if (exact !== undefined) return exact;
    const parts = text.split(', ');
    if (parts.length < 2 || !parts.every((part) => part in catalog)) return undefined;
    return parts.map((part) => catalog[part]).join(', ');
  };
  const visit = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const current = node.nodeValue ?? '';
      const translated = translate(current);
      if (translated === undefined || translated === current.trim() || !node.parentElement?.closest(WIDGET_SCOPE)) return;
      node.nodeValue = current.replace(current.trim(), translated);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    for (let text = walker.nextNode(); text; text = walker.nextNode()) visit(text);
  };
  visit(document.body);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') visit(mutation.target);
      else mutation.addedNodes.forEach(visit);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  return () => {
    observer.disconnect();
  };
}

/** Italian for every string of the widgets as of @workos-inc/widgets 1.20. */
export const workosWidgetsItalian: WorkOsWidgetsCatalog = {
  'An error occurred. You may need to configure CORS in the WorkOS Dashboard.': 'Si è verificato un errore. Potrebbe essere necessario configurare CORS nella dashboard WorkOS.',
  'An unexpected error occurred. Check your network connection or try refreshing the page.': 'Errore imprevisto. Controlla la connessione o ricarica la pagina.',
  'Authorization error': 'Errore di autorizzazione',
  'Check that the correct permissions have been assigned.': 'Controlla che siano stati assegnati i permessi corretti.',
  'Confirm password': 'Conferma password',
  'Confirm your password': 'Conferma la password',
  'Copied': 'Copiato',
  'Copy to clipboard': 'Copia negli appunti',
  'Enter a password': 'Inserisci una password',
  'Error fetching data': 'Errore nel caricamento dei dati',
  'Hide password': 'Nascondi password',
  'Incorrect permissions': 'Permessi insufficienti',
  'Must include a lowercase letter': 'Deve contenere una lettera minuscola',
  'Must include a number': 'Deve contenere un numero',
  'Must include a special character': 'Deve contenere un carattere speciale',
  'Must include an uppercase letter': 'Deve contenere una lettera maiuscola',
  'No results found': 'Nessun risultato',
  'Password is not strong enough': 'La password non è abbastanza robusta',
  'Password must be at least {minimumLength} characters': 'La password deve avere almeno {minimumLength} caratteri',
  'Password must be {maximumLength} characters or fewer': 'La password può avere al massimo {maximumLength} caratteri',
  'Password must not contain your email address': 'La password non può contenere la tua email',
  'Please enter a new password': 'Inserisci una nuova password',
  'Please reload the page to continue.': 'Ricarica la pagina per continuare.',
  'Search': 'Cerca',
  'Session expired': 'Sessione scaduta',
  'Set a new password for your account': 'Imposta una nuova password per il tuo account',
  'Set password': 'Imposta password',
  'Show password': 'Mostra password',
  "The passwords you entered don't match.": 'Le password inserite non coincidono.',
  'This password has appeared in data breaches and is not safe to use': 'Questa password è comparsa in violazioni di dati e non è sicura',
  'This password has been used before': 'Questa password è già stata usata',
  "To continue, we need to confirm your identity. We'll send a temporary verification code to {email}.": 'Per continuare dobbiamo confermare la tua identità. Invieremo un codice di verifica temporaneo a {email}.',
  'Verify your identity': 'Verifica la tua identità',
  'You likely forgot to provide an authorization token to the widget.': 'Probabilmente manca il token di autorizzazione del widget.',
  'Your verification token has expired': 'Il codice di verifica è scaduto',
  '(current)': '(attuale)',
  'A verification code was sent to {email}. Please enter it below.': 'Abbiamo inviato un codice di verifica a {email}. Inseriscilo qui sotto.',
  'API key': 'Chiave API',
  'Accounts your organization owns and shares with everyone.': 'Account di proprietà della tua organizzazione, condivisi con tutti.',
  'Accounts {organizationName} owns and shares with everyone.': 'Account di proprietà di {organizationName}, condivisi con tutti.',
  'Add connection': 'Aggiungi collegamento',
  'All': 'Tutti',
  // Default WorkOS role names, shown as configured in the environment.
  'Admin': 'Amministratore',
  'Member': 'Membro',
  'An error occurred while disconnecting your account. Please refresh the page and try again.': 'Errore nello scollegare l’account. Ricarica la pagina e riprova.',
  'An error occurred while renaming this connection. Please try again.': 'Errore nel rinominare il collegamento. Riprova.',
  'An error occurred. Please check the value and try again.': 'Si è verificato un errore. Controlla il valore e riprova.',
  'An invitation will be sent to this email address with a link to complete their account.': 'A questo indirizzo arriverà un invito con il link per completare l’account.',
  'Are you sure you want to disconnect your {integrationName} account?': 'Vuoi davvero scollegare il tuo account {integrationName}?',
  'Are you sure you want to remove {email}? This action is immediate and cannot be undone.': 'Vuoi davvero rimuovere {email}? L’azione è immediata e non si può annullare.',
  'Are you sure you want to resend the invite to {email}?': 'Vuoi inviare di nuovo l’invito a {email}?',
  'Are you sure you want to revoke the invite to {email}? This action is immediate and cannot be undone.': 'Vuoi davvero revocare l’invito a {email}? L’azione è immediata e non si può annullare.',
  'Assign a role': 'Assegna un ruolo',
  'Authenticator app': 'App di autenticazione',
  'Authorize access to connect your account.': 'Autorizza l’accesso per collegare il tuo account.',
  'Available': 'Disponibile',
  'Back': 'Indietro',
  "Can't scan the code?": 'Non riesci a inquadrare il codice?',
  'Cancel': 'Annulla',
  'Change': 'Cambia',
  'Change Password': 'Cambia password',
  'Change email address': 'Cambia indirizzo email',
  'Change password': 'Cambia password',
  'Change your account password': 'Cambia la password del tuo account',
  'Clear search': 'Cancella ricerca',
  'Client ID': 'Client ID',
  'Client secret': 'Client secret',
  'Close': 'Chiudi',
  'Confirm': 'Conferma',
  'Confirm new password': 'Conferma la nuova password',
  'Confirm your new password': 'Conferma la nuova password',
  'Connect': 'Collega',
  'Connect another account': 'Collega un altro account',
  'Connect your account to access these connections.': 'Collega il tuo account per usare questi collegamenti.',
  'Connect {integrationName} with API key': 'Collega {integrationName} con chiave API',
  'Connect {integrationName} with client credentials': 'Collega {integrationName} con credenziali client',
  'Connected': 'Collegato',
  'Connected accounts': 'Account collegati',
  'Connected via API key': 'Collegato con chiave API',
  'Connected via OAuth': 'Collegato con OAuth',
  'Connected via client credentials': 'Collegato con credenziali client',
  'Connection failed': 'Collegamento non riuscito',
  'Copy and close': 'Copia e chiudi',
  'Current API key': 'Chiave API attuale',
  'Current password': 'Password attuale',
  'Defaults to {value} when left blank.': 'Se vuoto, vale {value}.',
  'Disable': 'Disattiva',
  'Disable multi-factor authentication?': 'Disattivare l’autenticazione a due fattori?',
  'Disconnect': 'Scollega',
  'Disconnect account': 'Scollega account',
  'Done': 'Fatto',
  'Edit': 'Modifica',
  'Edit name': 'Modifica nome',
  'Edit role': 'Modifica ruolo',
  'Edit roles': 'Modifica ruoli',
  'Edit the details of {email}': 'Modifica i dati di {email}',
  'Email address': 'Indirizzo email',
  'Enter API key': 'Inserisci la chiave API',
  'Enter a valid value.': 'Inserisci un valore valido.',
  'Enter an email address': 'Inserisci un indirizzo email',
  'Enter client credentials': 'Inserisci le credenziali client',
  'Enter the 6-digit passcode from your authenticator app.': 'Inserisci il codice a 6 cifre dell’app di autenticazione.',
  'Enter the client secret again to save any changes.': 'Inserisci di nuovo il client secret per salvare le modifiche.',
  'Enter verification code': 'Inserisci il codice di verifica',
  'Enter your API key': 'Inserisci la tua chiave API',
  'Enter your client ID': 'Inserisci il tuo client ID',
  'Enter your client secret': 'Inserisci il tuo client secret',
  'Enter your current password': 'Inserisci la password attuale',
  'Enter your new password': 'Inserisci la nuova password',
  'Expired': 'Scaduto',
  'First name': 'Nome',
  'Full name': 'Nome completo',
  'Get verification passcode': 'Ottieni il codice di verifica',
  'Give this connection a name to tell it apart from your other {integrationName} connections.': 'Dai un nome a questo collegamento per distinguerlo dagli altri collegamenti {integrationName}.',
  'Google Drive': 'Google Drive',
  'Invite': 'Invita',
  'Invite sent': 'Invito inviato',
  'Invite user': 'Invita utente',
  'Invited': 'Invitato',
  'Last active': 'Ultima attività',
  'Last name': 'Cognome',
  'Last seen {timeAgo}': 'Ultimo accesso {timeAgo}',
  'Last used {time}': 'Ultimo uso {time}',
  'Multi-factor authentication': 'Autenticazione a due fattori',
  'Name': 'Nome',
  'Needs admin attention': 'Richiede l’attenzione di un amministratore',
  'Never': 'Mai',
  'New API key': 'Nuova chiave API',
  'New email address': 'Nuovo indirizzo email',
  'New password': 'Nuova password',
  'New users will be invited with the {roleName} role, as it is the only one available.': 'I nuovi utenti saranno invitati con il ruolo {roleName}, l’unico disponibile.',
  'Next': 'Avanti',
  'No integrations are available yet.': 'Nessuna integrazione disponibile al momento.',
  'No integrations to show.': 'Nessuna integrazione da mostrare.',
  'No organizations found': 'Nessuna organizzazione trovata',
  'No roles assigned': 'Nessun ruolo assegnato',
  'No users found': 'Nessun utente trovato',
  "No users found for query '{query}'": 'Nessun utente trovato per “{query}”',
  'Not active': 'Non attivo',
  'Not connected': 'Non collegato',
  'Not now': 'Non ora',
  'Not set': 'Non impostato',
  'Optional': 'Facoltativo',
  'Password': 'Password',
  'Password must be at least 8 characters': 'La password deve avere almeno 8 caratteri',
  'Pipe actions': 'Azioni del collegamento',
  'Please confirm your new password': 'Conferma la nuova password',
  'Please enter your current password': 'Inserisci la password attuale',
  'Please enter your new password': 'Inserisci la nuova password',
  'Previous': 'Precedente',
  'Profile picture': 'Foto profilo',
  'Reauthorize': 'Autorizza di nuovo',
  'Remove': 'Rimuovi',
  'Remove access from all devices except this one': 'Rimuovi l’accesso da tutti i dispositivi tranne questo',
  'Remove user': 'Rimuovi utente',
  'Rename': 'Rinomina',
  'Rename {integrationName} connection': 'Rinomina il collegamento {integrationName}',
  'Requires reauthorization': 'Richiede una nuova autorizzazione',
  'Resend': 'Invia di nuovo',
  'Resend invitation': 'Invia di nuovo l’invito',
  'Resend invite?': 'Inviare di nuovo l’invito?',
  'Revoke': 'Revoca',
  'Revoke invitation': 'Revoca invito',
  'Revoke invite?': 'Revocare l’invito?',
  'Revoked': 'Revocato',
  'Role': 'Ruolo',
  'Roles': 'Ruoli',
  'Rotate': 'Rigenera',
  'Rotate API key': 'Rigenera chiave API',
  'Rotate API key for {integrationName}': 'Rigenera la chiave API di {integrationName}',
  'Save': 'Salva',
  'Saved. Another {integrationName} connection already uses this name, so you may want to pick one that tells them apart.': 'Salvato. Un altro collegamento {integrationName} ha già questo nome: potresti sceglierne uno che li distingua.',
  'Scan the QR code': 'Inquadra il codice QR',
  'Scan this QR code to enroll': 'Inquadra questo codice QR per attivare',
  'Search by name or e-mail': 'Cerca per nome o email',
  'Secure your account with an extra verification step': 'Proteggi il tuo account con un passaggio di verifica in più',
  'Select a role': 'Scegli un ruolo',
  'Select an organization': 'Scegli un’organizzazione',
  'Select the role to assign to {displayName}': 'Scegli il ruolo da assegnare a {displayName}',
  'Select the roles to assign to {displayName}': 'Scegli i ruoli da assegnare a {displayName}',
  'Send verification code': 'Invia codice di verifica',
  'Set a password': 'Imposta una password',
  'Set a password to access your account': 'Imposta una password per accedere al tuo account',
  'Set up an authenticator app': 'Configura un’app di autenticazione',
  'Set up authenticator app': 'Configura app di autenticazione',
  'Shared connections': 'Collegamenti condivisi',
  "Shared credentials must be attributed to the signed-in user. The application must omit PipesAdmin's userId prop or pass the signed-in user's WorkOS user ID.": 'Le credenziali condivise devono essere attribuite all’utente connesso: l’applicazione deve omettere la prop userId di PipesAdmin o passare l’ID WorkOS dell’utente connesso.',
  "Shared credentials require an acting WorkOS user. The application must use a user-backed session or supply the acting person's WorkOS user ID through PipesAdmin's userId prop when using an application credential token.": 'Le credenziali condivise richiedono un utente WorkOS: l’applicazione deve usare una sessione utente o fornire l’ID WorkOS della persona tramite la prop userId di PipesAdmin.',
  'Sign in with OAuth': 'Accedi con OAuth',
  'Sign out': 'Esci',
  'Sign out of all other devices': 'Esci da tutti gli altri dispositivi',
  'Sign out of all other devices?': 'Uscire da tutti gli altri dispositivi?',
  'Sign out of device?': 'Uscire dal dispositivo?',
  'Something went wrong. Please try again.': 'Qualcosa è andato storto. Riprova.',
  'Status: ': 'Stato: ',
  'Status: Invite ': 'Stato: invito ',
  'The invite email has been resent to {email}': 'L’invito è stato inviato di nuovo a {email}',
  'The location': 'La posizione',
  "The new passwords you entered don't match.": 'Le nuove password non coincidono.',
  'There was an error revoking the invite. Please try again.': 'Errore nel revocare l’invito. Riprova.',
  'There was an error sending the invite. Please try again.': 'Errore nell’invio dell’invito. Riprova.',
  'This device': 'Questo dispositivo',
  'This field is required': 'Campo obbligatorio',
  'Turning off MFA will remove the additional layer of security on your account.': 'Disattivando l’autenticazione a due fattori togli il livello di sicurezza aggiuntivo dal tuo account.',
  'Unknown': 'Sconosciuto',
  'Unknown device': 'Dispositivo sconosciuto',
  'Unknown location': 'Posizione sconosciuta',
  'Update API key': 'Aggiorna chiave API',
  'Update client credentials': 'Aggiorna credenziali client',
  'Update client credentials for {integrationName}': 'Aggiorna le credenziali client di {integrationName}',
  'Update credentials': 'Aggiorna credenziali',
  'Update key': 'Aggiorna chiave',
  'Update your API key': 'Aggiorna la tua chiave API',
  'Use a different email': 'Usa un’altra email',
  'Use an authenticator app like {onep}, {google}, {authy}, or {microsoft} to scan the QR code below.': 'Usa un’app di autenticazione come {onep}, {google}, {authy} o {microsoft} per inquadrare il codice QR qui sotto.',
  'User': 'Utente',
  'User actions': 'Azioni utente',
  'User search': 'Cerca utenti',
  'View setup key': 'Mostra chiave di configurazione',
  "We couldn't start the connection. Please try again.": 'Non siamo riusciti ad avviare il collegamento. Riprova.',
  'We will not ask for additional verification during sign-in.': 'Non chiederemo verifiche aggiuntive all’accesso.',
  'We will only ask for your password during sign-in.': 'All’accesso chiederemo solo la password.',
  "We'll send a verification code to your new email address to confirm the change. Your current email is {email}.": 'Invieremo un codice di verifica al nuovo indirizzo per confermare la modifica. L’email attuale è {email}.',
  'WorkOS never sees your credentials.': 'WorkOS non vede mai le tue credenziali.',
  'You': 'Tu',
  'You cannot reuse your current password': 'Non puoi riusare la password attuale',
  'You cannot update the role for this user as there is only one role available.': 'Non puoi cambiare il ruolo di questo utente: c’è un solo ruolo disponibile.',
  'You will be logged out of all other active sessions on other devices, except this one.': 'Uscirai da tutte le altre sessioni attive sugli altri dispositivi, tranne questo.',
  'You will be signed out of {device}.': 'Uscirai da {device}.',
  "You'll be redirected to sign in with {integrationName}.": 'Verrai reindirizzato per accedere con {integrationName}.',
  'Your connections': 'I tuoi collegamenti',
  'Your credentials remain secure.': 'Le tue credenziali restano al sicuro.',
  "Your email has been successfully updated to {email}. You can also set a password now if you'd like to be able to sign in with email and password.": 'La tua email è stata aggiornata a {email}. Puoi anche impostare una password se vuoi accedere con email e password.',
  'Your first name': 'Il tuo nome',
  'Your last name': 'Il tuo cognome',
  'Your setup key': 'La tua chiave di configurazione',
  'e.g. Marketing': 'es. Marketing',
  'name@example.com': 'nome@esempio.it',
  '{appName} uses WorkOS to connect to {integrationName}.': '{appName} usa WorkOS per collegarsi a {integrationName}.',
  '{count} connections': '{count} collegamenti',
  '{count} roles': '{count} ruoli',
};
