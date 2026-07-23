import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { AlbumCard, TrackCard } from '../components/MediaCards';
import { canViewPremiumStats } from '../utils/permissions';

export default function ArtistProfilePage() {
  const { id } = useParams();
  const { users, albums, tracks, currentUser, toggleFollow, updateProfile } = useApp();
  const artist = users.find((u) => u.id === id && u.role === 'artist');
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(artist?.bio || '');
  if (!artist) return <div className="empty-state"><h2>Artist not found.</h2><Link to="/library">Back</Link></div>;
  const artistAlbums = albums.filter((a) => a.artistId === artist.id);
  const artistTracks = tracks.filter((t) => t.artistIds.includes(artist.id));
  const following = currentUser.following?.includes(artist.id);
  const own = currentUser.id === artist.id;
  const showStats = canViewPremiumStats(currentUser.subscription) || own;
  const totalListeners = artistTracks.reduce((sum, t) => sum + t.listenerCount, 0);
  const totalStreams = artistTracks.reduce((sum, t) => sum + t.streamCount, 0);

  return (
    <div className="page-stack">
      <section className="artist-hero">
        <img src={artist.avatar || '/covers/default-avatar.svg'} alt={`Image of ${artist.displayName}`} />
        <div className="artist-hero-copy"><span className="eyebrow">Artist</span><h1>{artist.stageName || artist.displayName} {artist.verified && <span className="verified" title="Verified artist">✓</span>}</h1><p>{artist.bio || 'This artist has not added a biography yet.'}</p><div className="profile-pills"><span className="pill">{artist.followers.length.toLocaleString('en-US')} followers</span><span className={`pill ${artist.status === 'approved' ? 'success' : ''}`}>{artist.status === 'approved' ? 'Approved' : 'Pending approval'}</span></div></div>
        <div className="profile-actions">{own ? <button className="secondary-button" onClick={() => setEditingBio((v) => !v)}>Edit biography</button> : <button className={following ? 'secondary-button' : 'primary-button'} onClick={() => toggleFollow(artist.id)}>{following ? 'Unfollow' : 'Follow artist'}</button>}</div>
      </section>

      {editingBio && own && <form className="panel-card form-stack" onSubmit={(e) => { e.preventDefault(); updateProfile(artist.id, { bio }); setEditingBio(false); }}><label>Biography<textarea rows="4" value={bio} onChange={(e) => setBio(e.target.value)} /></label><button className="primary-button">Save biography</button></form>}

      {showStats && <div className="stat-grid three premium-stats"><div className="stat-card"><span>Total release listeners</span><strong>{totalListeners.toLocaleString('en-US')}</strong></div><div className="stat-card"><span>Total streams</span><strong>{totalStreams.toLocaleString('en-US')}</strong></div><div className="stat-card"><span>Releases</span><strong>{artistTracks.length.toLocaleString('en-US')}</strong></div></div>}
      {!showStats && <div className="warning-note">Aggregate listener and stream statistics are available to Gold users only.</div>}

      <section className="section-block"><div className="section-head"><h2>Albums</h2></div>{artistAlbums.length ? <div className="album-grid">{artistAlbums.map((a) => <AlbumCard key={a.id} album={a} />)}</div> : <p className="muted">No albums have been published yet.</p>}</section>
      <section className="section-block"><div className="section-head"><h2>Singles and Tracks</h2></div><div className="track-list">{artistTracks.map((t) => <TrackCard key={t.id} track={t} queueIds={artistTracks.map((x) => x.id)} />)}</div></section>
    </div>
  );
}
