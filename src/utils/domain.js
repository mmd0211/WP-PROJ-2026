export function sortCatalog(items, mode = 'listeners') {
  return [...items].sort((a, b) => mode === 'date'
    ? new Date(b.releaseDate) - new Date(a.releaseDate)
    : (b.listenerCount || 0) - (a.listenerCount || 0));
}

export function filterCatalog(items, query, artistNameFor) {
  const needle = String(query || '').trim().toLocaleLowerCase('fa');
  if (!needle) return items;
  return items.filter((item) => {
    const artistNames = (item.artistIds || [item.artistId]).map(artistNameFor).join(' ');
    return `${item.title} ${artistNames}`.toLocaleLowerCase('fa').includes(needle);
  });
}

export function toggleId(list = [], id) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function nextRepeatMode(mode) {
  if (mode === 'off') return 'all';
  if (mode === 'all') return 'one';
  return 'off';
}

export function formatMoney(value) {
  return new Intl.NumberFormat('fa-IR').format(Number(value || 0));
}

export function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return value || '-';
  }
}

export function safeUsername(displayName = 'user') {
  const base = displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_]/gu, '').slice(0, 16) || 'user';
  return `${base}_${Math.floor(100 + Math.random() * 900)}`;
}
