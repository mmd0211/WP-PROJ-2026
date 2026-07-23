import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
import { AlbumCard, TrackCard } from '../components/MediaCards';
import { canAccessEarlyRelease, subscriptionLabel } from '../utils/permissions';

export default function HomePage() {
  const { currentUser, albums, tracks, playlists } = useApp();
  const { t, number } = useI18n();
  const mine = playlists.filter((p) => p.ownerId === currentUser.id).slice(0, 3);
  const latestAlbums = [...albums].filter((a) => !a.earlyAccess).sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 4);
  const trending = [...tracks].filter((track) => !track.earlyAccess).sort((a, b) => b.listenerCount - a.listenerCount).slice(0, 4);
  const early = tracks.filter((track) => track.earlyAccess);
  const queueIds = trending.map((track) => track.id);
  const displayName = t(currentUser.displayName);

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">{t(`Hello ${displayName} 👋`)}</span>
          <h1>{t('What are you listening to today?')}</h1>
          <p>{t('Plan:')} {t(subscriptionLabel(currentUser.subscription))} · {number(currentUser.streamsToday || 0)} {t('streams today')}</p>
          <Link className="primary-button inline" to="/library">{t('Discover music')}</Link>
        </div>
        <img src={currentUser.avatar || '/covers/default-avatar.svg'} alt={t('Profile photo')} />
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">{t('Quick Access')}</span><h2>{t('Your Recent Playlists')}</h2></div><Link to="/playlists">{t('All playlists')}</Link></div>
        {mine.length ? (
          <div className="playlist-strip">
            {mine.map((playlist) => {
              const first = tracks.find((track) => track.id === playlist.trackIds[0]);
              return <Link key={playlist.id} className="playlist-tile" to="/playlists"><img src={first?.cover || '/covers/cover-neon.svg'} alt="" /><div><strong>{t(playlist.name)}</strong><span>{number(playlist.trackIds.length)} {t('tracks')}</span></div></Link>;
            })}
          </div>
        ) : <div className="soft-card"><p>{t('You do not have any playlists yet.')}</p><Link to="/playlists">{t('Create your first playlist')}</Link></div>}
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">{t('New Releases')}</span><h2>{t('Latest Albums')}</h2></div><Link to="/library">{t('Full library')}</Link></div>
        <div className="album-grid">{latestAlbums.map((album) => <AlbumCard key={album.id} album={album} />)}</div>
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">{t('Trending Now')}</span><h2>{t('Popular Tracks')}</h2></div></div>
        <div className="track-list">{trending.map((track) => <TrackCard key={track.id} track={track} queueIds={queueIds} compact />)}</div>
      </section>

      {canAccessEarlyRelease(currentUser.subscription) && (
        <section className="section-block early-section">
          <div className="section-head"><div><span className="eyebrow gold-text">{t('Gold Exclusive')}</span><h2>{t('Early Access')}</h2><p>{t('Listen before the public release.')}</p></div></div>
          <div className="track-list">{early.map((track) => <TrackCard key={track.id} track={track} queueIds={early.map((item) => item.id)} compact />)}</div>
        </section>
      )}

      {['support', 'admin'].includes(currentUser.role) && (
        <section className="soft-card role-note"><strong>{t('Backoffice role active.')}</strong><span>{t('Open the dashboard for tickets, artist verification, and financial reports.')}</span><Link to="/dashboard">{t('Open dashboard')}</Link></section>
      )}
    </div>
  );
}
