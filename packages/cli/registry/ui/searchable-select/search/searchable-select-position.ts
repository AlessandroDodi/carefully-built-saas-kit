export interface SearchableSelectRect {
  readonly top: number;
  readonly left: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

interface ResolveSearchableSelectDropdownPositionArgs {
  readonly triggerRect: SearchableSelectRect;
  readonly boundaryRect?: SearchableSelectRect;
  readonly portalRect?: SearchableSelectRect;
  readonly contentWidth: number;
  readonly contentHeight: number;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly offset?: number;
  readonly padding?: number;
}

interface SearchableSelectDropdownPosition {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly maxHeight: number;
  readonly direction: 'up' | 'down';
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function resolveSearchableSelectDropdownPosition({
  triggerRect,
  boundaryRect,
  portalRect,
  contentWidth,
  contentHeight,
  viewportWidth,
  viewportHeight,
  offset = 8,
  padding = 8,
}: ResolveSearchableSelectDropdownPositionArgs): SearchableSelectDropdownPosition {
  const boundaryLeftEdge = boundaryRect?.left ?? 0;
  const boundaryRightEdge = boundaryRect?.right ?? viewportWidth;
  const boundaryTopEdge = boundaryRect?.top ?? 0;
  const boundaryBottomEdge = boundaryRect?.bottom ?? viewportHeight;
  const boundaryLeft = Math.max(padding, boundaryLeftEdge + padding);
  const boundaryRight = Math.min(
    viewportWidth - padding,
    boundaryRightEdge - padding,
  );
  const boundaryTop = Math.max(padding, boundaryTopEdge + padding);
  const boundaryBottom = Math.min(
    viewportHeight - padding,
    boundaryBottomEdge - padding,
  );
  const availableWidth = Math.max(0, boundaryRight - boundaryLeft);
  const width = Math.min(contentWidth, availableWidth);
  const alignedRightLeft = triggerRect.right - width;
  const defaultLeft = triggerRect.left;
  const shouldAlignRight =
    defaultLeft + width > boundaryRight && alignedRightLeft >= boundaryLeft;
  const left = clamp(
    shouldAlignRight ? alignedRightLeft : defaultLeft,
    boundaryLeft,
    boundaryRight - width,
  );

  const spaceAbove = triggerRect.top - boundaryTop;
  const spaceBelow = boundaryBottom - triggerRect.bottom;
  const shouldOpenUp = spaceBelow < contentHeight + offset && spaceAbove > spaceBelow;
  const direction = shouldOpenUp ? 'up' : 'down';
  const maxHeight = Math.max(
    120,
    Math.floor((shouldOpenUp ? spaceAbove : spaceBelow) - offset),
  );
  const renderedHeight = Math.min(contentHeight, maxHeight);
  const viewportTop = shouldOpenUp
    ? Math.max(boundaryTop, triggerRect.top - offset - renderedHeight)
    : Math.min(boundaryBottom - renderedHeight, triggerRect.bottom + offset);

  return {
    top: viewportTop - (portalRect?.top ?? 0),
    left: left - (portalRect?.left ?? 0),
    width,
    maxHeight,
    direction,
  };
}
