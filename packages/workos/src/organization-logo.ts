import { resolveKitTexts, type KitLocale } from '@carefully-built/ui';

import { organizationLogoTexts } from './workos-texts';

export const ORGANIZATION_LOGO_MAX_SIZE = 2 * 1024 * 1024;
export const ORGANIZATION_LOGO_ACCEPT = 'image/png,image/jpeg,image/jpg';
export const ORGANIZATION_LOGO_HELPER_TEXT = 'Formats: .jpeg, .png';
export const ORGANIZATION_LOGO_CAPTION = 'PNG, JPG up to 2MB';

export function validateOrganizationLogo(file: File, locale: KitLocale = 'en'): string | null {
  const texts = resolveKitTexts(organizationLogoTexts, locale);
  const isSupportedType = ['image/jpeg', 'image/png'].includes(file.type);

  if (!isSupportedType) {
    return texts.unsupportedType;
  }

  if (file.size > ORGANIZATION_LOGO_MAX_SIZE) {
    return texts.tooLarge;
  }

  return null;
}

export async function createFilePreview(file: File, locale: KitLocale = 'en'): Promise<string> {
  const { readError } = resolveKitTexts(organizationLogoTexts, locale);
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = (): void => {
      resolve(reader.result as string);
    };

    reader.onerror = (): void => {
      reject(new Error(readError));
    };

    reader.readAsDataURL(file);
  });
}

export async function uploadOrganizationLogo(args: {
  file: File;
  generateUploadUrl: () => Promise<string>;
  saveLogo: (payload: { workosId: string; storageId: string }) => Promise<unknown>;
  workosId: string;
  locale?: KitLocale;
}): Promise<void> {
  const { uploadError } = resolveKitTexts(organizationLogoTexts, args.locale ?? 'en');
  const uploadUrl = await args.generateUploadUrl();
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': args.file.type },
    body: args.file,
  });

  if (!response.ok) {
    throw new Error(uploadError);
  }

  const result = (await response.json()) as { storageId: string };
  await args.saveLogo({
    workosId: args.workosId,
    storageId: result.storageId,
  });
}
