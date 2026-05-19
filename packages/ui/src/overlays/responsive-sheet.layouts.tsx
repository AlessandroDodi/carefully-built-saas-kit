'use client';

import type { ReactNode } from 'react';

import type { SheetOutsideInteractionGuard } from './responsive-sheet';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '../primitives/drawer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../primitives/sheet';
import { cn } from '../utils/cn';

interface SheetDescriptionBlockProps {
  readonly title: ReactNode;
  readonly description?: ReactNode;
}

function SheetDescriptionBlock({
  title,
  description,
}: SheetDescriptionBlockProps): React.ReactElement {
  return (
    <>
      <SheetTitle>{title}</SheetTitle>
      {description ? <SheetDescription>{description}</SheetDescription> : null}
    </>
  );
}

interface SharedSheetLayoutProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly modal: boolean;
  readonly outsideInteractionGuard?: SheetOutsideInteractionGuard;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly children: ReactNode;
  readonly footer: ReactNode;
  readonly mobileDrawerContentClassName?: string;
}

function shouldPreventOutsideInteraction(
  target: EventTarget | null,
  guard?: SheetOutsideInteractionGuard,
): boolean {
  const element =
    target instanceof Element ? target : target instanceof Node ? target.parentElement : null;

  if (!element) {
    return false;
  }

  if (element.closest('[data-searchable-select-content]')) {
    return true;
  }

  return guard?.selectors.some((selector) => element.closest(selector)) ?? false;
}

type MobileSheetLayoutProps = SharedSheetLayoutProps;

export function MobileSheetLayout({
  open,
  onOpenChange,
  modal,
  outsideInteractionGuard,
  title,
  description,
  children,
  footer,
  mobileDrawerContentClassName,
}: MobileSheetLayoutProps): React.ReactElement {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={modal}>
      <DrawerContent
        aria-describedby={description ? undefined : 'responsive-sheet-description-empty'}
        className={cn(
          'px-4 pb-[calc(env(safe-area-inset-bottom)+20px)]',
          mobileDrawerContentClassName,
        )}
        onInteractOutside={(event) => {
          if (shouldPreventOutsideInteraction(event.target, outsideInteractionGuard)) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(event) => {
          if (shouldPreventOutsideInteraction(event.target, outsideInteractionGuard)) {
            event.preventDefault();
          }
        }}
      >
        <DrawerHeader className="px-0 pb-4">
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : (
            <DrawerDescription id="responsive-sheet-description-empty" className="sr-only">
              Finestra di dialogo
            </DrawerDescription>
          )}
        </DrawerHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="-mx-1 flex-1 overflow-y-auto px-1 pb-3 [scrollbar-gutter:stable]">
            {children}
          </div>
          {footer ? <div className="shrink-0 border-t pt-4 pb-3">{footer}</div> : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface DesktopSheetLayoutProps extends SharedSheetLayoutProps {
  readonly width: number;
}

export function DesktopSheetLayout({
  open,
  onOpenChange,
  modal,
  outsideInteractionGuard,
  title,
  description,
  children,
  footer,
  width,
}: DesktopSheetLayoutProps): React.ReactElement {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={modal}>
      <SheetContent
        aria-describedby={description ? undefined : 'responsive-sheet-description-empty'}
        style={{ width: `${String(width)}px`, maxWidth: '85vw' }}
        className="flex flex-col gap-0 p-0"
        onInteractOutside={(event) => {
          if (shouldPreventOutsideInteraction(event.target, outsideInteractionGuard)) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(event) => {
          if (shouldPreventOutsideInteraction(event.target, outsideInteractionGuard)) {
            event.preventDefault();
          }
        }}
      >
        <SheetHeader className="border-b px-4 py-4">
          <SheetDescriptionBlock title={title} description={description} />
        </SheetHeader>
        {description ? null : (
          <SheetDescription id="responsive-sheet-description-empty" className="sr-only">
            Finestra di dialogo
          </SheetDescription>
        )}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-x-visible overflow-y-auto px-4 pt-4 pb-6 [scrollbar-gutter:stable]">
            {children}
          </div>
          {footer ? <div className="border-t px-4 py-4">{footer}</div> : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
