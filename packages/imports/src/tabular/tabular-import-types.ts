import type { TabularImportAction, TabularImportError } from '../import-types';

/** What a field's `normalize` returns: the typed value, or a message for the user. */
export type TabularNormalizeResult<TValue> =
  | { readonly value: TValue }
  | { readonly error: string };

/** One field of the host's record, as offered in the mapping step. */
export interface TabularImportField<TRecord extends object, TKey extends keyof TRecord & string> {
  readonly key: TKey;
  readonly label: string;
  readonly required?: boolean;
  /**
   * Header names matched to this field automatically. Matching ignores case,
   * accents, spaces and punctuation, so `'cellulare'` also matches "Cellulare".
   */
  readonly aliases?: readonly string[];
  /** Cleans and validates a non-empty cell. Without it the trimmed text is used. */
  readonly normalize?: (raw: string) => TabularNormalizeResult<TRecord[TKey]>;
}

/** A field definition for any key of the record, each typed against its own key. */
export type TabularImportFieldFor<TRecord extends object> = {
  [TKey in keyof TRecord & string]: TabularImportField<TRecord, TKey>;
}[keyof TRecord & string];

export interface TabularImportDefinition<TRecord extends object> {
  readonly fields: readonly TabularImportFieldFor<TRecord>[];
  /**
   * Field that identifies a record (e.g. the normalized phone): a second row
   * with the same value in the file is skipped, one matching `existing` is an
   * update (or skipped when updates are off).
   */
  readonly dedupeKey?: keyof TRecord & string;
  /** Records already stored: normalized dedupe value → id of the record. */
  readonly existing?: ReadonlyMap<string, string>;
  /** Initial value of the "update existing records" switch. Default true. */
  readonly updateExisting?: boolean;
}

/** Column index of the file → field key, or null when the column is ignored. */
export type TabularImportMapping = readonly (string | null)[];

export type TabularSkipReason = 'duplicate-in-file' | 'existing';

export interface TabularImportPreviewRow<TRecord extends object> {
  /** Line number in the file, header included, so users can find the row. */
  readonly rowNumber: number;
  readonly action: TabularImportAction;
  readonly record: TRecord | null;
  readonly errors: readonly TabularImportError[];
  readonly skipReason?: TabularSkipReason;
  readonly existingId?: string;
}

export type TabularImportSummary = Readonly<Record<TabularImportAction, number>>;

export interface TabularImportPayload<TRecord extends object> {
  readonly creates: readonly TRecord[];
  readonly updates: readonly { readonly id: string; readonly record: TRecord }[];
}

/** Raw content of the first sheet: header cells and data rows as text. */
export interface TabularFileContent {
  readonly headers: readonly string[];
  readonly rows: readonly (readonly string[])[];
}

/** Everything the import UI needs, returned by `useTabularImport`. */
export interface TabularImportState<TRecord extends object> {
  readonly fileName: string | null;
  readonly isParsing: boolean;
  readonly fileError: string | null;
  readonly headers: readonly string[];
  /** First data row, shown next to each column to help the mapping. */
  readonly sampleRow: readonly string[];
  readonly mapping: TabularImportMapping;
  readonly missingRequiredLabels: readonly string[];
  readonly rows: readonly TabularImportPreviewRow<TRecord>[];
  readonly summary: TabularImportSummary;
  readonly payload: TabularImportPayload<TRecord>;
  readonly updateExisting: boolean;
  readonly selectFile: (file: File) => Promise<void>;
  readonly setColumnField: (columnIndex: number, fieldKey: string | null) => void;
  readonly setUpdateExisting: (value: boolean) => void;
  readonly reset: () => void;
}
