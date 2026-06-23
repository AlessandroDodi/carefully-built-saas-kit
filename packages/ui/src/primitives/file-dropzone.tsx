'use client';

import { Check, FileText, Upload, X } from 'lucide-react';
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

function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeLabel(file: File): string {
  return file.type || file.name.split('.').pop()?.toUpperCase() || 'File';
}

export function FileDropzone({
  accept,
  browseLabel = 'Browse',
  browseButtonClassName,
  className,
  currentPreviewUrl = null,
  disabled = false,
  emptyIcon,
  helperText,
  footerText = 'Drag a file here or click the box to select one.',
  inputClassName,
  multiple = false,
  onFileSelect,
  onFilesSelect,
  onRemove,
  previewAlt,
  title = 'Drop a file here or browse',
}: FileDropzoneProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const hasSelectedFiles = selectedFiles.length > 0;

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

    setSelectedFiles(selectedFiles);

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
    setSelectedFiles([]);
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
            {hasSelectedFiles ? (
              <div className="bg-background/95 absolute right-2 bottom-2 left-2 rounded-md border px-3 py-2 text-left shadow-sm backdrop-blur">
                <p className="truncate text-sm font-medium">{selectedFiles[0]?.name}</p>
                {selectedFiles[0] ? (
                  <p className="text-muted-foreground text-xs">
                    {getFileTypeLabel(selectedFiles[0])} | {formatFileSize(selectedFiles[0].size)}
                  </p>
                ) : null}
              </div>
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
              size="sm"
              className={cn('mt-4 shadow-[0px_1px_1px_rgba(5,32,81,0.05)]', browseButtonClassName)}
              onClick={(event): void => {
                event.stopPropagation();
                openFilePicker();
              }}
              disabled={disabled}
            >
              {browseLabel}
            </Button>
            {hasSelectedFiles ? (
              <div className="mt-4 w-full space-y-2">
                {selectedFiles.map((file) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="bg-background flex min-w-0 items-center gap-3 rounded-md border px-3 py-2 text-left"
                  >
                    <FileText className="text-muted-foreground size-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {getFileTypeLabel(file)} | {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Check className="text-primary size-4 shrink-0" />
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
      {footerText ? (
        <p className={cn('text-muted-foreground mt-2 text-xs', inputClassName)}>{footerText}</p>
      ) : null}
    </>
  );
}
