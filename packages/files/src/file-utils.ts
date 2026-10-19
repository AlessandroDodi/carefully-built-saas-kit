/** Unit symbols are the same in every language; the number follows `locale`. */
export function formatFileSize(bytes: number, locale = 'en-US'): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  const value = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
    bytes / Math.pow(k, i),
  );
  return `${value} ${sizes[i]}`;
}

export function isPreviewable(mimeType: string): boolean {
  return mimeType.startsWith('image/') || mimeType === 'application/pdf';
}

/**
 * Stable identity for a picked `File`, used to drop duplicates when the user
 * selects the same file twice. Recuperata dal pacchetto pubblicato: era sparita
 * dal repo ma `public-document-upload-shell` la usa ancora.
 */
export function buildFileKey(file: File): string {
  return `${file.name}-${String(file.size)}-${String(file.lastModified)}`;
}
