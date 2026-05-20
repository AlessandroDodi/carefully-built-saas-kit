import { toast } from 'sonner';

interface ToastActionOptions {
  readonly action?: {
    readonly label: string;
    readonly onClick: () => void;
  };
}

interface ShowDestructiveActionToastArgs {
  readonly message: string;
  readonly confirmLabel?: string;
  readonly onConfirm: () => void | Promise<void>;
  readonly showToast?: (message: string, options: ToastActionOptions) => void;
}

export function showDestructiveActionToast({
  message,
  confirmLabel = 'Conferma',
  onConfirm,
  showToast = toast.error,
}: ShowDestructiveActionToastArgs): void {
  showToast(message, {
    action: {
      label: confirmLabel,
      onClick: () => {
        void onConfirm();
      },
    },
  });
}
