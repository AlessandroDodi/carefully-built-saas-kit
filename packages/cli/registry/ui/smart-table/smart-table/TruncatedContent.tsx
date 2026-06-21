'use client';

import {
  getTruncatedContentAlignmentClass,
  shouldRenderTooltipTrigger,
} from '@/components/ui/smart-table/truncated-content.utils';

import { useEffect, useRef, useState } from 'react';

import type { ReactNode } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TruncatedContentProps {
  children: ReactNode;
  tooltip?: string | null;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

export function TruncatedContent({
  children,
  tooltip,
  align = 'left',
  className = '',
}: TruncatedContentProps): React.ReactElement {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const updateOverflowState = (): boolean => {
    const element = contentRef.current;
    if (!element) {
      setIsOverflowing(false);
      return false;
    }

    const overflowing = element.scrollWidth > element.clientWidth + 1;
    setIsOverflowing(overflowing);
    return overflowing;
  };

  useEffect(() => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    updateOverflowState();

    const resizeObserver = new ResizeObserver(() => {
      updateOverflowState();
    });

    resizeObserver.observe(element);
    window.addEventListener('resize', updateOverflowState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOverflowState);
    };
  }, [children, className, align, tooltip]);

  useEffect(() => {
    if (!isOverflowing && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, isOverflowing]);

  const alignmentClass = getTruncatedContentAlignmentClass(align);
  const showTooltipTrigger = shouldRenderTooltipTrigger({
    tooltip,
    isOverflowing,
  });

  const content = (
    <div
      ref={contentRef}
      className={[
        'block min-w-0 w-full truncate',
        alignmentClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );

  if (!showTooltipTrigger) {
    return content;
  }

  return (
    <Tooltip
      delayDuration={100}
      open={isOverflowing ? isOpen : false}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setIsOpen(false);
          return;
        }

        setIsOpen(updateOverflowState());
      }}
    >
      <TooltipTrigger asChild>
        <button
          type="button"
          className={[
            'block min-w-0 w-full overflow-hidden bg-transparent p-0 text-inherit outline-none',
            alignmentClass,
            isOverflowing ? 'cursor-help' : 'cursor-default',
          ]
            .filter(Boolean)
            .join(' ')}
          onMouseEnter={() => {
            updateOverflowState();
          }}
          onFocus={() => {
            updateOverflowState();
          }}
          onClick={(event) => {
            event.stopPropagation();
            const overflowing = updateOverflowState();
            if (overflowing) {
              setIsOpen((previous) => !previous);
            }
          }}
        >
          {content}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align={align === 'right' ? 'end' : align === 'center' ? 'center' : 'start'}
        sideOffset={6}
        collisionPadding={12}
        avoidCollisions
        className="w-[min(20rem,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] whitespace-normal break-words text-left"
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
