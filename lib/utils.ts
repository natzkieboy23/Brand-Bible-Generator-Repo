// A simplified version of shadcn/ui's cn utility.
// In a real project, this would use `clsx` and `tailwind-merge`.
type ClassValue = string | number | boolean | undefined | null;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}
