import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

import { listRecentGmailMessages } from './index';

export interface GmailRouteSession {
  readonly user?: {
    readonly id: string;
  } | null;
  readonly organizationId?: string;
}

export interface GmailAccessTokenResult {
  readonly accessToken: string | null;
  readonly error?: string;
}

export interface GmailRouteMessages {
  readonly unauthorized: string;
  readonly fetchMessagesFailed: string;
  readonly unknownSender?: string;
  readonly emptySubject?: string;
}

export interface GmailMessagesRouteOptions {
  readonly getSession: () => Promise<GmailRouteSession | null | undefined>;
  readonly getAccessToken: (args: {
    readonly userId: string;
    readonly organizationId?: string;
  }) => Promise<GmailAccessTokenResult>;
  readonly messages: GmailRouteMessages;
}

export function createGmailMessagesGetHandler(options: GmailMessagesRouteOptions) {
  return async function GET(request: NextRequest): Promise<NextResponse> {
    try {
      const session = await options.getSession();

      if (!session?.user) {
        return NextResponse.json({ error: options.messages.unauthorized }, { status: 401 });
      }

      const limitParam = Number(request.nextUrl.searchParams.get('limit') ?? '5');
      const maxResults = Number.isFinite(limitParam) ? limitParam : 5;
      const query = request.nextUrl.searchParams.get('q') ?? undefined;

      const { accessToken, error } = await options.getAccessToken({
        userId: session.user.id,
        organizationId: session.organizationId,
      });

      if (!accessToken) {
        return NextResponse.json({
          messages: [],
          connectionError: error ?? 'not_installed',
        });
      }

      const messages = await listRecentGmailMessages({
        accessToken,
        maxResults,
        query,
        fallbacks: {
          unknownSender: options.messages.unknownSender,
          emptySubject: options.messages.emptySubject,
        },
      });

      return NextResponse.json({ messages });
    } catch (error) {
      console.error('Failed to fetch Gmail messages:', error);
      return NextResponse.json(
        { error: options.messages.fetchMessagesFailed },
        { status: 500 },
      );
    }
  };
}
