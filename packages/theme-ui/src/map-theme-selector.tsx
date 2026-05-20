"use client";

import { Map } from "lucide-react";

import { cn } from "@carefully-built/ui";

import { MAP_THEME_OPTIONS, type MapTheme, type MapThemeOption } from "./map-theme";

export interface MapThemeSelectorProps {
  readonly value: MapTheme;
  readonly options?: readonly MapThemeOption[];
  readonly disabled?: boolean;
  readonly isSaving?: boolean;
  readonly className?: string;
  readonly onChange: (value: MapTheme) => void;
}

export function MapThemeSelector({
  value,
  options = MAP_THEME_OPTIONS,
  disabled = false,
  isSaving = false,
  className,
  onChange,
}: MapThemeSelectorProps): React.ReactElement {
  return (
    <div className={cn("grid gap-3 md:grid-cols-3 xl:max-w-[720px]", className)}>
      {options.map(({ value: optionValue, label, imageSrc }) => {
        const isSelected = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            onClick={(): void => onChange(optionValue)}
            aria-pressed={isSelected}
            disabled={disabled || isSaving}
            className={cn(
              "group rounded-[18px] border bg-card text-left shadow-sm transition-all",
              "hover:border-primary/30 hover:shadow-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-4",
              "disabled:cursor-not-allowed disabled:opacity-60",
              isSelected ? "border-primary ring-2 ring-primary/20" : "border-border",
            )}
          >
            <div className="p-2">
              <div className="relative overflow-hidden rounded-[14px] bg-background">
                <div className="absolute left-2 top-2 z-10 rounded-full border border-border/70 bg-background/90 p-1.5 shadow-sm backdrop-blur-sm">
                  <Map className="size-3.5 text-foreground" />
                </div>
                <img
                  src={imageSrc}
                  alt={`Anteprima tema mappa ${label}`}
                  width={220}
                  height={132}
                  className="h-auto w-full"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 px-3 pb-3 text-sm font-medium text-foreground">
              <span>{label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
