import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
import { AlbumCard, TrackCard } from '../components/MediaCards';
import { canViewPremiumStats } from '../utils/permissions';

export default function ArtistProfilePage() {
  const { id } = useParams();
  const { users, albums, tracks, currentUser, toggleFollow, updateProfile } = useApp();
  const { t, number } = useI18n();
  const artist = users.find((user) => user.id === id && user.role === 'artist');
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(artist?.bio || '');
  if (!artist) return <div className="empty-state"><h2>{t('Artist not found.')}</h2><Link to="/library">{t('Back')}</Link></div>;
  const artistAlbums = albums.filter((album) => album.artistId === artist.id);
  const artistTracks = tracks.filter((track) => track.artistIds.includes(artist.id));
  const following = currentUser.following?.includes(artist.id);
  const own = currentUser.id === artist.id;
  const showStats = canViewPremiumStats(currentUser.subscription) || own;
  const totalListeners = artistTracks.reduce((sum, track) => sum + track.listenerCount, 0);
  const totalStreams = artistTracks.reduce((sum, track) => sum + track.streamCount, 0);

  return (
    <div className="page-stack">
      <section className="artist-hero">
        <img src={artist.avatar || '/covers/default-avatar.svg'} alt={t(`Image of ${artist.displayName}`)} />
        <div className="artist-hero-copy"><span className="eyebrow">{t('Artist')}</span><h1>{t(artist.stageName || artist.displayName)} {artist.verified && <span className="verified" title={t('Verified artist')}>✓</span>}</h1><p>{t(artist.bio || 'This artist has not added a biography yet.')}</p><div className="profile-pills"><span className="pill">{number(artist.followers.length)} {t('followers')}</span><span className={`pill ${artist.status === 'approved' ? 'success' : ''}`}>{t(artist.status === 'approved' ? 'Approved' : 'Pending approval')}</span></div></div>
        <div className="profile-actions">{own ? <button className="secondary-button" onClick={() => setEditingBio((value) => !value)}>{t('Edit biography')}</button> : <button className={following ? 'secondary-button' : 'primary-button'} onClick={() => toggleFollow(artist.id)}>{t(following ? 'Unfollow' : 'Follow artist')}</button>}</div>
      </section>

      {editingBio && own && <form className="panel-card form-stack" onSubmit={(event) => { event.preventDefault(); updateProfile(artist.id, { bio }); setEditingBio(false); }}><label>{t('Biography')}<textarea rows="4" value={bio} onChange={(event) => setBio(event.target.value)} /></label><button className="primary-button">{t('Save biography')}</button></form>}

      {showStats && <div className="stat-grid three premium-stats"><div className="stat-card"><span>{t('Total release listeners')}</span><strong>{number(totalListeners)}</strong></div><div className="stat-card"><span>{t('Total streams')}</span><strong>{number(totalStreams)}</strong></div><div className="stat-card"><span>{t('Releases')}</span><strong>{number(artistTracks.length)}</strong></div></div>}
      {!showStats && <div className="warning-note">{t('Aggregate listener and stream statistics are available to Gold users only.')}</div>}

      <section className="section-block"><div className="section-head"><h2>{t('Albums')}</h2></div>{artistAlbums.length ? <div className="album-grid">{artistAlbums.map((album) => <AlbumCard key={album.id} album={album} />)}</div> : <p className="muted">{t('No albums have been published yet.')}</p>}</section>
      <section className="section-block"><div className="section-head"><h2>{t('Singles and Tracks')}</h2></div><div className="track-list">{artistTracks.map((track) => <TrackCard key={track.id} track={track} queueIds={artistTracks.map((item) => item.id)} />)}</div></section>
    </div>
  );
}
