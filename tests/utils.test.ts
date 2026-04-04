import { describe, expect, it } from 'vitest';
import { cn, formatDate } from '@/lib/utils';

describe('utils', () => {
  it('cn merges tailwind classes correctly', () => {
    const stringClasses = cn('text-xl', 'font-bold');
    expect(stringClasses).toBe('text-xl font-bold');
    
    const conditionalClass = cn('p-4', { 'bg-red-500': true, 'bg-blue-500': false });
    expect(conditionalClass).toBe('p-4 bg-red-500');

    // tests tailwind-merge resolves conflicts
    const mergeClass = cn('p-4', 'p-8');
    expect(mergeClass).toBe('p-8');
  });

  it('formatDate formats Date appropriately', () => {
    const date = new Date('2024-04-04T12:00:00Z');
    expect(formatDate(date)).toBe('2024-04-04');
  });
});
