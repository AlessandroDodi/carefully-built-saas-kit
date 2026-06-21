"use client";

import { CircleHelp } from "lucide-react";
import { useState, type ReactNode } from "react";

import { ResponsiveSheet } from "@/components/ui/responsive-sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface HelpInfoButtonProps {
  readonly ariaLabel: string;
  readonly tooltip: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children: ReactNode;
  readonly width?: number;
}

export function HelpInfoButton({
  ariaLabel,
  tooltip,
  title,
  description,
  children,
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
        cancelLabel="Close"
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
