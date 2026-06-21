'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  buildUserInitials,
  filterUsersBySearch,
  filterSelectableUsers,
  formatUserDisplayName,
  formatSelectedUserSummary,
  toggleUserSelection,
  type UserPickerCopy,
  type UserPickerOption,
} from '@/components/ui/user-picker-utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface BaseUserPickerProps {
  readonly options: readonly UserPickerOption[];
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly triggerClassName?: string;
  readonly copy?: UserPickerCopy;
}

interface SingleUserPickerProps extends BaseUserPickerProps {
  readonly mode: 'single';
  readonly value?: string;
  readonly onValueChange: (value: string | undefined) => void;
}

interface MultipleUserPickerProps extends BaseUserPickerProps {
  readonly mode: 'multiple';
  readonly value: readonly string[];
  readonly onValueChange: (value: string[]) => void;
}

export type UserPickerProps = SingleUserPickerProps | MultipleUserPickerProps;

function UserAvatar({ user, className, fallbackName }: {
  readonly user: UserPickerOption;
  readonly className?: string;
  readonly fallbackName?: string;
}): React.ReactElement {
  return (
    <Avatar size="sm" className={className}>
      {user.imageUrl ? <AvatarImage src={user.imageUrl} alt={formatUserDisplayName(user, fallbackName)} /> : null}
      <AvatarFallback>{buildUserInitials(user, fallbackName)}</AvatarFallback>
    </Avatar>
  );
}

function UserRow({
  user,
  fallbackName,
}: {
  readonly user: UserPickerOption;
  readonly fallbackName?: string;
}): React.ReactElement {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <UserAvatar user={user} fallbackName={fallbackName} />
      <span className="min-w-0">
        <span className="block truncate font-medium">{formatUserDisplayName(user, fallbackName)}</span>
        {user.email ? (
          <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
        ) : null}
      </span>
    </span>
  );
}

function MultipleUserValue({ selectedUsers, placeholder, copy }: {
  readonly selectedUsers: readonly UserPickerOption[];
  readonly placeholder: string;
  readonly copy: UserPickerCopy;
}): React.ReactElement {
  if (selectedUsers.length === 0) {
    return <span className="text-muted-foreground">{placeholder}</span>;
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex -space-x-2">
        {selectedUsers.slice(0, 3).map((user) => (
          <UserAvatar
            key={user.value}
            user={user}
            className="ring-2 ring-background"
            fallbackName={copy.fallbackName}
          />
        ))}
      </span>
      <span className="truncate">
        {copy.formatSelectedCount
          ? copy.formatSelectedCount(selectedUsers.length)
          : formatSelectedUserSummary(selectedUsers, copy)}
      </span>
    </span>
  );
}

export function UserPicker(props: UserPickerProps): React.ReactElement {
  const {
    options,
    copy = {},
    placeholder = props.mode === 'single'
      ? copy.singlePlaceholder ?? 'Select person'
      : copy.multiplePlaceholder ?? 'Select people',
    searchPlaceholder = copy.searchPlaceholder ?? 'Search people...',
    emptyMessage = copy.emptyMessage ?? 'No people available',
    disabled = false,
    className,
    triggerClassName,
  } = props;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const singleValue = props.mode === 'single' ? props.value : undefined;
  const multipleValue = props.mode === 'multiple' ? props.value : undefined;
  const selectedValues = useMemo(
    () => (props.mode === 'single' ? (singleValue ? [singleValue] : []) : [...(multipleValue ?? [])]),
    [multipleValue, props.mode, singleValue],
  );
  const selectedValueSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const selectableUsers = useMemo(
    () => filterSelectableUsers(options, selectedValues),
    [options, selectedValues],
  );
  const filteredUsers = useMemo(
    () => filterUsersBySearch(selectableUsers, search, copy.fallbackName),
    [copy.fallbackName, search, selectableUsers],
  );
  const selectedUsers = selectedValues
    .map((selectedValue) => options.find((option) => option.value === selectedValue))
    .filter((user): user is UserPickerOption => Boolean(user));
  const selectedUser = selectedUsers[0];

  function selectUser(userValue: string): void {
    if (props.mode === 'single') {
      props.onValueChange(userValue);
      setOpen(false);
      return;
    }

    props.onValueChange(toggleUserSelection(props.value, userValue));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn('relative', className)}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'h-9 w-full justify-between gap-2 px-2 text-left font-normal',
              selectedValues.length === 0 && 'text-muted-foreground',
              triggerClassName,
            )}
          >
            <span className="min-w-0 flex-1">
              {props.mode === 'single' ? (
                selectedUser ? <UserRow user={selectedUser} fallbackName={copy.fallbackName} /> : <span>{placeholder}</span>
              ) : (
                <MultipleUserValue selectedUsers={selectedUsers} placeholder={placeholder} copy={copy} />
              )}
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          data-searchable-select-content=""
          className="w-[var(--radix-popover-trigger-width)] min-w-72 p-2"
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder={searchPlaceholder}
              className="h-8 pl-8"
            />
          </div>
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {filteredUsers.map((user) => {
              const selected = selectedValueSet.has(user.value);

              return (
                <button
                  key={user.value}
                  type="button"
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                    selected && 'bg-muted/70',
                  )}
                  onClick={() => {
                    selectUser(user.value);
                  }}
                >
                  <UserRow user={user} fallbackName={copy.fallbackName} />
                  {selected ? <Check className="size-4 shrink-0" /> : null}
                </button>
              );
            })}
            {filteredUsers.length === 0 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">{emptyMessage}</p>
            ) : null}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
