import { beforeEach, describe, expect, it } from 'vitest';
import { clearPersistedState, loadPersistedState, savePersistedState } from '../services/storage';

describe('local storage persistence', () => {
  beforeEach(() => clearPersistedState());

  it('saves and reloads mock frontend state', () => {
    expect(savePersistedState({ currentUserId: 'u1', playlists: [] })).toBe(true);
    expect(loadPersistedState()).toEqual({ currentUserId: 'u1', playlists: [] });
  });

  it('clears the persisted state', () => {
    savePersistedState({ a: 1 });
    clearPersistedState();
    expect(loadPersistedState()).toBeNull();
  });
});
