import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import EmptyState from '../components/EmptyState';
import { TrackCard } from '../components/MediaCards';
import { getPlaylistLimit, subscriptionLabel } from '../utils/permissions';

export default function PlaylistsPage() {
  const { currentUser, playlists, tracks, createPlaylist, renamePlaylist, deletePlaylist, notify } = useApp();
  const mine = playlists.filter((p) => p.ownerId === currentUser.id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const [name, setName] = useState('');
  const limit = getPlaylistLimit(currentUser.subscription);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const result = createPlaylist(name);
    if (!result.ok) return notify(result.message, 'warning');
    setName('');
    notify('Playlist created.', 'success');
  };

  return (
    <div className="page-stack">
      <div className="page-title action-title">
        <div><span className="eyebrow">Your Library</span><h1>Playlists</h1><p>Plan: {subscriptionLabel(currentUser.subscription)} · {mine.length.toLocaleString('en-US')} of {Number.isFinite(limit) ? limit.toLocaleString('en-US') : '∞'} playlists</p></div>
        <form className="inline-create" onSubmit={submit}><input placeholder="New playlist name" value={name} onChange={(e) => setName(e.target.value)} /><button className="primary-button">Create</button></form>
      </div>

      {!mine.length ? (
        <EmptyState icon="☷" title="No playlists yet" text="Create your first playlist and add tracks from the library." action={<button className="primary-button" onClick={() => document.querySelector('.inline-create input')?.focus()}>Create first playlist</button>} />
      ) : (
        <div className="playlist-page-list">
          {mine.map((playlist) => {
            const playlistTracks = playlist.trackIds.map((id) => tracks.find((t) => t.id === id)).filter(Boolean);
            return (
              <section key={playlist.id} className="panel-card playlist-panel">
                <div className="playlist-panel-head">
                  <div><span className="eyebrow">{playlistTracks.length.toLocaleString('en-US')} tracks</span><h2>{playlist.name}</h2></div>
                  <div className="button-row"><button className="secondary-button small" onClick={() => { const next = window.prompt('New playlist name:', playlist.name); if (next?.trim()) renamePlaylist(playlist.id, next); }}>Rename</button><Link className="secondary-button small" to="/library">Add tracks</Link><button className="danger-button small" onClick={() => window.confirm(`Delete playlist “${playlist.name}”?`) && deletePlaylist(playlist.id)}>Delete</button></div>
                </div>
                {playlistTracks.length ? <div className="track-list">{playlistTracks.map((track) => <TrackCard key={track.id} track={track} queueIds={playlistTracks.map((t) => t.id)} compact />)}</div> : <div className="mini-empty"><span>♪</span><p>This playlist is empty.</p><Link to="/library">Browse library and add tracks</Link></div>}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
