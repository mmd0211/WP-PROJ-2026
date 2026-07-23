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
    notify('پلی‌لیست ساخته شد.', 'success');
  };

  return (
    <div className="page-stack">
      <div className="page-title action-title">
        <div><span className="eyebrow">کتابخانه شخصی</span><h1>پلی‌لیست‌ها</h1><p>اشتراک {subscriptionLabel(currentUser.subscription)} · {mine.length.toLocaleString('fa-IR')} از {Number.isFinite(limit) ? limit.toLocaleString('fa-IR') : '∞'} پلی‌لیست</p></div>
        <form className="inline-create" onSubmit={submit}><input placeholder="نام پلی‌لیست جدید" value={name} onChange={(e) => setName(e.target.value)} /><button className="primary-button">ایجاد</button></form>
      </div>

      {!mine.length ? (
        <EmptyState icon="☷" title="هنوز پلی‌لیستی ندارید" text="اولین پلی‌لیست خود را بسازید و از آرشیو آهنگ اضافه کنید." action={<button className="primary-button" onClick={() => document.querySelector('.inline-create input')?.focus()}>ایجاد اولین پلی‌لیست</button>} />
      ) : (
        <div className="playlist-page-list">
          {mine.map((playlist) => {
            const playlistTracks = playlist.trackIds.map((id) => tracks.find((t) => t.id === id)).filter(Boolean);
            return (
              <section key={playlist.id} className="panel-card playlist-panel">
                <div className="playlist-panel-head">
                  <div><span className="eyebrow">{playlistTracks.length.toLocaleString('fa-IR')} آهنگ</span><h2>{playlist.name}</h2></div>
                  <div className="button-row"><button className="secondary-button small" onClick={() => { const next = window.prompt('نام جدید پلی‌لیست:', playlist.name); if (next?.trim()) renamePlaylist(playlist.id, next); }}>تغییر نام</button><Link className="secondary-button small" to="/library">افزودن آهنگ</Link><button className="danger-button small" onClick={() => window.confirm(`پلی‌لیست «${playlist.name}» حذف شود؟`) && deletePlaylist(playlist.id)}>حذف</button></div>
                </div>
                {playlistTracks.length ? <div className="track-list">{playlistTracks.map((track) => <TrackCard key={track.id} track={track} queueIds={playlistTracks.map((t) => t.id)} compact />)}</div> : <div className="mini-empty"><span>♪</span><p>این پلی‌لیست خالی است.</p><Link to="/library">رفتن به آرشیو و افزودن آهنگ</Link></div>}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
