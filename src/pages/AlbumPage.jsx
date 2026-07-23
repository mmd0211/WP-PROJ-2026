import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
import { TrackCard } from '../components/MediaCards';
import { formatDate } from '../utils/domain';

export default function AlbumPage() {
  const { id } = useParams();
  const { albums, tracks, users } = useApp();
  const { t, number } = useI18n();
  const album = albums.find((item) => item.id === id);
  if (!album) return <div className="empty-state"><h2>{t('Album not found.')}</h2><Link to="/library">{t('Back to library')}</Link></div>;
  const artist = users.find((user) => user.id === album.artistId);
  const albumTracks = tracks.filter((track) => track.albumId === album.id);
  return (
    <div className="page-stack">
      <section className="album-hero">
        <img src={album.cover} alt={t(`Cover for ${album.title}`)} />
        <div><span className="eyebrow">{t('Album')}</span><h1>{t(album.title)}</h1><Link to={`/artists/${artist?.id}`}>{t(artist?.stageName || artist?.displayName || '')}</Link><p>{formatDate(album.releaseDate)} · {number(albumTracks.length)} {t('tracks')} · {number(album.listenerCount)} {t('listeners')}</p>{album.earlyAccess && <span className="pill gold">{t('Early Access')}</span>}</div>
      </section>
      <section className="track-list">{albumTracks.map((track) => <TrackCard key={track.id} track={track} queueIds={albumTracks.map((item) => item.id)} />)}</section>
    </div>
  );
}
