'use client';

import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { MoreVertical, Pencil, Plus, Target, Trash2, type LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

import type { AutomationStepInput, AutomationTriggerDraft } from './automation-draft';
import { getStepOption, getTriggerOption } from './automation-options';

import { Button } from '@carefully-built/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@carefully-built/ui';

function cn(...classes: readonly (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface AutomationBuilderCanvasProps {
  readonly trigger: AutomationTriggerDraft | null;
  readonly steps: readonly AutomationStepInput[];
  readonly onChooseTrigger: () => void;
  readonly onSelectTrigger: () => void;
  readonly onAddStep: () => void;
  readonly onSelectStep: (stepId: string) => void;
  readonly onDeleteStep: (stepId: string) => void;
  readonly getEntityLabel?: (entityType: string) => string;
}

interface BuilderNodeData extends Record<string, unknown> {
  readonly kind: 'trigger' | 'step' | 'add' | 'end';
  readonly label: string;
  readonly eyebrow?: string;
  readonly description?: string;
  readonly tone?: string;
  readonly badgeTone?: string;
  readonly icon?: LucideIcon;
  readonly isIncomplete?: boolean;
  readonly onSelect?: () => void;
  readonly onDelete?: () => void;
  readonly onAddStep?: () => void;
}

type BuilderNode = Node<BuilderNodeData>;

const FIELD_LABELS: Record<string, string> = {
  activityType: 'Activity type',
  agentIds: 'Agent',
  assignedUserId: 'Agent',
  category: 'Category',
  condition: 'Property status',
  contractType: 'Contract',
  createdAt: 'Created at',
  email: 'Email',
  firstName: 'First name',
  lastName: 'Last name',
  mode: 'Request type',
  phone: 'Phone',
  propertyType: 'Property type',
  roles: 'Role',
  stageKey: 'Pipeline and stage',
  status: 'Status',
  tagIds: 'Tag',
  title: 'Title',
};

const DEFAULT_ENTITY_LABELS: Record<string, string> = {
  activity: 'Activity',
  contact: 'Contact',
  document: 'Document',
  note: 'Note',
  opportunity: 'Opportunity',
  property: 'Property',
  request: 'Request',
};

function formatEntityLabel(
  entityType: string | undefined,
  getEntityLabel?: (entityType: string) => string,
): string {
  if (!entityType) {
    return 'entita';
  }

  return getEntityLabel?.(entityType) ?? DEFAULT_ENTITY_LABELS[entityType] ?? entityType;
}

function formatAutomationValue(value: string): string {
  if (value === 'empty') {
    return 'vuoto';
  }

  if (value === 'filled') {
    return 'pieno';
  }

  return value || 'da scegliere';
}

function formatFieldTrigger(
  trigger: AutomationTriggerDraft,
  getEntityLabel?: (entityType: string) => string,
): string | undefined {
  if (trigger.type !== 'field_changed') {
    return undefined;
  }

  return `${formatEntityLabel(trigger.entityType, getEntityLabel)} · ${FIELD_LABELS[trigger.field] ?? trigger.field}: ${
    formatAutomationValue(trigger.from)
  } -> ${formatAutomationValue(trigger.to)}`;
}

function countConditions(
  groups: readonly { readonly conditions: readonly unknown[] }[],
): number {
  return groups.reduce((total, group) => total + group.conditions.length, 0);
}

function formatStepDescription(
  step: AutomationStepInput,
  getEntityLabel?: (entityType: string) => string,
): string {
  if (!step.config) {
    return 'Configura lo step';
  }

  if (step.config.type === 'delay') {
    const unitLabel = step.config.unit === 'days'
      ? step.config.amount === 1 ? 'giorno' : 'giorni'
      : step.config.unit === 'hours'
        ? step.config.amount === 1 ? 'ora' : 'ore'
        : 'minuti';
    return `Attendi ${step.config.amount} ${unitLabel}`;
  }

  if (step.config.type === 'filter') {
    const conditionsCount = countConditions(step.config.filterGroups);
    return `${formatEntityLabel(step.config.entityType, getEntityLabel)} · ${step.config.filterGroups.length} gruppi, ${conditionsCount} condizioni`;
  }

  if (step.config.type === 'path') {
    const configuredBranches = step.config.branches.filter((branch) => countConditions(branch.filterGroups) > 0);
    return `${step.config.branches.length} percorsi · ${configuredBranches.length} con condizioni`;
  }

  if (step.config.type === 'send_email' || step.config.type === 'send_whatsapp') {
    return step.config.templateId ? `Template: ${step.config.templateId}` : 'Template da scegliere';
  }

  if (step.config.type === 'add_tag') {
    return step.config.tagId ? 'Tag selezionato' : 'Tag da scegliere';
  }

  if (step.config.type === 'update_field') {
    return `${FIELD_LABELS[step.config.field] ?? (step.config.field || 'Campo da scegliere')} -> ${
      formatAutomationValue(step.config.value)
    }`;
  }

  return getStepOption(step.type).description;
}

function FlowCardNode({ data }: NodeProps<BuilderNode>): React.ReactElement {
  const Icon = data.icon;

  if (data.kind === 'add') {
    return (
      <div className="automation-flow-node nodrag nopan pointer-events-auto">
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="nodrag nopan pointer-events-auto cursor-pointer bg-card text-primary"
          onClick={(event) => {
            event.stopPropagation();
            data.onAddStep?.();
          }}
        >
          <Plus className="size-3.5" />
          Add step
        </Button>
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="automation-flow-node nodrag nopan w-[224px] rounded-lg border border-border bg-card p-2 text-left shadow-[0_1px_2px_rgba(24,39,75,0.04)] transition-colors hover:bg-muted/40"
      onClick={(event) => {
        event.stopPropagation();
        data.onSelect?.();
      }}
      disabled={!data.onSelect}
    >
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          {Icon ? (
            <span className={cn('flex size-5 shrink-0 items-center justify-center rounded-md', data.badgeTone)}>
              <Icon className="size-3" />
            </span>
          ) : (
            <Target className="size-3 shrink-0" />
          )}
          {data.eyebrow}
        </div>
        {data.kind === 'step' ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span
                role="button"
                tabIndex={0}
                className="nodrag nopan -mr-1 -mt-1 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onKeyDown={(event) => {
                  event.stopPropagation();
                }}
              >
                <MoreVertical className="size-4" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  data.onSelect?.();
                }}
              >
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  data.onDelete?.();
                }}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      {data.kind === 'end' ? null : (
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              'inline-flex rounded-md px-1.5 py-0.5 text-sm font-medium ring-1 ring-inset',
              data.tone
            )}
          >
            {data.label}
          </span>
          {data.isIncomplete ? (
            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-800">
              Da configurare
            </span>
          ) : null}
        </div>
      )}
      {data.kind === 'end' ? (
        <p className="mt-1 text-sm text-muted-foreground">{data.label}</p>
      ) : data.description ? (
        <p className="mt-2 text-[11px] leading-3 text-muted-foreground">{data.description}</p>
      ) : null}
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </button>
  );
}

const nodeTypes = {
  flowCard: FlowCardNode,
};

function buildNodes(
  trigger: AutomationTriggerDraft | null,
  steps: readonly AutomationStepInput[],
  onSelectTrigger: () => void,
  onAddStep: () => void,
  onSelectStep: (stepId: string) => void,
  onDeleteStep: (stepId: string) => void,
  getEntityLabel?: (entityType: string) => string,
): BuilderNode[] {
  if (!trigger) {
    return [];
  }

  const triggerOption = getTriggerOption(trigger.type);
  const nodes: BuilderNode[] = [
    {
      id: 'trigger',
      type: 'flowCard',
      position: { x: 0, y: 0 },
      data: {
        kind: 'trigger',
        eyebrow: 'Trigger',
        label: triggerOption.label,
        description: trigger.type === 'entity_created'
          ? formatEntityLabel(trigger.entityType, getEntityLabel)
          : formatFieldTrigger(trigger, getEntityLabel),
        tone: triggerOption.badgeTone,
        badgeTone: triggerOption.tone,
        icon: triggerOption.icon,
        onSelect: onSelectTrigger,
      },
    },
  ];

  let y = 150;
  steps.forEach((step) => {
    const stepOption = getStepOption(step.type);
    nodes.push({
      id: step.id,
      type: 'flowCard',
      position: { x: 0, y },
      data: {
        kind: 'step',
        eyebrow:
          step.type === 'delay'
            ? 'Ritardo'
            : step.type === 'filter'
              ? 'Filtro'
              : step.type === 'path'
                ? 'Percorso'
                : 'Azione',
        label: step.name || stepOption.label,
        description: formatStepDescription(step, getEntityLabel),
        tone: stepOption.badgeTone,
        badgeTone: stepOption.tone,
        icon: stepOption.icon,
        isIncomplete: !step.config || !isStepConfigured(step),
        onSelect: () => {
          onSelectStep(step.id);
        },
        onDelete: () => {
          onDeleteStep(step.id);
        },
      },
    });

    if (step.config?.type === 'path') {
      const branchStartX = -260 * (step.config.branches.length - 1) / 2;
      step.config.branches.forEach((branch, branchIndex) => {
        nodes.push({
          id: `${step.id}::${branch.id}`,
          type: 'flowCard',
          position: { x: branchStartX + branchIndex * 260, y: y + 150 },
          data: {
            kind: 'step',
            eyebrow: 'Percorso',
            label: branch.name,
            description: 'Condizioni del percorso',
            tone: stepOption.badgeTone,
            badgeTone: stepOption.tone,
            icon: stepOption.icon,
            onSelect: () => {
              onSelectStep(step.id);
            },
            onDelete: () => {
              onDeleteStep(step.id);
            },
          },
          draggable: false,
        });
      });
      y += 300;
      return;
    }

    y += 150;
  });

  nodes.push(
    {
      id: 'add-step',
      type: 'flowCard',
      position: { x: 36, y },
      data: {
        kind: 'add',
        label: 'Add step',
        onAddStep,
      },
      draggable: false,
    },
    {
      id: 'end',
      type: 'flowCard',
      position: { x: 0, y: y + 130 },
      data: {
        kind: 'end',
        eyebrow: 'Fine automazione',
        label: 'Fine automazione',
      },
      draggable: false,
    }
  );

  return nodes;
}

function isStepConfigured(step: AutomationStepInput): boolean {
  if (!step.config) {
    return false;
  }

  if (step.config.type === 'add_tag') {
    return Boolean(step.config.tagId.trim());
  }

  if (step.config.type === 'send_email' || step.config.type === 'send_whatsapp') {
    return Boolean(step.config.templateId.trim());
  }

  if (step.config.type === 'update_field') {
    return Boolean(step.config.field.trim() && step.config.value.trim());
  }

  if (step.config.type === 'delay') {
    return step.config.amount > 0;
  }

  if (step.config.type === 'filter') {
    return step.config.filterGroups.some((group) => group.conditions.length > 0);
  }

  if (step.config.type === 'path') {
    return step.config.branches.length >= 2
      && step.config.branches.every((branch) => (
        branch.filterGroups.some((group) => group.conditions.length > 0)
      ));
  }

  return false;
}

function buildEdges(nodes: readonly BuilderNode[]): Edge[] {
  const edges: Edge[] = [];

  for (let index = 0; index < nodes.length - 1; index += 1) {
    const source = nodes[index];
    const target = nodes[index + 1];

    if (!source || !target) {
      continue;
    }

    if (target.id.includes('::branch-')) {
      continue;
    }

    edges.push({
      id: `${source.id}-${target.id}`,
      source: source.id,
      target: target.id,
      type: 'smoothstep',
      style: { stroke: 'var(--border)' },
    });
  }

  nodes.forEach((node) => {
    if (node.id.includes('::branch-')) {
      const sourceId = node.id.split('::branch-')[0];
      if (sourceId) {
        edges.push({
          id: `${sourceId}-${node.id}`,
          source: sourceId,
          target: node.id,
          type: 'smoothstep',
          style: { stroke: 'var(--primary)' },
        });
      }
    }
  });

  return edges;
}

export function AutomationBuilderCanvas({
  trigger,
  steps,
  onChooseTrigger,
  onSelectTrigger,
  onAddStep,
  onSelectStep,
  onDeleteStep,
  getEntityLabel,
}: AutomationBuilderCanvasProps): React.ReactElement {
  const nodes = useMemo(
    () => buildNodes(trigger, steps, onSelectTrigger, onAddStep, onSelectStep, onDeleteStep, getEntityLabel),
    [getEntityLabel, onAddStep, onDeleteStep, onSelectStep, onSelectTrigger, steps, trigger]
  );
  const edges = useMemo(() => buildEdges(nodes), [nodes]);

  if (!trigger) {
    return (
      <div className="relative flex h-full min-h-[560px] flex-1 items-center justify-center overflow-hidden rounded-lg bg-background [background-image:radial-gradient(rgba(36,37,41,0.16)_1px,transparent_1px)] [background-size:18px_18px]">
        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Target className="size-7" />
          </div>
          <p className="text-lg font-medium text-foreground">Inizia a costruire la tua automazione</p>
          <Button type="button" className="mt-2" onClick={onChooseTrigger}>
            Scegli trigger
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[560px] flex-1 overflow-hidden rounded-lg bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ maxZoom: 1.1, padding: 0.28 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        onNodeClick={(_, node) => {
          node.data.onSelect?.();
        }}
        panOnDrag
        zoomOnScroll
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1.4} color="rgba(36,37,41,0.16)" />
      </ReactFlow>
    </div>
  );
}
