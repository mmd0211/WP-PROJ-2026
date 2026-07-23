import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { AlbumCard, TrackCard } from '../components/MediaCards';
import { filterCatalog, sortCatalog } from '../utils/domain';

export default function LibraryPage() {
  const { tracks, albums, users } = useApp();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [sort, setSort] = useState('listeners');
  const [type, setType] = useState('all');
  const artistNameFor = (id) => users.find((u) => u.id === id)?.stageName || users.find((u) => u.id === id)?.displayName || '';

  const filteredTracks = useMemo(() => sortCatalog(filterCatalog(tracks, query, artistNameFor), sort), [tracks, query, sort, users]);
  const filteredAlbums = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = albums.filter((a) => !q || `${a.title} ${artistNameFor(a.artistId)}`.toLowerCase().includes(q));
    return sortCatalog(list, sort);
  }, [albums, query, sort, users]);

  const submit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    query ? next.set('q', query) : next.delete('q');
    setParams(next);
  };

  return (
    <div className="page-stack">
      <div className="page-title"><div><span className="eyebrow">Music Library</span><h1>Albums and Singles</h1><p>Search by release or artist name.</p></div></div>
      <form className="catalog-toolbar" onSubmit={submit}>
        <label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Release or artist name…" /></label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="listeners">Most listeners</option><option value="date">Newest releases</option></select>
        <div className="segmented"><button type="button" className={type === 'all' ? 'active' : ''} onClick={() => setType('all')}>All</button><button type="button" className={type === 'album' ? 'active' : ''} onClick={() => setType('album')}>Album</button><button type="button" className={type === 'track' ? 'active' : ''} onClick={() => setType('track')}>Track</button></div>
      </form>

      {(type === 'all' || type === 'album') && <section className="section-block"><div className="section-head"><h2>Albums</h2><span>{filteredAlbums.length.toLocaleString('en-US')} results</span></div><div className="album-grid">{filteredAlbums.map((album) => <AlbumCard key={album.id} album={album} />)}</div></section>}
      {(type === 'all' || type === 'track') && <section className="section-block"><div className="section-head"><h2>Singles and Tracks</h2><span>{filteredTracks.length.toLocaleString('en-US')} results</span></div><div className="track-list">{filteredTracks.map((track) => <TrackCard key={track.id} track={track} queueIds={filteredTracks.map((t) => t.id)} />)}</div></section>}
    </div>
  );
}
