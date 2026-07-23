import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
import EmptyState from '../components/EmptyState';
import { TrackCard } from '../components/MediaCards';
import { getPlaylistLimit, subscriptionLabel } from '../utils/permissions';

export default function PlaylistsPage() {
  const { currentUser, playlists, tracks, createPlaylist, renamePlaylist, deletePlaylist, notify } = useApp();
  const { t, number } = useI18n();
  const mine = playlists.filter((playlist) => playlist.ownerId === currentUser.id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const [name, setName] = useState('');
  const limit = getPlaylistLimit(currentUser.subscription);

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    const result = createPlaylist(name);
    if (!result.ok) return notify(result.message, 'warning');
    setName('');
    notify('Playlist created.', 'success');
  };

  return (
    <div className="page-stack">
      <div className="page-title action-title">
        <div><span className="eyebrow">{t('Your Library')}</span><h1>{t('Playlists')}</h1><p>{t('Plan:')} {t(subscriptionLabel(currentUser.subscription))} · {number(mine.length)} {t('of')} {Number.isFinite(limit) ? number(limit) : '∞'} {t('playlists')}</p></div>
        <form className="inline-create" onSubmit={submit}><input placeholder={t('New playlist name')} value={name} onChange={(event) => setName(event.target.value)} /><button className="primary-button">{t('Create')}</button></form>
      </div>

      {!mine.length ? (
        <EmptyState icon="☷" title={t('No playlists yet')} text={t('Create your first playlist and add tracks from the library.')} action={<button className="primary-button" onClick={() => document.querySelector('.inline-create input')?.focus()}>{t('Create first playlist')}</button>} />
      ) : (
        <div className="playlist-page-list">
          {mine.map((playlist) => {
            const playlistTracks = playlist.trackIds.map((id) => tracks.find((track) => track.id === id)).filter(Boolean);
            return (
              <section key={playlist.id} className="panel-card playlist-panel">
                <div className="playlist-panel-head">
                  <div><span className="eyebrow">{number(playlistTracks.length)} {t('tracks')}</span><h2>{t(playlist.name)}</h2></div>
                  <div className="button-row"><button className="secondary-button small" onClick={() => { const next = window.prompt(t('New playlist name:'), playlist.name); if (next?.trim()) renamePlaylist(playlist.id, next); }}>{t('Rename')}</button><Link className="secondary-button small" to="/library">{t('Add tracks')}</Link><button className="danger-button small" onClick={() => window.confirm(t(`Delete playlist “${playlist.name}”?`)) && deletePlaylist(playlist.id)}>{t('Delete')}</button></div>
                </div>
                {playlistTracks.length ? <div className="track-list">{playlistTracks.map((track) => <TrackCard key={track.id} track={track} queueIds={playlistTracks.map((item) => item.id)} compact />)}</div> : <div className="mini-empty"><span>♪</span><p>{t('This playlist is empty.')}</p><Link to="/library">{t('Browse library and add tracks')}</Link></div>}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
