export const ORGANIZATION_LOGO_MAX_SIZE = 2 * 1024 * 1024;
export const ORGANIZATION_LOGO_ACCEPT = 'image/png,image/jpeg,image/jpg';
export const ORGANIZATION_LOGO_HELPER_TEXT = 'Formati: .jpeg, .png';
export const ORGANIZATION_LOGO_CAPTION = 'PNG, JPG fino a 2MB';

export function validateOrganizationLogo(file: File): string | null {
  const isSupportedType = ['image/jpeg', 'image/png'].includes(file.type);

  if (!isSupportedType) {
    return 'Carica un file PNG o JPG';
  }

  if (file.size > ORGANIZATION_LOGO_MAX_SIZE) {
    return 'Il logo deve essere inferiore a 2MB';
  }

  return null;
}

export async function createFilePreview(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = (): void => {
      resolve(reader.result as string);
    };

    reader.onerror = (): void => {
      reject(new Error('Impossibile leggere il file selezionato'));
    };

    reader.readAsDataURL(file);
  });
}

export async function uploadOrganizationLogo(args: {
  file: File;
  generateUploadUrl: () => Promise<string>;
  saveLogo: (payload: { workosId: string; storageId: string }) => Promise<unknown>;
  workosId: string;
}): Promise<void> {
  const uploadUrl = await args.generateUploadUrl();
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': args.file.type },
    body: args.file,
  });

  if (!response.ok) {
    throw new Error('Impossibile caricare il logo');
  }

  const result = (await response.json()) as { storageId: string };
  await args.saveLogo({
    workosId: args.workosId,
    storageId: result.storageId,
  });
}
