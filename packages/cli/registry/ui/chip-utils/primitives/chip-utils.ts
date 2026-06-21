export const CHIP_CLASS_NAMES = {
  default: 'inline-flex w-fit max-w-full flex-none items-center gap-1 rounded-md px-1.5 py-[2px] text-xs font-medium leading-4',
  compact: 'inline-flex w-fit max-w-full flex-none items-center gap-1 rounded-[4px] px-1.5 py-px text-[10px] font-medium leading-3',
} as const;

export type ChipSize = keyof typeof CHIP_CLASS_NAMES;

export function getChipClassName(size: ChipSize = 'default'): string {
  return CHIP_CLASS_NAMES[size];
}
