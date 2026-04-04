import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value updates', () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    // Update value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should still be initial before timer runs
    expect(result.current).toBe('initial');
    
    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });
    
    // Value should update now
    expect(result.current).toBe('updated');
    
    vi.useRealTimers();
  });
});
