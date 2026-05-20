function normalizeSearchValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeSearchValue(value)
    .split(' ')
    .filter((token) => token.length > 0);
}

function flattenSearchPart(part: SearchTextPart, fragments: string[]): void {
  if (typeof part === 'string') {
    const normalized = part.trim();
    if (normalized.length > 0) {
      fragments.push(normalized);
    }
    return;
  }

  if (!part) {
    return;
  }

  for (const nestedPart of part) {
    flattenSearchPart(nestedPart, fragments);
  }
}

function getMaxDistance(term: string): number {
  if (term.length <= 4) {
    return 1;
  }

  if (term.length <= 8) {
    return 2;
  }

  return 3;
}

function damerauLevenshtein(left: string, right: string): number {
  const rows = left.length + 1;
  const columns = right.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(columns).fill(0));

  for (let row = 0; row < rows; row += 1) {
    const matrixRow = matrix[row];
    if (!matrixRow) {
      continue;
    }
    matrixRow[0] = row;
  }

  for (let column = 0; column < columns; column += 1) {
    const firstRow = matrix[0];
    if (!firstRow) {
      return 0;
    }
    firstRow[column] = column;
  }

  for (let row = 1; row < rows; row += 1) {
    const currentRow = matrix[row];
    const previousRow = matrix[row - 1];
    if (!currentRow || !previousRow) {
      continue;
    }

    for (let column = 1; column < columns; column += 1) {
      const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;
      const leftCost = currentRow[column - 1];
      const topCost = previousRow[column];
      const diagonalCost = previousRow[column - 1];

      if (leftCost === undefined || topCost === undefined || diagonalCost === undefined) {
        continue;
      }

      currentRow[column] = Math.min(
        topCost + 1,
        leftCost + 1,
        diagonalCost + substitutionCost,
      );

      if (
        row > 1 &&
        column > 1 &&
        left[row - 1] === right[column - 2] &&
        left[row - 2] === right[column - 1]
      ) {
        const transpositionRow = matrix[row - 2];
        const transpositionCost = transpositionRow?.[column - 2];

        if (transpositionCost !== undefined) {
          currentRow[column] = Math.min(
            currentRow[column] ?? Number.POSITIVE_INFINITY,
            transpositionCost + 1,
          );
        }
      }
    }
  }

  return matrix[left.length]?.[right.length] ?? 0;
}

function scoreTokenMatch(
  searchTerm: string,
  candidateToken: string,
  isLastTerm: boolean,
): number | null {
  if (candidateToken === searchTerm) {
    return 120;
  }

  if (isLastTerm && candidateToken.startsWith(searchTerm)) {
    return 90 - Math.max(candidateToken.length - searchTerm.length, 0);
  }

  const distance = damerauLevenshtein(searchTerm, candidateToken);
  if (distance > getMaxDistance(searchTerm)) {
    return null;
  }

  return 70 - distance * 10 - Math.abs(candidateToken.length - searchTerm.length);
}

export type SearchTextPart = string | null | undefined | readonly SearchTextPart[];

export function buildSearchText(...parts: SearchTextPart[]): string {
  const fragments: string[] = [];

  for (const part of parts) {
    flattenSearchPart(part, fragments);
  }

  return fragments.join(' ').replace(/\s+/g, ' ').trim();
}

export function scoreFuzzyMatch(query: string, candidate: string): number | null {
  const normalizedQuery = normalizeSearchValue(query);
  if (normalizedQuery.length === 0) {
    return 0;
  }

  const queryTerms = tokenize(normalizedQuery);
  const candidateTerms = tokenize(candidate);
  const normalizedCandidate = normalizeSearchValue(candidate);

  if (queryTerms.length === 0 || candidateTerms.length === 0) {
    return null;
  }

  let score = normalizedCandidate.includes(normalizedQuery) ? 40 : 0;

  for (const [index, queryTerm] of queryTerms.entries()) {
    let bestScore: number | null = null;

    for (const candidateTerm of candidateTerms) {
      const tokenScore = scoreTokenMatch(
        queryTerm,
        candidateTerm,
        index === queryTerms.length - 1,
      );

      if (tokenScore !== null && (bestScore === null || tokenScore > bestScore)) {
        bestScore = tokenScore;
      }
    }

    if (bestScore === null) {
      return null;
    }

    score += bestScore;
  }

  return score;
}

export function filterAndRankBySearch<T extends { searchText: string }>(
  items: readonly T[],
  query: string,
): T[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (normalizedQuery.length === 0) {
    return [...items];
  }

  return items
    .map((item) => ({
      item,
      score: scoreFuzzyMatch(normalizedQuery, item.searchText),
    }))
    .filter((result): result is { item: T; score: number } => result.score !== null)
    .sort((left, right) => right.score - left.score)
    .map((result) => result.item);
}

export function rankBySearch<T>(
  items: readonly T[],
  query: string,
  getSearchText: (item: T) => string,
): T[] {
  return filterAndRankBySearch(
    items.map((item) => ({
      item,
      searchText: getSearchText(item),
    })),
    query,
  ).map((result) => result.item);
}
