"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@carefully-built/ui";

const LEGEND_SCROLL_AMOUNT = 180;

export interface ChartLegendEntry {
  readonly label: string;
  readonly value?: number;
  readonly color: string;
}

export interface ChartLegendProps {
  readonly entries: readonly ChartLegendEntry[];
  readonly previousAriaLabel: string;
  readonly nextAriaLabel: string;
  readonly className?: string;
}

export function ChartLegend({
  entries,
  previousAriaLabel,
  nextAriaLabel,
  className = "mt-4",
}: ChartLegendProps): React.ReactElement | null {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) {
      setShowControls(false);
      return undefined;
    }

    function updateOverflow(): void {
      const activeContainer = scrollRef.current;
      setShowControls(Boolean(activeContainer && activeContainer.scrollWidth > activeContainer.clientWidth));
    }

    updateOverflow();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateOverflow);
      return () => window.removeEventListener("resize", updateOverflow);
    }

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(container);
    Array.from(container.children).forEach((child) => resizeObserver.observe(child));

    return () => resizeObserver.disconnect();
  }, [entries]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className={`group/legend relative ${className}`}>
      {showControls ? (
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="absolute inset-y-0 left-0 z-10 hidden items-center transition-opacity md:inline-flex md:opacity-0 md:group-hover/legend:opacity-100"
          aria-label={previousAriaLabel}
          onClick={() => {
            scrollRef.current?.scrollBy({ left: -LEGEND_SCROLL_AMOUNT, behavior: "smooth" });
          }}
        >
          <ChevronLeft className="size-3.5" />
        </Button>
      ) : null}
      <div ref={scrollRef} className="overflow-x-auto pb-1 md:[scrollbar-width:thin]">
        <div className="flex w-max min-w-full gap-1.5">
          {entries.map((entry) => (
            <div
              key={entry.label}
              className="border-border bg-background inline-flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap"
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-foreground">{entry.label}</span>
              {typeof entry.value === "number" ? (
                <span className="text-muted-foreground">{entry.value}</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      {showControls ? (
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className="absolute inset-y-0 right-0 z-10 hidden items-center transition-opacity md:inline-flex md:opacity-0 md:group-hover/legend:opacity-100"
          aria-label={nextAriaLabel}
          onClick={() => {
            scrollRef.current?.scrollBy({ left: LEGEND_SCROLL_AMOUNT, behavior: "smooth" });
          }}
        >
          <ChevronRight className="size-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
