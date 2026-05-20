'use client';

import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from './button';
import { cn } from '../utils/cn';

interface FileDropzoneProps {
  readonly accept?: string;
  readonly browseLabel?: string;
  readonly browseButtonClassName?: string;
  readonly className?: string;
  readonly currentPreviewUrl?: string | null;
  readonly disabled?: boolean;
  readonly emptyIcon?: React.ReactNode;
  readonly helperText?: string;
  readonly footerText?: string | null;
  readonly inputClassName?: string;
  readonly multiple?: boolean;
  readonly onFileSelect: (file: File) => void;
  readonly onFilesSelect?: (files: File[]) => void;
  readonly onRemove?: () => void;
  readonly previewAlt: string;
  readonly title?: string;
}

export function FileDropzone({
  accept,
  browseLabel = 'Esplora',
  browseButtonClassName,
  className,
  currentPreviewUrl = null,
  disabled = false,
  emptyIcon,
  helperText,
  footerText = 'Trascina un file oppure clicca sul riquadro per selezionarlo.',
  inputClassName,
  multiple = false,
  onFileSelect,
  onFilesSelect,
  onRemove,
  previewAlt,
  title = 'Lascia qui o esplora file',
}: FileDropzoneProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFilePicker = (): void => {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  };

  const handleFileSelection = (files: FileList | File[] | null | undefined): void => {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.length === 0 || disabled) {
      return;
    }

    if (multiple && onFilesSelect) {
      onFilesSelect(selectedFiles);
      return;
    }

    const firstFile = selectedFiles[0];
    if (firstFile) {
      onFileSelect(firstFile);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    handleFileSelection(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleFileSelection(event.dataTransfer.files);
  };

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onRemove?.();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={openFilePicker}
        onKeyDown={(event): void => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openFilePicker();
          }
        }}
        onDragEnter={(event): void => {
          event.preventDefault();
          event.stopPropagation();
          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragOver={(event): void => {
          event.preventDefault();
          event.stopPropagation();
          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={(event): void => {
          event.preventDefault();
          event.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={cn(
          'bg-muted/30 relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-6 py-5 text-center transition-colors outline-none',
          'border-primary/60 hover:bg-muted/50 focus-visible:ring-primary/20 focus-visible:ring-2',
          isDragging && 'bg-muted/60',
          disabled && 'cursor-not-allowed opacity-60',
          className,
        )}
      >
        {currentPreviewUrl ? (
          <div className="bg-background relative flex min-h-40 w-full items-center justify-center overflow-hidden rounded-md">
            <img src={currentPreviewUrl} alt={previewAlt} className="size-full object-contain" />
            {onRemove ? (
              <Button
                type="button"
                variant="destructive"
                size="icon-xs"
                className="absolute top-2 right-2 z-10"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="size-3.5" />
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="text-primary mb-2 flex items-center justify-center">
              {emptyIcon ?? <Upload className="size-5" />}
            </div>
            <div className="space-y-0.5">
              <p className="text-foreground text-base font-medium">{title}</p>
              {helperText ? <p className="text-muted-foreground text-sm">{helperText}</p> : null}
            </div>
            <Button
              type="button"
              variant="outline"
              className={cn(
                'bg-background mt-4 border-[var(--main,#713dff)] text-[color:var(--main-dark,#250089)] shadow-[0px_1px_1px_rgba(5,32,81,0.05)]',
                browseButtonClassName,
              )}
              onClick={(event): void => {
                event.stopPropagation();
                openFilePicker();
              }}
              disabled={disabled}
            >
              {browseLabel}
            </Button>
          </>
        )}
      </div>
      {footerText ? (
        <p className={cn('text-muted-foreground mt-2 text-xs', inputClassName)}>{footerText}</p>
      ) : null}
    </>
  );
}
