export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
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
