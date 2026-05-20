"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

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
      Aggiungi
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
  confirmLabel = "Salva modifiche",
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
