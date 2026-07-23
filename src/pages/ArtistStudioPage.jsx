import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { formatMoney, formatDate } from '../utils/domain';
import { canUseArtistStudio } from '../utils/permissions';
import EmptyState from '../components/EmptyState';

const initialForm = {
  title: '', releaseType: 'single', albumTitle: '', albumId: '', genre: '', releaseDate: new Date().toISOString().slice(0, 10),
  collaboratorIds: [], lyrics: '', earlyAccess: false, audio: '', cover: '',
};

function fileToDataUrl(file, maxBytes = 950_000) {
  return new Promise((resolve) => {
    if (!file) return resolve({ data: '', error: '' });
    if (file.size > maxBytes) return resolve({ data: '', error: 'Large files are not stored in Local Storage in the mock application; a bundled demo audio preview will be used instead.' });
    const reader = new FileReader();
    reader.onload = () => resolve({ data: String(reader.result), error: '' });
    reader.onerror = () => resolve({ data: '', error: 'Failed to read the file.' });
    reader.readAsDataURL(file);
  });
}

export default function ArtistStudioPage() {
  const { currentUser, tracks, albums, users, publishTrack, updateTrack, deleteTrack, notify } = useApp();
  const [form, setForm] = useState(initialForm);
  const [fileNote, setFileNote] = useState('');
  const [publishing, setPublishing] = useState(false);
  const myTracks = useMemo(() => tracks.filter((t) => t.artistIds.includes(currentUser.id)), [tracks, currentUser.id]);
  const myAlbums = useMemo(() => albums.filter((a) => a.artistId === currentUser.id), [albums, currentUser.id]);
  const collaborators = users.filter((u) => u.role === 'artist' && u.id !== currentUser.id && u.status === 'approved');
  const totalIncome = myTracks.reduce((s, t) => s + (t.income || 0), 0);
  const totalStreams = myTracks.reduce((s, t) => s + (t.streamCount || 0), 0);
  const totalListeners = myTracks.reduce((s, t) => s + (t.listenerCount || 0), 0);

  if (!canUseArtistStudio(currentUser)) {
    return <EmptyState icon="⌛" title="Artist account is pending approval" text="Artist Studio becomes available after approval by support or the administrator. The review result will appear in Notifications." />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setPublishing(true);
    const result = publishTrack({ ...form, collaboratorIds: form.collaboratorIds.filter(Boolean) });
    setPublishing(false);
    if (!result.ok) return notify(result.message, 'warning');
    setForm(initialForm);
    setFileNote('');
  };

  const handleAudio = async (file) => {
    if (!file) return;
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];
    const extOk = /\.(mp3|wav|flac)$/i.test(file.name);
    if (!allowed.includes(file.type) && !extOk) return setFileNote('Allowed formats: MP3 / WAV / FLAC');
    const { data, error } = await fileToDataUrl(file);
    setForm((v) => ({ ...v, audio: data || '/audio/track1.wav' }));
    setFileNote(error || `Audio file “${file.name}” is ready for the mock application.`);
  };

  const handleCover = async (file) => {
    const { data, error } = await fileToDataUrl(file, 800_000);
    if (data) setForm((v) => ({ ...v, cover: data }));
    if (error) setFileNote(error);
  };

  return (
    <div className="page-stack">
      <div className="page-title"><div><span className="eyebrow">Verified Artist</span><h1>Artist Studio</h1><p>Publish, edit, delete, and review statistics for your releases.</p></div></div>

      <div className="stat-grid three premium-stats">
        <div className="stat-card"><span>Release listeners</span><strong>{totalListeners.toLocaleString('en-US')}</strong></div>
        <div className="stat-card"><span>Streams</span><strong>{totalStreams.toLocaleString('en-US')}</strong></div>
        <div className="stat-card"><span>Release revenue</span><strong>{formatMoney(totalIncome)} <small>IRR</small></strong></div>
      </div>

      <section className="panel-card">
        <div className="section-head"><div><h2>Publish a new release</h2><p>Provide metadata, media, and the release type.</p></div></div>
        <form className="form-stack" onSubmit={submit}>
          <div className="form-two"><label>Title<input required value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} /></label><label>Release type<select value={form.releaseType} onChange={(e) => setForm((v) => ({ ...v, releaseType: e.target.value, albumId: '' }))}><option value="single">Single</option><option value="album">Album track</option></select></label></div>

          {form.releaseType === 'album' && <div className="form-two"><label>Existing album<select value={form.albumId} onChange={(e) => setForm((v) => ({ ...v, albumId: e.target.value }))}><option value="">Create a new album</option>{myAlbums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}</select></label>{!form.albumId && <label>New album title<input required value={form.albumTitle} onChange={(e) => setForm((v) => ({ ...v, albumTitle: e.target.value }))} /></label>}</div>}

          <div className="form-two"><label>Genre<input placeholder="Electronic / Indie / ..." value={form.genre} onChange={(e) => setForm((v) => ({ ...v, genre: e.target.value }))} /></label><label>Release date<input type="date" value={form.releaseDate} onChange={(e) => setForm((v) => ({ ...v, releaseDate: e.target.value }))} /></label></div>

          <label>Collaborating artists<select multiple value={form.collaboratorIds} onChange={(e) => setForm((v) => ({ ...v, collaboratorIds: Array.from(e.target.selectedOptions).map((o) => o.value) }))}>{collaborators.map((a) => <option key={a.id} value={a.id}>{a.stageName || a.displayName}</option>)}</select><small>Hold Ctrl/Cmd to select multiple artists.</small></label>
          <label>Lyrics<textarea rows="5" value={form.lyrics} onChange={(e) => setForm((v) => ({ ...v, lyrics: e.target.value }))} placeholder="Enter lyrics when available…" /></label>
          <div className="form-two"><label>Audio file (MP3 / WAV / FLAC)<input type="file" accept="audio/*,.mp3,.wav,.flac" onChange={(e) => handleAudio(e.target.files?.[0])} /></label><label>Cover image<input type="file" accept="image/*" onChange={(e) => handleCover(e.target.files?.[0])} /></label></div>
          {fileNote && <p className="info-note">{fileNote}</p>}
          <label className="checkbox-line"><input type="checkbox" checked={form.earlyAccess} onChange={(e) => setForm((v) => ({ ...v, earlyAccess: e.target.checked }))} /><span>Publish as Early Access for Gold users</span></label>
          <button className="primary-button" disabled={publishing}>{publishing ? 'Publishing…' : 'Publish to mock catalog'}</button>
        </form>
      </section>

      <section className="panel-card">
        <div className="section-head"><div><h2>Published releases</h2><p>{myTracks.length.toLocaleString('en-US')} releases</p></div></div>
        {myTracks.length ? <div className="responsive-table"><table><thead><tr><th>Release</th><th>Type / Album</th><th>Genre</th><th>Release date</th><th>Listeners</th><th>Streams</th><th>Revenue</th><th>Actions</th></tr></thead><tbody>{myTracks.map((t) => {
          const album = albums.find((a) => a.id === t.albumId);
          return <tr key={t.id}><td><div className="table-media"><img src={t.cover} alt="" /><strong>{t.title}</strong></div></td><td>{album?.title || 'Single'}</td><td>{t.genre}</td><td>{formatDate(t.releaseDate)}</td><td>{t.listenerCount.toLocaleString('en-US')}</td><td>{t.streamCount.toLocaleString('en-US')}</td><td>{formatMoney(t.income)} IRR</td><td><div className="button-row nowrap"><button className="secondary-button small" onClick={() => { const title = window.prompt('New release title:', t.title); if (title?.trim()) updateTrack(t.id, { title: title.trim() }); }}>Edit</button><button className="danger-button small" onClick={() => window.confirm(`Delete release “${t.title}”?`) && deleteTrack(t.id)}>Delete</button></div></td></tr>;
        })}</tbody></table></div> : <EmptyState title="No releases yet" text="Complete the form above to publish the first mock release." />}
      </section>
    </div>
  );
}
