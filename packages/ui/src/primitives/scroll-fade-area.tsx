'use client';

import * as React from 'react';

import type { PointerEvent } from 'react';

import { cn } from '../utils/cn';

type ScrollFadeOrientation = 'horizontal' | 'vertical';

interface ScrollFadeAreaProps extends React.ComponentProps<'div'> {
  readonly fadeSize?: number;
  readonly orientation?: ScrollFadeOrientation;
  readonly scrollbarVisibility?: 'hidden' | 'section-hover';
  readonly viewportClassName?: string;
}

interface VerticalScrollbarState {
  readonly isScrollable: boolean;
  readonly thumbHeight: number;
  readonly thumbTop: number;
}

const MIN_THUMB_SIZE = 40;
const SCROLLBAR_INSET = 6;

function getScrollFadeMask({
  canScrollEnd,
  canScrollStart,
  orientation,
}: {
  readonly canScrollEnd: boolean;
  readonly canScrollStart: boolean;
  readonly orientation: ScrollFadeOrientation;
}): string {
  const direction = orientation === 'horizontal' ? 'right' : 'bottom';

  if (canScrollStart && canScrollEnd) {
    return `linear-gradient(to ${direction}, transparent, black var(--scroll-fade-size), black calc(100% - var(--scroll-fade-size)), transparent)`;
  }

  if (canScrollStart) {
    return `linear-gradient(to ${direction}, transparent, black var(--scroll-fade-size))`;
  }

  if (canScrollEnd) {
    return `linear-gradient(to ${direction}, black calc(100% - var(--scroll-fade-size)), transparent)`;
  }

  return 'none';
}

function getScrollState(
  scrollArea: HTMLDivElement,
  orientation: ScrollFadeOrientation,
): {
  canScrollEnd: boolean;
  canScrollStart: boolean;
} {
  if (orientation === 'horizontal') {
    return {
      canScrollStart: scrollArea.scrollLeft > 1,
      canScrollEnd: scrollArea.scrollLeft + scrollArea.clientWidth < scrollArea.scrollWidth - 1,
    };
  }

  return {
    canScrollStart: scrollArea.scrollTop > 1,
    canScrollEnd: scrollArea.scrollTop + scrollArea.clientHeight < scrollArea.scrollHeight - 1,
  };
}

function getVerticalScrollbarState(scrollArea: HTMLDivElement): VerticalScrollbarState {
  const trackHeight = scrollArea.clientHeight - SCROLLBAR_INSET * 2;
  const maxScrollTop = scrollArea.scrollHeight - scrollArea.clientHeight;

  if (maxScrollTop <= 0 || trackHeight <= 0) {
    return {
      isScrollable: false,
      thumbHeight: 0,
      thumbTop: 0,
    };
  }

  const thumbHeight = Math.max(
    (scrollArea.clientHeight / scrollArea.scrollHeight) * trackHeight,
    MIN_THUMB_SIZE,
  );
  const maxThumbTop = trackHeight - thumbHeight;
  const scrollProgress = scrollArea.scrollTop / maxScrollTop;

  return {
    isScrollable: true,
    thumbHeight,
    thumbTop: maxThumbTop * scrollProgress,
  };
}

export function ScrollFadeArea({
  children,
  className,
  fadeSize = 24,
  onPointerEnter,
  onPointerLeave,
  onScroll,
  orientation = 'vertical',
  scrollbarVisibility = 'hidden',
  style,
  viewportClassName,
  ...props
}: ScrollFadeAreaProps): React.ReactElement {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const dragOffsetRef = React.useRef(0);
  const [scrollState, setScrollState] = React.useState({
    canScrollStart: false,
    canScrollEnd: false,
  });
  const [verticalScrollbarState, setVerticalScrollbarState] =
    React.useState<VerticalScrollbarState>({
      isScrollable: false,
      thumbHeight: 0,
      thumbTop: 0,
    });
  const [isSectionActive, setIsSectionActive] = React.useState(false);
  const [isDraggingScrollbar, setIsDraggingScrollbar] = React.useState(false);
  const shouldRenderSectionScrollbar =
    orientation === 'vertical' && scrollbarVisibility === 'section-hover';
  const isSectionScrollbarVisible = isSectionActive || isDraggingScrollbar;

  const updateScrollState = React.useCallback(() => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) {
      return;
    }

    const nextScrollState = getScrollState(scrollArea, orientation);

    setScrollState((currentScrollState) => {
      if (
        currentScrollState.canScrollStart === nextScrollState.canScrollStart &&
        currentScrollState.canScrollEnd === nextScrollState.canScrollEnd
      ) {
        return currentScrollState;
      }

      return nextScrollState;
    });

    if (shouldRenderSectionScrollbar) {
      setVerticalScrollbarState(getVerticalScrollbarState(scrollArea));
    }
  }, [orientation, shouldRenderSectionScrollbar]);

  const scrollToThumbPosition = React.useCallback(
    (thumbTop: number): void => {
      const scrollArea = scrollAreaRef.current;

      if (!scrollArea) {
        return;
      }

      const trackHeight = scrollArea.clientHeight - SCROLLBAR_INSET * 2;
      const maxThumbTop = trackHeight - verticalScrollbarState.thumbHeight;
      const maxScrollTop = scrollArea.scrollHeight - scrollArea.clientHeight;
      const clampedThumbTop = Math.min(Math.max(thumbTop, 0), maxThumbTop);
      const scrollProgress = maxThumbTop > 0 ? clampedThumbTop / maxThumbTop : 0;

      scrollArea.scrollTop = maxScrollTop * scrollProgress;
      updateScrollState();
    },
    [updateScrollState, verticalScrollbarState.thumbHeight],
  );

  function handleTrackPointerDown(event: PointerEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget) {
      return;
    }

    scrollToThumbPosition(event.nativeEvent.offsetY - verticalScrollbarState.thumbHeight / 2);
  }

  function handleThumbPointerDown(event: PointerEvent<HTMLDivElement>): void {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDraggingScrollbar(true);
    dragOffsetRef.current = event.clientY - SCROLLBAR_INSET - verticalScrollbarState.thumbTop;
  }

  function handleThumbPointerMove(event: PointerEvent<HTMLDivElement>): void {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    scrollToThumbPosition(event.clientY - SCROLLBAR_INSET - dragOffsetRef.current);
  }

  function handleThumbPointerUp(event: PointerEvent<HTMLDivElement>): void {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDraggingScrollbar(false);
  }

  React.useEffect(() => {
    const scrollArea = scrollAreaRef.current;

    if (!scrollArea) {
      return;
    }

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scrollArea);

    if (scrollArea.firstElementChild) {
      resizeObserver.observe(scrollArea.firstElementChild);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, updateScrollState]);

  const maskImage = getScrollFadeMask({
    canScrollEnd: scrollState.canScrollEnd,
    canScrollStart: scrollState.canScrollStart,
    orientation,
  });
  const maskStyle = {
    '--scroll-fade-size': `${String(fadeSize)}px`,
    WebkitMaskImage: maskImage,
    maskImage,
  } satisfies React.CSSProperties & Record<'--scroll-fade-size', string>;

  return (
    <div
      className={cn('group/scroll-fade relative min-h-0 min-w-0', className)}
      style={style}
      onPointerEnter={(event) => {
        setIsSectionActive(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setIsSectionActive(false);
        onPointerLeave?.(event);
      }}
      {...props}
    >
      <div
        ref={scrollAreaRef}
        className={cn(
          'min-h-0 min-w-0',
          orientation === 'horizontal' ? 'overflow-x-auto' : 'h-full overflow-y-auto',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          viewportClassName,
        )}
        style={maskStyle}
        onScroll={(event) => {
          updateScrollState();
          onScroll?.(event);
        }}
      >
        {children}
      </div>
      {shouldRenderSectionScrollbar && verticalScrollbarState.isScrollable ? (
        <div
          aria-hidden="true"
          className={cn(
            'absolute top-1.5 right-0 bottom-1.5 z-10 w-3 transition-opacity duration-150',
            isSectionScrollbarVisible
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0',
          )}
          data-section-scrollbar="true"
          onPointerDown={handleTrackPointerDown}
        >
          <div
            className="absolute right-1 w-1.5 rounded-full bg-black/15 transition-colors hover:bg-black/25"
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
            style={{
              height: `${String(verticalScrollbarState.thumbHeight)}px`,
              transform: `translateY(${String(verticalScrollbarState.thumbTop)}px)`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
