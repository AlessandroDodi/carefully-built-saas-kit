'use client';

import { CheckCircle2, Download, FileText, Link2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { buildFileKey } from './file-utils';

import { Button, Card, CardContent, FileDropzone } from '@carefully-built/ui';

export interface PublicDocumentUploadedFile {
  readonly _id: string;
  readonly name: string;
}

export interface PublicDocumentUploadRequest {
  readonly associationLabel?: string | null;
  readonly title?: string | null;
  readonly uploadedFiles?: readonly PublicDocumentUploadedFile[];
}

export interface PublicDocumentUploadCopy {
  readonly fallbackTitle: string;
  readonly fallbackOrganizationName: string;
  readonly introSuffix: string;
  readonly loadingTitle: string;
  readonly loadingDescription: string;
  readonly invalidTitle: string;
  readonly invalidDescription: string;
  readonly uploadTitle: string;
  readonly linkedToLabel: string;
  readonly uploadHelper: string;
  readonly dropzoneTitle: string;
  readonly dropzoneHelper: string;
  readonly browseLabel: string;
  readonly selectedPreviewAlt: string;
  readonly submittingLabel: string;
  readonly submitSingleLabel: string;
  readonly submitMultipleLabel: string;
  readonly selectFileError: string;
  readonly uploadSuccessSingle: string;
  readonly uploadSuccessMultiple: string;
  readonly uploadError: string;
  readonly receivedTitle: string;
  readonly receivedSingleDescription: (count: number) => string;
  readonly receivedMultipleDescription: (count: number) => string;
  readonly availableTitle: string;
  readonly availableDescription: string;
  readonly downloadAllLabel: string;
}

interface StatusCardProps {
  readonly title: string;
  readonly description: string;
  readonly icon: React.ReactNode;
}

export interface PublicDocumentUploadShellProps<TRequest extends PublicDocumentUploadRequest> {
  readonly token: string;
  readonly request: TRequest | null | undefined;
  readonly organizationName?: string | null;
  readonly copy: PublicDocumentUploadCopy;
  readonly renderLogo: () => React.ReactNode;
  readonly renderAside?: () => React.ReactNode;
  readonly buildPublicDownloadUrl: (token: string, fileId: string) => string;
  readonly buildPublicDownloadAllUrl: (token: string) => string;
  readonly uploadFile: (file: File) => Promise<string>;
  readonly fulfillRequest: (payload: {
    readonly storageId: string;
    readonly name: string;
    readonly mimeType: string;
    readonly size: number;
  }) => Promise<unknown>;
}

function StatusCard({ title, description, icon }: StatusCardProps): React.ReactElement {
  return (
    <Card className="border-border/70 bg-background/95 overflow-hidden rounded-[28px] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
      <CardContent className="space-y-4 p-8">
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
          {icon}
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm leading-6">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PublicDocumentUploadShell<TRequest extends PublicDocumentUploadRequest>({
  token,
  request,
  organizationName = null,
  copy,
  renderLogo,
  renderAside,
  buildPublicDownloadUrl,
  buildPublicDownloadAllUrl,
  uploadFile,
  fulfillRequest,
}: PublicDocumentUploadShellProps<TRequest>): React.ReactElement {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const pageState = useMemo(() => {
    if (request === undefined) {
      return 'loading';
    }

    if (!request) {
      return 'invalid';
    }

    return 'ready';
  }, [request]);

  async function handleUpload(): Promise<void> {
    if (!request || selectedFiles.length === 0) {
      toast.error(copy.selectFileError);
      return;
    }

    setIsSubmitting(true);

    try {
      for (const file of selectedFiles) {
        const storageId = await uploadFile(file);

        await fulfillRequest({
          storageId,
          name: file.name,
          mimeType: file.type,
          size: file.size,
        });
      }

      setUploadedCount(selectedFiles.length);
      setSelectedFiles([]);
      toast.success(
        selectedFiles.length === 1 ? copy.uploadSuccessSingle : copy.uploadSuccessMultiple,
      );
    } catch (error) {
      console.error(error);
      toast.error(copy.uploadError);
    } finally {
      setIsSubmitting(false);
    }
  }

  function appendSelectedFiles(files: File[]): void {
    setSelectedFiles((currentFiles) => {
      const existingKeys = new Set(currentFiles.map(buildFileKey));
      const nextFiles = files.filter((file) => !existingKeys.has(buildFileKey(file)));
      return [...currentFiles, ...nextFiles];
    });
  }

  function removeSelectedFile(fileKey: string): void {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter((file) => buildFileKey(file) !== fileKey),
    );
  }

  const resolvedOrganizationName =
    organizationName ?? (request ? copy.fallbackOrganizationName : null);
  const uploadedFiles = request?.uploadedFiles ?? [];

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_minmax(480px,46vw)]">
        <section className="relative flex min-h-screen flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 sm:top-10 lg:top-16">
            {renderLogo()}
          </div>

          <div className="mx-auto w-full max-w-md space-y-4">
            <div className="space-y-1.5">
              <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-[2rem]">
                {request?.title ?? copy.fallbackTitle}
              </h1>
              <p className="text-muted-foreground max-w-md text-sm leading-6">
                <span className="text-foreground font-semibold">
                  {resolvedOrganizationName ?? copy.fallbackOrganizationName}
                </span>{' '}
                {copy.introSuffix}{' '}
                <span className="text-foreground font-semibold">
                  {request?.title ?? copy.fallbackTitle}
                </span>
                .
              </p>
            </div>

            {pageState === 'loading' ? (
              <StatusCard
                title={copy.loadingTitle}
                description={copy.loadingDescription}
                icon={<FileText className="size-5" />}
              />
            ) : null}

            {pageState === 'invalid' ? (
              <StatusCard
                title={copy.invalidTitle}
                description={copy.invalidDescription}
                icon={<Link2 className="size-5" />}
              />
            ) : null}

            {pageState === 'ready' && request ? (
              <>
                <Card className="border-border/70 bg-background/95 overflow-hidden rounded-[22px] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
                  <CardContent className="space-y-4 p-4">
                    <div className="space-y-1">
                      <h2 className="text-foreground text-lg font-semibold tracking-tight">
                        {copy.uploadTitle}
                      </h2>
                      <div className="text-muted-foreground space-y-1 text-xs leading-5 sm:text-sm">
                        {request.associationLabel ? (
                          <p>
                            {copy.linkedToLabel}: {request.associationLabel}
                          </p>
                        ) : null}
                        <p>{copy.uploadHelper}</p>
                      </div>
                    </div>

                    <FileDropzone
                      accept=".pdf,image/*"
                      multiple
                      title={copy.dropzoneTitle}
                      helperText={copy.dropzoneHelper}
                      browseLabel={copy.browseLabel}
                      currentPreviewUrl={null}
                      emptyIcon={<Upload className="size-6" />}
                      previewAlt={copy.selectedPreviewAlt}
                      onFileSelect={(file) => {
                        appendSelectedFiles([file]);
                      }}
                      onFilesSelect={appendSelectedFiles}
                    />

                    {selectedFiles.length > 0 ? (
                      <div className="border-border/70 bg-muted/30 space-y-2 rounded-2xl border px-3 py-2.5 text-sm">
                        {selectedFiles.map((file) => (
                          <div key={buildFileKey(file)} className="flex items-center gap-2">
                            <FileText className="text-muted-foreground size-4" />
                            <span className="text-foreground truncate font-medium">
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              className="ml-auto shrink-0"
                              onClick={() => {
                                removeSelectedFile(buildFileKey(file));
                              }}
                              disabled={isSubmitting}
                            >
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <Button
                      className="h-10 w-full rounded-xl text-sm font-medium"
                      onClick={() => {
                        void handleUpload();
                      }}
                      disabled={selectedFiles.length === 0 || isSubmitting}
                    >
                      {isSubmitting
                        ? copy.submittingLabel
                        : selectedFiles.length > 1
                          ? copy.submitMultipleLabel
                          : copy.submitSingleLabel}
                    </Button>
                  </CardContent>
                </Card>

                {uploadedCount > 0 ? (
                  <StatusCard
                    title={copy.receivedTitle}
                    description={
                      uploadedCount === 1
                        ? copy.receivedSingleDescription(uploadedCount)
                        : copy.receivedMultipleDescription(uploadedCount)
                    }
                    icon={<CheckCircle2 className="size-5" />}
                  />
                ) : null}

                {uploadedFiles.length > 0 ? (
                  <Card className="border-border/70 bg-background/95 overflow-hidden rounded-[22px] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
                    <CardContent className="space-y-3 p-4">
                      <div className="space-y-1">
                        <h2 className="text-foreground text-lg font-semibold tracking-tight">
                          {copy.availableTitle}
                        </h2>
                        <p className="text-muted-foreground text-xs leading-5 sm:text-sm">
                          {copy.availableDescription}
                        </p>
                      </div>
                      {uploadedFiles.length > 1 ? (
                        <Button asChild variant="outline" className="h-10 w-full rounded-xl">
                          <a href={buildPublicDownloadAllUrl(token)} download>
                            <Download className="size-4" />
                            {copy.downloadAllLabel}
                          </a>
                        </Button>
                      ) : null}
                      <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                          <a
                            key={file._id}
                            href={buildPublicDownloadUrl(token, file._id)}
                            download={file.name}
                            className="border-border/70 hover:bg-muted/40 flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors"
                          >
                            <span className="text-foreground min-w-0 truncate font-medium">
                              {file.name}
                            </span>
                            <Download className="text-muted-foreground size-4 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </>
            ) : null}
          </div>
        </section>

        {renderAside ? (
          <aside className="hidden min-h-screen items-center justify-center p-6 lg:flex xl:p-8">
            {renderAside()}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
