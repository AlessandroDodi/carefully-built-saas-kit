import { buildSearchText, rankBySearch } from '@carefully-built/search';

export interface DocumentAssociationOption {
  readonly entityId: string;
  readonly entityType: string;
  readonly label: string;
  readonly value: string;
}

export interface DocumentListItemBase {
  readonly associationId?: string | null;
  readonly associationLabel?: string | null;
  readonly associationType?: string | null;
  readonly description?: string;
  readonly fileName?: string | null;
  readonly tagIds?: readonly unknown[];
  readonly title: string;
}

export interface DocumentAssociationSummaryItem {
  readonly label: string;
}

export interface DocumentAssociationValueItem {
  readonly value: string;
}

export interface DocumentFilterOptions {
  readonly search: string;
  readonly association: string;
  readonly tag: string;
}

export function buildDocumentAssociationValue(
  associationType?: string | null,
  associationId?: string | null,
): string | null {
  if (!associationType || !associationId) {
    return null;
  }

  return `${associationType}:${associationId}`;
}

export function buildDocumentAssociationSummary(
  document: DocumentListItemBase & { readonly associations?: readonly DocumentAssociationSummaryItem[] },
): string {
  const associations = document.associations ?? [];
  const firstAssociation = associations[0];

  if (!firstAssociation) {
    return document.associationLabel ?? 'Nessuna associazione';
  }

  const remaining = associations.length - 1;
  return remaining > 0 ? `${firstAssociation.label} +${String(remaining)}` : firstAssociation.label;
}

export function mapAssociationValuesToDocumentPayload(
  selectedValues: string[],
  options: DocumentAssociationOption[],
): {
  associationType?: DocumentAssociationOption['entityType'];
  associationId?: string;
  associationLabel?: string;
} {
  const selectedValue = selectedValues[0];
  if (!selectedValue) {
    return {};
  }

  const selectedOption = options.find((option) => option.value === selectedValue);
  if (!selectedOption) {
    return {};
  }

  return {
    associationType: selectedOption.entityType,
    associationId: selectedOption.entityId,
    associationLabel: selectedOption.label,
  };
}

export function mapAssociationValuesToDocumentAssociations(
  selectedValues: string[],
  options: DocumentAssociationOption[],
): { entityType: DocumentAssociationOption['entityType']; entityId: string }[] {
  const optionMap = new Map(options.map((option) => [option.value, option]));

  return selectedValues.flatMap((value) => {
    const option = optionMap.get(value);
    return option ? [{ entityType: option.entityType, entityId: option.entityId }] : [];
  });
}

export function filterDocuments<TDocument extends DocumentListItemBase & {
  readonly associations?: readonly (DocumentAssociationSummaryItem & DocumentAssociationValueItem)[];
}>(
  documents: TDocument[],
  options: DocumentFilterOptions,
): TDocument[] {
  const scopedDocuments = documents.filter((document) => {
    const associationValue = buildDocumentAssociationValue(
      document.associationType,
      document.associationId,
    );
    const associationValues =
      document.associations?.map((association) => association.value) ?? [];

    const matchesAssociation =
      options.association === 'all' ||
      associationValue === options.association ||
      associationValues.includes(options.association);
    const matchesTag =
      options.tag === 'all' ||
      (document.tagIds ?? []).some((tagId) => String(tagId) === options.tag);

    return matchesAssociation && matchesTag;
  });

  return rankBySearch(scopedDocuments, options.search, (document) =>
    buildSearchText(
      document.title,
      document.description,
      document.associationLabel,
      document.fileName,
      (document.associations ?? []).map((association) => association.label),
    ),
  );
}
