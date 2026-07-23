import React, { useMemo, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { isBackoffice, canUseArtistStudio } from '../utils/permissions';
import MusicPlayer from './MusicPlayer';

const copy = {
  fa: {
    home: 'خانه', library: 'آلبوم‌ها و تک‌آهنگ‌ها', playlists: 'پلی‌لیست‌ها', profile: 'نمایه من', settings: 'تنظیمات', notifications: 'اعلانات', studio: 'مدیریت آثار', dashboard: 'داشبورد مدیریت', logout: 'خروج', search: 'جستجو در موسیقی…',
  },
  en: {
    home: 'Home', library: 'Music library', playlists: 'Playlists', profile: 'My profile', settings: 'Settings', notifications: 'Notifications', studio: 'Artist studio', dashboard: 'Backoffice', logout: 'Logout', search: 'Search music…',
  },
};

export default function Layout() {
  const { currentUser, notifications, logout, settings, toast } = useApp();
  const [mobileNav, setMobileNav] = useState(false);
  const lang = settings.language === 'en' ? 'en' : 'fa';
  const t = copy[lang];
  const unread = notifications.filter((n) => n.userId === currentUser?.id && !n.read).length;
  const links = useMemo(() => {
    const base = [
      ['/', t.home, '⌂'],
      ['/library', t.library, '♫'],
      ['/playlists', t.playlists, '☷'],
      ['/profile', t.profile, '◉'],
      ['/notifications', t.notifications, '●'],
      ['/settings', t.settings, '⚙'],
    ];
    if (canUseArtistStudio(currentUser)) base.splice(3, 0, ['/studio', t.studio, '♬']);
    if (isBackoffice(currentUser?.role)) base.splice(3, 0, ['/dashboard', t.dashboard, '▦']);
    return base;
  }, [currentUser, t]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>
        <Link to="/" className="brand" onClick={() => setMobileNav(false)}>
          <span className="brand-mark">♪</span><span>Spotune</span>
        </Link>
        <nav>
          {links.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileNav(false)}>
              <span>{icon}</span><span>{label}</span>{to === '/notifications' && unread > 0 && <b className="nav-badge">{unread.toLocaleString('fa-IR')}</b>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <img src={currentUser?.avatar || '/covers/default-avatar.svg'} alt="" />
          <div><strong>{currentUser?.displayName}</strong><span>{currentUser?.role}</span></div>
          <button className="icon-button" title={t.logout} onClick={logout}>↪</button>
        </div>
      </aside>

      {mobileNav && <button aria-label="بستن منو" className="mobile-overlay" onClick={() => setMobileNav(false)} />}

      <div className="app-main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMobileNav(true)}>☰</button>
          <Link className="mobile-brand" to="/">Spotune</Link>
          <div className="top-search">
            <span>⌕</span>
            <input placeholder={t.search} onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) window.location.href = `/library?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
            }} />
          </div>
          <Link className="top-profile" to="/profile">
            <span>{currentUser?.displayName}</span>
            <img src={currentUser?.avatar || '/covers/default-avatar.svg'} alt="" />
          </Link>
        </header>
        <main className="page-container"><Outlet /></main>
      </div>

      <MusicPlayer />
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
