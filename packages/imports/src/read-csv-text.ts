/**
 * A CSV file's text. Excel saves «CSV (delimitato dal separatore di elenco)» in Windows-1252, not UTF-8: read as UTF-8
 * «Niccolò» became «Niccol�». UTF-8 is tried strictly first, then Windows-1252.
 */
export async function readCsvText(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder('windows-1252').decode(bytes);
  }
}
