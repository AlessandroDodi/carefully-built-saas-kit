'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  buildAgentInitials,
  filterAgentsBySearch,
  filterSelectableAgents,
  formatAgentDisplayName,
  toggleAgentSelection,
  type AgentPickerOption,
} from './agent-picker-utils';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '../utils/cn';

interface BaseAgentPickerProps {
  readonly options: readonly AgentPickerOption[];
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly triggerClassName?: string;
}

interface SingleAgentPickerProps extends BaseAgentPickerProps {
  readonly mode: 'single';
  readonly value?: string;
  readonly onValueChange: (value: string | undefined) => void;
}

interface MultipleAgentPickerProps extends BaseAgentPickerProps {
  readonly mode: 'multiple';
  readonly value: readonly string[];
  readonly onValueChange: (value: string[]) => void;
}

export type AgentPickerProps = SingleAgentPickerProps | MultipleAgentPickerProps;

function AgentAvatar({ agent, className }: {
  readonly agent: AgentPickerOption;
  readonly className?: string;
}): React.ReactElement {
  return (
    <Avatar size="sm" className={className}>
      {agent.imageUrl ? <AvatarImage src={agent.imageUrl} alt={formatAgentDisplayName(agent)} /> : null}
      <AvatarFallback>{buildAgentInitials(agent)}</AvatarFallback>
    </Avatar>
  );
}

function AgentRow({ agent }: { readonly agent: AgentPickerOption }): React.ReactElement {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <AgentAvatar agent={agent} />
      <span className="min-w-0">
        <span className="block truncate font-medium">{formatAgentDisplayName(agent)}</span>
        {agent.email ? (
          <span className="block truncate text-xs text-muted-foreground">{agent.email}</span>
        ) : null}
      </span>
    </span>
  );
}

function MultipleAgentValue({ selectedAgents, placeholder }: {
  readonly selectedAgents: readonly AgentPickerOption[];
  readonly placeholder: string;
}): React.ReactElement {
  if (selectedAgents.length === 0) {
    return <span className="text-muted-foreground">{placeholder}</span>;
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex -space-x-2">
        {selectedAgents.slice(0, 3).map((agent) => (
          <AgentAvatar key={agent.value} agent={agent} className="ring-2 ring-background" />
        ))}
      </span>
      <span className="truncate">
        {selectedAgents.length === 1
          ? '1 partecipante selezionato'
          : `${String(selectedAgents.length)} partecipanti selezionati`}
      </span>
    </span>
  );
}

export function AgentPicker(props: AgentPickerProps): React.ReactElement {
  const {
    options,
    placeholder = props.mode === 'single' ? 'Seleziona agente' : 'Seleziona agenti',
    searchPlaceholder = 'Cerca agente...',
    emptyMessage = 'Nessun agente disponibile',
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
  const selectableAgents = useMemo(
    () => filterSelectableAgents(options, selectedValues),
    [options, selectedValues],
  );
  const filteredAgents = useMemo(
    () => filterAgentsBySearch(selectableAgents, search),
    [search, selectableAgents],
  );
  const selectedAgents = selectedValues
    .map((selectedValue) => options.find((option) => option.value === selectedValue))
    .filter((agent): agent is AgentPickerOption => Boolean(agent));
  const selectedAgent = selectedAgents[0];

  function selectAgent(agentValue: string): void {
    if (props.mode === 'single') {
      props.onValueChange(agentValue);
      setOpen(false);
      return;
    }

    props.onValueChange(toggleAgentSelection(props.value, agentValue));
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
                selectedAgent ? <AgentRow agent={selectedAgent} /> : <span>{placeholder}</span>
              ) : (
                <MultipleAgentValue selectedAgents={selectedAgents} placeholder={placeholder} />
              )}
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] min-w-72 p-2">
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
            {filteredAgents.map((agent) => {
              const selected = selectedValueSet.has(agent.value);

              return (
                <button
                  key={agent.value}
                  type="button"
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                    selected && 'bg-muted/70',
                  )}
                  onClick={() => {
                    selectAgent(agent.value);
                  }}
                >
                  <AgentRow agent={agent} />
                  {selected ? <Check className="size-4 shrink-0" /> : null}
                </button>
              );
            })}
            {filteredAgents.length === 0 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">{emptyMessage}</p>
            ) : null}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}
