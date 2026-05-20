# Kanban

Planned package: `@carefully-built/kanban`.

Reusable kanban board for common SaaS workflows: pipelines, tasks, deals, tickets, projects, approvals, and CRM stages.

## Components To Build

- `KanbanBoard`: full board with drag-and-drop movement.
- `KanbanColumn`: header, count, empty state, column action slot.
- `KanbanCard`: title, description, chips, metadata, avatar/icon/image slot.
- `KanbanCardDialog` or responsive sheet/detail popup.
- `useKanbanMove`: optional optimistic move helper.

## Target Props

```tsx
<KanbanBoard
  columns={columns}
  items={opportunities}
  getItemId={(item) => item.id}
  getColumnId={(item) => item.stageId}
  onMove={({ itemId, fromColumnId, toColumnId, index }) =>
    moveOpportunity({ itemId, fromColumnId, toColumnId, index })
  }
  renderCard={(item) => (
    <KanbanCard
      title={item.title}
      description={item.contactName}
      chips={[{ label: item.type }, { label: item.budget }]}
    />
  )}
  renderCardDetail={(item) => <OpportunityDetail item={item} />}
/>;
```

## Package Owns

- Board/column/card layout.
- Drag-and-drop interactions.
- Loading skeletons.
- Empty column states.
- Card detail popup/sheet behavior.
- Accessible move behavior where possible.

## App Owns

- Domain data.
- Move mutation.
- Permission checks.
- Validation when a move is not allowed.
- Custom card fields.

## Rules

- A new app needing a kanban should not rebuild board layout, card visuals, drag movement, or popups.
- Custom cards must still keep built-in drag and detail behavior.
