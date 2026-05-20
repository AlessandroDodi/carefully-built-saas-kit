"use client";

import { cn } from "@carefully-built/ui";

export const SHAPE_PREVIEW_VALUES = ["squared", "semi-rounded", "rounded"] as const;

export type ShapePreviewValue = (typeof SHAPE_PREVIEW_VALUES)[number];

export const SHAPE_PREVIEW_SOURCES: Record<ShapePreviewValue, string> = {
  squared: "/dashboard/settings/shape/squared.svg",
  "semi-rounded": "/dashboard/settings/shape/semi-rounded.svg",
  rounded: "/dashboard/settings/shape/rounded.svg",
};

export interface ShapePreviewIconProps<TShape extends ShapePreviewValue = ShapePreviewValue> {
  readonly shape: TShape;
  readonly className?: string;
}

export function ShapePreviewIcon<TShape extends ShapePreviewValue = ShapePreviewValue>({
  shape,
  className,
}: ShapePreviewIconProps<TShape>): React.ReactElement {
  return (
    <img
      src={SHAPE_PREVIEW_SOURCES[shape]}
      alt=""
      aria-hidden="true"
      className={cn("block shrink-0", className)}
    />
  );
}
