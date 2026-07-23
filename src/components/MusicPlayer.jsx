import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { nextRepeatMode } from '../utils/domain';
import { canViewPremiumStats } from '../utils/permissions';
import { ArtistNames } from './MediaCards';

function seconds(value) {
  const s = Number.isFinite(value) ? Math.max(0, value) : 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${r}`;
}

export default function MusicPlayer() {
  const { tracks, albums, currentUser, player, setPlayerState, playTrack } = useApp();
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [queueOpen, setQueueOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const track = tracks.find((t) => t.id === player.currentTrackId);
  const album = albums.find((a) => a.id === track?.albumId);
  const queue = useMemo(() => player.queue.map((id) => tracks.find((t) => t.id === id)).filter(Boolean), [player.queue, tracks]);
  const showStats = canViewPremiumStats(currentUser?.subscription);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (audio.src !== new URL(track.audio, window.location.href).href) {
      audio.src = track.audio;
      audio.load();
      setCurrentTime(0);
    }
    if (player.isPlaying) {
      audio.play().catch(() => setPlayerState({ isPlaying: false }));
    } else {
      audio.pause();
    }
  }, [track, player.isPlaying, setPlayerState]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const move = (direction) => {
    if (!track || !queue.length) return;
    const index = queue.findIndex((t) => t.id === track.id);
    let nextIndex;
    if (player.shuffle && queue.length > 1) {
      do nextIndex = Math.floor(Math.random() * queue.length); while (nextIndex === index);
    } else {
      nextIndex = (index + direction + queue.length) % queue.length;
    }
    playTrack(queue[nextIndex].id, queue.map((t) => t.id));
  };

  const onEnded = () => {
    const audio = audioRef.current;
    if (player.repeat === 'one' && audio) {
      audio.currentTime = 0;
      audio.play();
      return;
    }
    const index = queue.findIndex((t) => t.id === track?.id);
    if (index === queue.length - 1 && player.repeat !== 'all') {
      setPlayerState({ isPlaying: false });
      return;
    }
    move(1);
  };

  if (!track) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || track.duration || 0)}
        onEnded={onEnded}
      />
      <section className={`music-player ${player.expanded ? 'expanded-mobile' : ''}`} aria-label="پخش کننده موسیقی">
        <div className="player-track">
          <img src={track.cover} alt="" />
          <div>
            <strong>{track.title}</strong>
            <span><ArtistNames artistIds={track.artistIds} /></span>
            {album && <small className="player-album"><Link to={`/albums/${album.id}`}>{album.title}</Link></small>}
          </div>
          <button className="mobile-expand" onClick={() => setPlayerState({ expanded: !player.expanded })}>{player.expanded ? '⌄' : '⌃'}</button>
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button className={player.shuffle ? 'active-control' : ''} onClick={() => setPlayerState({ shuffle: !player.shuffle })} title="پخش تصادفی">⤨</button>
            <button onClick={() => move(-1)} title="قبلی">⏮</button>
            <button className="play-main" onClick={() => setPlayerState({ isPlaying: !player.isPlaying })} title={player.isPlaying ? 'توقف' : 'پخش'}>{player.isPlaying ? '❚❚' : '▶'}</button>
            <button onClick={() => move(1)} title="بعدی">⏭</button>
            <button className={player.repeat !== 'off' ? 'active-control' : ''} onClick={() => setPlayerState({ repeat: nextRepeatMode(player.repeat) })} title={`تکرار: ${player.repeat}`}>{player.repeat === 'one' ? '↻¹' : '↻'}</button>
          </div>
          <div className="progress-row">
            <span>{seconds(currentTime)}</span>
            <input
              aria-label="نوار پیشرفت"
              type="range"
              min="0"
              max={duration || track.duration || 1}
              step="0.01"
              value={Math.min(currentTime, duration || track.duration || 1)}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = value;
                setCurrentTime(value);
              }}
            />
            <span>{seconds(duration || track.duration)}</span>
          </div>
        </div>

        <div className="player-extra">
          {showStats && <span className="player-stats">{track.listenerCount.toLocaleString('fa-IR')} شنونده · {track.streamCount.toLocaleString('fa-IR')} استریم</span>}
          <button onClick={() => setLyricsOpen((v) => !v)} title="متن آهنگ">♫</button>
          <button onClick={() => setQueueOpen((v) => !v)} title="صف پخش">☷</button>
          <span>🔊</span>
          <input aria-label="کنترل صدا" className="volume-slider" type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
        </div>

        <div className="mobile-full-info">
          <img className="mobile-big-cover" src={track.cover} alt={`کاور ${track.title}`} />
          <h2>{track.title}</h2>
          <p><ArtistNames artistIds={track.artistIds} /></p>
          {album && <Link to={`/albums/${album.id}`}>{album.title}</Link>}
          {showStats && <p className="tiny-stats"><span>{track.listenerCount.toLocaleString('fa-IR')} شنونده</span><span>{track.streamCount.toLocaleString('fa-IR')} استریم</span></p>}
        </div>
      </section>

      {queueOpen && (
        <aside className="player-drawer queue-drawer">
          <div className="drawer-head"><h3>صف پخش</h3><button onClick={() => setQueueOpen(false)}>×</button></div>
          {queue.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className={`queue-item ${item.id === track.id ? 'current' : ''}`}>
              <button className="queue-play" onClick={() => playTrack(item.id, queue.map((t) => t.id))}>
                <img src={item.cover} alt="" /><span>{item.title}</span>
              </button>
              <button className="queue-remove" aria-label={`حذف ${item.title} از صف`} onClick={() => setPlayerState({ queue: player.queue.filter((id, i) => !(id === item.id && i === idx)) })}>×</button>
            </div>
          ))}
          {queue.length > 1 && <button className="secondary-button small queue-clear" onClick={() => setPlayerState({ queue: [track.id] })}>پاک کردن بقیه صف</button>}
        </aside>
      )}

      {lyricsOpen && (
        <aside className="player-drawer lyrics-drawer">
          <div className="drawer-head"><h3>متن آهنگ</h3><button onClick={() => setLyricsOpen(false)}>×</button></div>
          <div className="lyrics-text">{track.lyrics ? track.lyrics.split('\n').map((line, i) => <p key={i}>{line}</p>) : <p className="muted">برای این آهنگ متنی ثبت نشده است.</p>}</div>
        </aside>
      )}
    </>
  );
}
