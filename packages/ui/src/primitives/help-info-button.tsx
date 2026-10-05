"use client";

import { CircleHelp } from "lucide-react";
import { useState, type ReactNode } from "react";

import { ResponsiveSheet } from "../overlays/responsive-sheet";
import { resolveOverlayCloseLabel } from "../overlays/responsive-sheet.labels";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface HelpInfoButtonProps {
  readonly ariaLabel: string;
  readonly tooltip: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children: ReactNode;
  readonly closeLabel?: ReactNode;
  readonly width?: number;
}

export function HelpInfoButton({
  ariaLabel,
  tooltip,
  title,
  description,
  children,
  closeLabel,
  width = 620,
}: HelpInfoButtonProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
            aria-label={ariaLabel}
            onClick={() => {
              setOpen(true);
            }}
          >
            <CircleHelp className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      <ResponsiveSheet
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        cancelLabel={resolveOverlayCloseLabel(closeLabel)}
        onCancel={() => {
          setOpen(false);
        }}
        width={width}
      >
        {children}
      </ResponsiveSheet>
    </>
  );
}
