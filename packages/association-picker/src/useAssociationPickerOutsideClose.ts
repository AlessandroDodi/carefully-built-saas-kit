import { useEffect, type RefObject } from 'react';

export function useAssociationPickerOutsideClose(
  containerRef: RefObject<HTMLDivElement | null>,
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
): void {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDownCapture(event: PointerEvent): void {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
      event.stopPropagation();
    }

    document.addEventListener('pointerdown', handlePointerDownCapture, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDownCapture, true);
    };
  }, [containerRef, isOpen, setIsOpen]);
}
