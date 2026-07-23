import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { TrackCard } from '../components/MediaCards';
import { formatDate } from '../utils/domain';

export default function AlbumPage() {
  const { id } = useParams();
  const { albums, tracks, users } = useApp();
  const album = albums.find((a) => a.id === id);
  if (!album) return <div className="empty-state"><h2>آلبوم پیدا نشد.</h2><Link to="/library">بازگشت به آرشیو</Link></div>;
  const artist = users.find((u) => u.id === album.artistId);
  const albumTracks = tracks.filter((t) => t.albumId === album.id);
  return (
    <div className="page-stack">
      <section className="album-hero">
        <img src={album.cover} alt={`کاور ${album.title}`} />
        <div><span className="eyebrow">آلبوم</span><h1>{album.title}</h1><Link to={`/artists/${artist?.id}`}>{artist?.stageName || artist?.displayName}</Link><p>{formatDate(album.releaseDate)} · {albumTracks.length.toLocaleString('fa-IR')} ترک · {album.listenerCount.toLocaleString('fa-IR')} شنونده</p>{album.earlyAccess && <span className="pill gold">دسترسی زودهنگام</span>}</div>
      </section>
      <section className="track-list">{albumTracks.map((track) => <TrackCard key={track.id} track={track} queueIds={albumTracks.map((t) => t.id)} />)}</section>
    </div>
  );
}
