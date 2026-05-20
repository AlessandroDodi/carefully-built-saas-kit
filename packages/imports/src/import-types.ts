export type TabularImportAction = 'create' | 'update' | 'skip' | 'reject';

export interface TabularImportError {
  readonly field?: string;
  readonly message: string;
}

export interface ParsedTabularImportRow<TRaw, TNormalized> {
  readonly rowNumber: number;
  readonly raw: TRaw;
  readonly normalized: TNormalized | null;
  readonly errors: readonly TabularImportError[];
  readonly matchedContactId?: string;
}

export interface ImportPreviewRow<TNormalized> {
  readonly rowNumber: number;
  readonly normalized: TNormalized | null;
  readonly action: TabularImportAction;
  readonly reason?: string;
  readonly matchedContactId?: string;
}
