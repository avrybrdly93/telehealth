import { describe, expect, it } from 'vitest';
import {
  BOOKING_SESSION_STORAGE_KEY,
  bookingSelectionToParams,
  mergeBookingSelection,
  parseBookingSelection,
  readStoredBookingSelection,
  writeStoredBookingSelection,
} from './booking-state';

// Implements BL-035/DECISION_LOG.md D-013: URL params + sessionStorage state persistence,
// never cookies (UX-011).
class FakeStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe('booking-state', () => {
  it('parses a valid service and provider from URL search params', () => {
    const params = new URLSearchParams('service=intake&provider=dr-md');
    expect(parseBookingSelection(params)).toEqual({ service: 'intake', provider: 'dr-md' });
  });

  it('ignores an invalid service value rather than accepting arbitrary strings', () => {
    const params = new URLSearchParams('service=not-a-real-service');
    expect(parseBookingSelection(params)).toEqual({});
  });

  it('omits unset fields when parsing', () => {
    expect(parseBookingSelection(new URLSearchParams(''))).toEqual({});
  });

  it('round-trips a selection through URL params', () => {
    const selection = { service: 'followup' as const, provider: 'np-pmhnp' };
    const params = bookingSelectionToParams(selection);
    expect(parseBookingSelection(params)).toEqual(selection);
  });

  it('serializing omits unset fields instead of writing empty strings', () => {
    const params = bookingSelectionToParams({ service: 'intake' });
    expect(params.has('provider')).toBe(false);
    expect(params.toString()).toBe('service=intake');
  });

  it('reads back exactly what was written to storage', () => {
    const storage = new FakeStorage();
    writeStoredBookingSelection(storage, { service: 'intake', provider: 'dr-md' });
    expect(readStoredBookingSelection(storage)).toEqual({ service: 'intake', provider: 'dr-md' });
    expect(storage.getItem(BOOKING_SESSION_STORAGE_KEY)).not.toBeNull();
  });

  it('returns an empty selection when nothing is stored', () => {
    expect(readStoredBookingSelection(new FakeStorage())).toEqual({});
  });

  it('never throws on malformed stored JSON, and returns an empty selection', () => {
    const storage = new FakeStorage();
    storage.setItem(BOOKING_SESSION_STORAGE_KEY, '{not json');
    expect(readStoredBookingSelection(storage)).toEqual({});
  });

  it('never throws on a well-formed but wrong-shaped stored value', () => {
    const storage = new FakeStorage();
    storage.setItem(BOOKING_SESSION_STORAGE_KEY, JSON.stringify({ service: 'bogus', provider: 5 }));
    expect(readStoredBookingSelection(storage)).toEqual({});
  });

  it('never throws when storage.getItem/setItem themselves throw (e.g. disabled storage)', () => {
    const throwingStorage: Storage = {
      length: 0,
      clear: () => {},
      key: () => null,
      removeItem: () => {},
      getItem: () => {
        throw new Error('storage disabled');
      },
      setItem: () => {
        throw new Error('storage disabled');
      },
    };
    expect(() => writeStoredBookingSelection(throwingStorage, { service: 'intake' })).not.toThrow();
    expect(readStoredBookingSelection(throwingStorage)).toEqual({});
  });

  it('merges URL params over stored values, URL winning per field', () => {
    expect(
      mergeBookingSelection({ provider: 'dr-md' }, { service: 'followup', provider: 'np-pmhnp' }),
    ).toEqual({ service: 'followup', provider: 'dr-md' });
  });

  it('merging two empty selections yields an empty selection', () => {
    expect(mergeBookingSelection({}, {})).toEqual({ service: undefined, provider: undefined });
  });
});
