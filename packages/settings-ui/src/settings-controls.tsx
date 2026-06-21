"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";

import {
  Button,
  HelpInfoButton,
  Label,
  ResponsiveSheet,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@carefully-built/ui";

interface SettingsHelpTitleProps {
  readonly children: ReactNode;
  readonly description: string;
  readonly label: string;
  readonly title: string;
  readonly tooltip: string;
}

export function SettingsHelpTitle({
  children,
  description,
  label,
  title,
  tooltip,
}: SettingsHelpTitleProps): React.ReactElement {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      <HelpInfoButton ariaLabel={tooltip} tooltip={tooltip} title={title} description={description}>
        {children}
      </HelpInfoButton>
    </span>
  );
}

export function SettingsAddButton({
  onClick,
}: {
  readonly onClick: () => void;
}): React.ReactElement {
  return (
    <Button type="button" onClick={onClick}>
      <Plus className="size-4" />
      Add
    </Button>
  );
}

export function SettingsEditDeleteActions({
  canDelete = true,
  deleteAriaLabel,
  deleteDisabledTooltip,
  onDelete,
  onEdit,
}: {
  readonly canDelete?: boolean;
  readonly deleteAriaLabel?: string;
  readonly deleteDisabledTooltip?: string;
  readonly onDelete: () => void;
  readonly onEdit: () => void;
}): React.ReactElement {
  const deleteButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onDelete}
      disabled={!canDelete}
      aria-label={deleteAriaLabel}
    >
      <Trash2 className="size-4" />
    </Button>
  );

  return (
    <div className="flex items-center justify-end gap-1">
      <Button type="button" variant="ghost" size="icon-sm" onClick={onEdit}>
        <Pencil className="size-4" />
      </Button>
      {!canDelete && deleteDisabledTooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{deleteButton}</span>
          </TooltipTrigger>
          <TooltipContent>{deleteDisabledTooltip}</TooltipContent>
        </Tooltip>
      ) : (
        deleteButton
      )}
    </div>
  );
}

export function SettingsFormSheet({
  children,
  confirmDisabled,
  confirmLabel = "Save changes",
  description,
  loading,
  onOpenChange,
  onSave,
  open,
  title,
  width,
}: {
  readonly children: ReactNode;
  readonly confirmDisabled: boolean;
  readonly confirmLabel?: string;
  readonly description?: string;
  readonly loading: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: () => void;
  readonly open: boolean;
  readonly title: string;
  readonly width?: number;
}): React.ReactElement {
  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onCancel={() => onOpenChange(false)}
      onConfirm={onSave}
      confirmLabel={confirmLabel}
      confirmDisabled={confirmDisabled}
      confirmLoading={loading}
      width={width}
    >
      {children}
    </ResponsiveSheet>
  );
}

export function SettingsSwitchRow({
  checked,
  description,
  disabled,
  id,
  label,
  onCheckedChange,
}: {
  readonly checked: boolean;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: ReactNode;
  readonly onCheckedChange: (checked: boolean) => void;
}): React.ReactElement {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{label}</Label>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

export function SettingsPipesWidgetPanel({
  authToken,
  className,
  errorText,
  hasError,
  loadingText,
  onClickCapture,
  renderWidget,
}: {
  readonly authToken?: string;
  readonly className?: string;
  readonly errorText: string;
  readonly hasError: boolean;
  readonly loadingText: string;
  readonly onClickCapture?: MouseEventHandler<HTMLDivElement>;
  readonly renderWidget: (authToken: string) => ReactNode;
}): React.ReactElement {
  const classes = ["min-h-48 rounded-lg border border-border p-3", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClickCapture={onClickCapture}>
      {hasError ? (
        <div className="flex min-h-40 items-center justify-center text-sm text-destructive">
          {errorText}
        </div>
      ) : authToken ? (
        renderWidget(authToken)
      ) : (
        <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
          {loadingText}
        </div>
      )}
    </div>
  );
}
