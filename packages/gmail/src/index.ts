export interface GmailMessagePreview {
  id: string;
  threadId?: string;
  from: string;
  subject: string;
  snippet: string;
  receivedAt?: number;
}

export interface GmailPreviewFallbacks {
  readonly unknownSender?: string;
  readonly emptySubject?: string;
}

interface GmailApiMessageHeader {
  name?: string;
  value?: string;
}

interface GmailApiMessagePayload {
  headers?: GmailApiMessageHeader[];
  mimeType?: string;
  body?: {
    data?: string;
  };
  parts?: GmailApiMessagePayload[];
}

interface GmailApiMessage {
  id?: string;
  threadId?: string;
  snippet?: string;
  internalDate?: string;
  payload?: GmailApiMessagePayload;
}

interface GmailApiListResponse {
  messages?: {
    id?: string;
    threadId?: string;
  }[];
}

const GMAIL_API_BASE_URL = 'https://gmail.googleapis.com/gmail/v1/users/me';
const GMAIL_PREVIEW_HEADERS = ['From', 'Subject', 'Date'];

function readHeader(message: GmailApiMessage, name: string): string | undefined {
  const header = message.payload?.headers?.find(
    (entry) => entry.name?.toLowerCase() === name.toLowerCase(),
  );

  return header?.value?.trim() ?? undefined;
}

function parseInternalDate(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

async function gmailFetch<T>(
  accessToken: string,
  input: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(input, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gmail request failed (${String(response.status)}): ${body}`);
  }

  return await response.json() as T;
}

export function mapGmailMessageToPreview(
  message: GmailApiMessage,
  fallbacks: GmailPreviewFallbacks = {},
): GmailMessagePreview {
  return {
    id: message.id ?? '',
    threadId: message.threadId,
    from: readHeader(message, 'From') ?? fallbacks.unknownSender ?? 'Unknown sender',
    subject: readHeader(message, 'Subject') ?? fallbacks.emptySubject ?? 'No subject',
    snippet: message.snippet ?? '',
    receivedAt: parseInternalDate(message.internalDate),
  };
}

export async function listRecentGmailMessages(args: {
  accessToken: string;
  maxResults?: number;
  query?: string;
  fallbacks?: GmailPreviewFallbacks;
}): Promise<GmailMessagePreview[]> {
  const maxResults = Math.min(Math.max(args.maxResults ?? 5, 1), 10);
  const searchParams = new URLSearchParams({
    maxResults: String(maxResults),
  });

  if (args.query?.trim()) {
    searchParams.set('q', args.query.trim());
  }

  const listPayload = await gmailFetch<GmailApiListResponse>(
    args.accessToken,
    `${GMAIL_API_BASE_URL}/messages?${searchParams.toString()}`,
  );

  const messages = await Promise.all(
    (listPayload.messages ?? []).flatMap((message) => {
      if (!message.id) {
        return [];
      }

      const detailParams = new URLSearchParams({
        format: 'metadata',
      });

      for (const header of GMAIL_PREVIEW_HEADERS) {
        detailParams.append('metadataHeaders', header);
      }

      return gmailFetch<GmailApiMessage>(
        args.accessToken,
        `${GMAIL_API_BASE_URL}/messages/${encodeURIComponent(message.id)}?${detailParams.toString()}`,
      );
    }),
  );

  return messages
    .map((message) => mapGmailMessageToPreview(message, args.fallbacks))
    .filter((message) => message.id.length > 0);
}
