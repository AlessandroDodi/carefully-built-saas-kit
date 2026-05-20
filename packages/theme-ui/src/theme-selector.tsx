"use client";

import { LaptopMinimal, Moon, SunMedium, type LucideIcon } from "lucide-react";

import { cn } from "@carefully-built/ui";

export const THEME_VALUES = ["light", "dark", "system"] as const;

export type ThemeMode = (typeof THEME_VALUES)[number];

export interface ThemeOption {
  readonly value: ThemeMode;
  readonly label: string;
  readonly imageSrc: string;
  readonly Icon: LucideIcon;
}

export const DEFAULT_THEME_OPTIONS: readonly ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    imageSrc: "/dashboard/settings/theme/light.svg",
    Icon: SunMedium,
  },
  {
    value: "dark",
    label: "Dark",
    imageSrc: "/dashboard/settings/theme/dark.svg",
    Icon: Moon,
  },
  {
    value: "system",
    label: "System",
    imageSrc: "/dashboard/settings/theme/system.svg",
    Icon: LaptopMinimal,
  },
] as const;

export interface ThemeSelectorProps<TTheme extends string = ThemeMode> {
  readonly value: TTheme;
  readonly options?: readonly ThemeOption[];
  readonly onChange: (value: TTheme) => void;
  readonly className?: string;
}

export function ThemeSelector<TTheme extends string = ThemeMode>({
  value,
  options = DEFAULT_THEME_OPTIONS,
  onChange,
  className,
}: ThemeSelectorProps<TTheme>): React.ReactElement {
  return (
    <div className={cn("grid gap-3 md:grid-cols-3 xl:max-w-[720px]", className)}>
      {options.map(({ value: optionValue, label, imageSrc, Icon }) => {
        const isSelected = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            onClick={(): void => onChange(optionValue as TTheme)}
            aria-pressed={isSelected}
            className={cn(
              "group rounded-[18px] border bg-card text-left shadow-sm transition-all",
              "hover:border-primary/30 hover:shadow-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-4",
              isSelected ? "border-primary ring-2 ring-primary/20" : "border-border",
            )}
          >
            <div className="p-2">
              <div className="relative overflow-hidden rounded-[14px] bg-background">
                <div className="absolute left-2 top-2 z-10 rounded-full border border-border/70 bg-background/90 p-1.5 shadow-sm backdrop-blur-sm">
                  <Icon className="size-3.5 text-foreground" />
                </div>
                <img
                  src={imageSrc}
                  alt={`${label} theme preview`}
                  width={220}
                  height={102}
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
