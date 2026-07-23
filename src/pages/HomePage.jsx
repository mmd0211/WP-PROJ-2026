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
          <span className="eyebrow">سلام {currentUser.displayName} 👋</span>
          <h1>امروز چی گوش می‌دی؟</h1>
          <p>اشتراک {subscriptionLabel(currentUser.subscription)} · {Number.isFinite(currentUser.streamsToday) ? `${currentUser.streamsToday.toLocaleString('fa-IR')} پخش امروز` : ''}</p>
          <Link className="primary-button inline" to="/library">کشف موسیقی</Link>
        </div>
        <img src={currentUser.avatar || '/covers/default-avatar.svg'} alt="عکس پروفایل" />
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">بازگشت سریع</span><h2>آخرین پلی‌لیست‌های شما</h2></div><Link to="/playlists">همه پلی‌لیست‌ها</Link></div>
        {mine.length ? (
          <div className="playlist-strip">
            {mine.map((p) => {
              const first = tracks.find((t) => t.id === p.trackIds[0]);
              return <Link key={p.id} className="playlist-tile" to="/playlists"><img src={first?.cover || '/covers/cover-neon.svg'} alt="" /><div><strong>{p.name}</strong><span>{p.trackIds.length.toLocaleString('fa-IR')} آهنگ</span></div></Link>;
            })}
          </div>
        ) : <div className="soft-card"><p>هنوز پلی‌لیستی ندارید.</p><Link to="/playlists">اولین پلی‌لیست را بسازید</Link></div>}
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">تازه‌ها</span><h2>آخرین آلبوم‌های منتشرشده</h2></div><Link to="/library">آرشیو کامل</Link></div>
        <div className="album-grid">{latestAlbums.map((album) => <AlbumCard key={album.id} album={album} />)}</div>
      </section>

      <section className="section-block">
        <div className="section-head"><div><span className="eyebrow">محبوب این روزها</span><h2>آهنگ‌های پرشنونده</h2></div></div>
        <div className="track-list">{trending.map((track) => <TrackCard key={track.id} track={track} queueIds={queueIds} compact />)}</div>
      </section>

      {canAccessEarlyRelease(currentUser.subscription) && (
        <section className="section-block early-section">
          <div className="section-head"><div><span className="eyebrow gold-text">ویژه طلایی</span><h2>دسترسی زودهنگام</h2><p>قبل از انتشار عمومی گوش کنید.</p></div></div>
          <div className="track-list">{early.map((track) => <TrackCard key={track.id} track={track} queueIds={early.map((t) => t.id)} compact />)}</div>
        </section>
      )}

      {['support', 'admin'].includes(currentUser.role) && (
        <section className="soft-card role-note"><strong>نقش مدیریتی فعال است.</strong><span>برای تیکت‌ها، احراز هویت و گزارش‌های مالی به داشبورد بروید.</span><Link to="/dashboard">باز کردن داشبورد</Link></section>
      )}
    </div>
  );
}
