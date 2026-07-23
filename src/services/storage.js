const KEY = 'spotune.phase1.state.v1';

export function loadPersistedState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePersistedState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearPersistedState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // no-op for restricted browser storage
  }
}

export { KEY as STORAGE_KEY };
