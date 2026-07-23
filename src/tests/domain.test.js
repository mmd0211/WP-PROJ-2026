import { describe, expect, it } from 'vitest';
import { filterCatalog, formatMoney, nextRepeatMode, safeUsername, sortCatalog, toggleId } from '../utils/domain';

const items = [
  { id: '1', title: 'Older Popular', releaseDate: '2025-01-01', listenerCount: 100, artistIds: ['a'] },
  { id: '2', title: 'New Quiet', releaseDate: '2026-01-01', listenerCount: 20, artistIds: ['b'] },
];

describe('catalog domain helpers', () => {
  it('sorts catalog by listeners', () => {
    expect(sortCatalog(items, 'listeners').map((x) => x.id)).toEqual(['1', '2']);
  });

  it('sorts catalog by release date', () => {
    expect(sortCatalog(items, 'date').map((x) => x.id)).toEqual(['2', '1']);
  });

  it('searches by title or artist name', () => {
    const artistNameFor = (id) => id === 'a' ? 'Nima Azar' : 'Roya Mehr';
    expect(filterCatalog(items, 'nima', artistNameFor).map((x) => x.id)).toEqual(['1']);
    expect(filterCatalog(items, 'quiet', artistNameFor).map((x) => x.id)).toEqual(['2']);
  });

  it('cycles repeat mode off -> all -> one -> off', () => {
    expect(nextRepeatMode('off')).toBe('all');
    expect(nextRepeatMode('all')).toBe('one');
    expect(nextRepeatMode('one')).toBe('off');
  });

  it('toggles ids without duplicates', () => {
    expect(toggleId(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleId(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('creates a usable username from a display name', () => {
    expect(safeUsername('علی رضایی')).toMatch(/^علی_رضایی_\d{3}$/u);
  });

  it('formats monetary values for Persian locale', () => {
    expect(formatMoney(149000)).toContain('۱۴۹');
  });
});
