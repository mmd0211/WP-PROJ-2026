import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
import { AlbumCard, TrackCard } from '../components/MediaCards';
import { filterCatalog, sortCatalog } from '../utils/domain';

export default function LibraryPage() {
  const { tracks, albums, users } = useApp();
  const { t, number } = useI18n();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [sort, setSort] = useState('listeners');
  const [type, setType] = useState('all');
  const artistNameFor = (id) => users.find((user) => user.id === id)?.stageName || users.find((user) => user.id === id)?.displayName || '';

  const filteredTracks = useMemo(() => sortCatalog(filterCatalog(tracks, query, artistNameFor), sort), [tracks, query, sort, users]);
  const filteredAlbums = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = albums.filter((album) => !q || `${album.title} ${artistNameFor(album.artistId)}`.toLowerCase().includes(q));
    return sortCatalog(list, sort);
  }, [albums, query, sort, users]);

  const submit = (event) => {
    event.preventDefault();
    const next = new URLSearchParams(params);
    query ? next.set('q', query) : next.delete('q');
    setParams(next);
  };

  return (
    <div className="page-stack">
      <div className="page-title"><div><span className="eyebrow">{t('Music Library')}</span><h1>{t('Albums and Singles')}</h1><p>{t('Search by release or artist name.')}</p></div></div>
      <form className="catalog-toolbar" onSubmit={submit}>
        <label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Release or artist name…')} /></label>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label={t('Sort')}><option value="listeners">{t('Most listeners')}</option><option value="date">{t('Newest releases')}</option></select>
        <div className="segmented"><button type="button" className={type === 'all' ? 'active' : ''} onClick={() => setType('all')}>{t('All')}</button><button type="button" className={type === 'album' ? 'active' : ''} onClick={() => setType('album')}>{t('Album')}</button><button type="button" className={type === 'track' ? 'active' : ''} onClick={() => setType('track')}>{t('Track')}</button></div>
      </form>

      {(type === 'all' || type === 'album') && <section className="section-block"><div className="section-head"><h2>{t('Albums')}</h2><span>{number(filteredAlbums.length)} {t('results')}</span></div><div className="album-grid">{filteredAlbums.map((album) => <AlbumCard key={album.id} album={album} />)}</div></section>}
      {(type === 'all' || type === 'track') && <section className="section-block"><div className="section-head"><h2>{t('Singles and Tracks')}</h2><span>{number(filteredTracks.length)} {t('results')}</span></div><div className="track-list">{filteredTracks.map((track) => <TrackCard key={track.id} track={track} queueIds={filteredTracks.map((item) => item.id)} />)}</div></section>}
    </div>
  );
}
