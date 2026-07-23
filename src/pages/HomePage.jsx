import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { AlbumCard, TrackCard } from '../components/MediaCards';
import { canAccessEarlyRelease, subscriptionLabel } from '../utils/permissions';

export default function HomePage() {
  const { currentUser, albums, tracks, playlists, users } = useApp();
  const mine = playlists.filter((p) => p.ownerId === currentUser.id).slice(0, 3);
  const latestAlbums = [...albums].filter((a) => !a.earlyAccess).sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 4);
  const trending = [...tracks].filter((t) => !t.earlyAccess).sort((a, b) => b.listenerCount - a.listenerCount).slice(0, 4);
  const early = tracks.filter((t) => t.earlyAccess);
  const queueIds = trending.map((t) => t.id);

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Hello {currentUser.displayName} 👋</span>
          <h1>What are you listening to today?</h1>
          <p>Plan: {subscriptionLabel(currentUser.subscription)} · {Number.isFinite(currentUser.streamsToday) ? `${currentUser.streamsToday.toLocaleString('en-US')} streams today` : ''}</p>
          <Link className="primary-button inline" to="/library">Discover music</Link>
        </div>
        <img src={currentUser.avatar || '/covers/default-avatar.svg'} alt="Profile photo" />
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">Quick Access</span><h2>Your Recent Playlists</h2></div><Link to="/playlists">All playlists</Link></div>
        {mine.length ? (
          <div className="playlist-strip">
            {mine.map((p) => {
              const first = tracks.find((t) => t.id === p.trackIds[0]);
              return <Link key={p.id} className="playlist-tile" to="/playlists"><img src={first?.cover || '/covers/cover-neon.svg'} alt="" /><div><strong>{p.name}</strong><span>{p.trackIds.length.toLocaleString('en-US')} tracks</span></div></Link>;
            })}
          </div>
        ) : <div className="soft-card"><p>You do not have any playlists yet.</p><Link to="/playlists">Create your first playlist</Link></div>}
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">New Releases</span><h2>Latest Albums</h2></div><Link to="/library">Full library</Link></div>
        <div className="album-grid">{latestAlbums.map((album) => <AlbumCard key={album.id} album={album} />)}</div>
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">Trending Now</span><h2>Popular Tracks</h2></div></div>
        <div className="track-list">{trending.map((track) => <TrackCard key={track.id} track={track} queueIds={queueIds} compact />)}</div>
      </section>

      {canAccessEarlyRelease(currentUser.subscription) && (
        <section className="section-block early-section">
          <div className="section-head"><div><span className="eyebrow gold-text">Gold Exclusive</span><h2>Early Access</h2><p>Listen before the public release.</p></div></div>
          <div className="track-list">{early.map((track) => <TrackCard key={track.id} track={track} queueIds={early.map((t) => t.id)} compact />)}</div>
        </section>
      )}

      {['support', 'admin'].includes(currentUser.role) && (
        <section className="soft-card role-note"><strong>Backoffice role active.</strong><span>Open the dashboard for tickets, artist verification, and financial reports.</span><Link to="/dashboard">Open dashboard</Link></section>
      )}
    </div>
  );
}
