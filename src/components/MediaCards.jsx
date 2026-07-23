import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { canAccessEarlyRelease, canDownloadTrack, canViewPremiumStats } from '../utils/permissions';

export function ArtistNames({ artistIds = [], link = true }) {
  const { users } = useApp();
  const artists = artistIds.map((id) => users.find((u) => u.id === id)).filter(Boolean);
  return (
    <span className="artist-links">
      {artists.map((artist, idx) => (
        <React.Fragment key={artist.id}>
          {idx > 0 && ', '}
          {link ? <Link to={`/artists/${artist.id}`}>{artist.stageName || artist.displayName}</Link> : (artist.stageName || artist.displayName)}
        </React.Fragment>
      ))}
    </span>
  );
}

export function TrackCard({ track, queueIds, compact = false }) {
  const { currentUser, albums, playlists, toggleTrackInPlaylist, playTrack, notify } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const album = albums.find((a) => a.id === track.albumId);
  const mine = playlists.filter((p) => p.ownerId === currentUser?.id);
  const locked = track.earlyAccess && !canAccessEarlyRelease(currentUser?.subscription);
  const downloadable = canDownloadTrack(currentUser?.subscription);
  const showStats = canViewPremiumStats(currentUser?.subscription);

  const playlistLabel = useMemo(() => mine.length ? 'Manage playlists' : 'No playlists yet', [mine.length]);

  return (
    <article className={`track-card ${compact ? 'compact' : ''} ${locked ? 'locked-card' : ''}`}>
      <button className="cover-button" onClick={() => !locked && playTrack(track.id, queueIds)} aria-label={`Play ${track.title}`}>
        <img src={track.cover} alt={`Cover for ${track.title}`} />
        <span className="play-badge">{locked ? '🔒' : '▶'}</span>
      </button>
      <div className="track-main">
        <h3>{track.title}</h3>
        <p><ArtistNames artistIds={track.artistIds} /></p>
        {album && <Link className="muted-link" to={`/albums/${album.id}`}>{album.title}</Link>}
        {track.earlyAccess && <span className="pill gold">Early Access</span>}
        {showStats && <div className="tiny-stats"><span>{track.listenerCount.toLocaleString('en-US')} listeners</span><span>{track.streamCount.toLocaleString('en-US')} streams</span></div>}
      </div>
      <div className="track-actions">
        <button className="icon-button" onClick={() => setMenuOpen((v) => !v)} aria-label={playlistLabel}>⋯</button>
        {downloadable ? <a className="icon-button" href={track.audio} download={`${track.title}.wav`} title="Download">⇩</a> : <button className="icon-button disabled" onClick={() => notify('Downloads are available on Silver and Gold plans.', 'warning')} title="Download locked">⇩</button>}
        {menuOpen && (
          <div className="playlist-popover">
            <strong>{playlistLabel}</strong>
            {mine.map((p) => (
              <label key={p.id}>
                <input type="checkbox" checked={p.trackIds.includes(track.id)} onChange={() => toggleTrackInPlaylist(p.id, track.id)} />
                <span>{p.name}</span>
              </label>
            ))}
            {!mine.length && <Link to="/playlists">Create first playlist</Link>}
          </div>
        )}
      </div>
    </article>
  );
}

export function AlbumCard({ album }) {
  const { users } = useApp();
  const artist = users.find((u) => u.id === album.artistId);
  return (
    <article className="album-card">
      <Link className="album-primary-link" to={`/albums/${album.id}`}>
        <img src={album.cover} alt={`Cover for ${album.title}`} />
        <h3>{album.title}</h3>
      </Link>
      <div>
        {artist ? <Link className="album-artist-link" to={`/artists/${artist.id}`}>{artist.stageName || artist.displayName}</Link> : <span>Unknown artist</span>}
        <small>{album.listenerCount.toLocaleString('en-US')} listeners</small>
      </div>
      {album.earlyAccess && <span className="pill gold">Early</span>}
    </article>
  );
}
