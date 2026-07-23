import React, { useMemo, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
import { isBackoffice, canUseArtistStudio } from '../utils/permissions';
import MusicPlayer from './MusicPlayer';

export default function Layout() {
  const { currentUser, notifications, logout, toast } = useApp();
  const { t, number } = useI18n();
  const [mobileNav, setMobileNav] = useState(false);
  const unread = notifications.filter((n) => n.userId === currentUser?.id && !n.read).length;
  const links = useMemo(() => {
    const base = [
      ['/', t('Home'), '⌂'],
      ['/library', t('Music Library'), '♫'],
      ['/playlists', t('Playlists'), '☷'],
      ['/profile', t('My Profile'), '◉'],
      ['/notifications', t('Notifications'), '●'],
      ['/settings', t('Settings'), '⚙'],
    ];
    if (canUseArtistStudio(currentUser)) base.splice(3, 0, ['/studio', t('Artist Studio'), '♬']);
    if (isBackoffice(currentUser?.role)) base.splice(3, 0, ['/dashboard', t('Backoffice'), '▦']);
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
              <span>{icon}</span><span>{label}</span>{to === '/notifications' && unread > 0 && <b className="nav-badge">{number(unread)}</b>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <img src={currentUser?.avatar || '/covers/default-avatar.svg'} alt="" />
          <div><strong>{t(currentUser?.displayName || '')}</strong><span>{t(currentUser?.role || '')}</span></div>
          <button className="icon-button" title={t('Logout')} onClick={logout}>↪</button>
        </div>
      </aside>

      {mobileNav && <button aria-label={t('Close menu')} className="mobile-overlay" onClick={() => setMobileNav(false)} />}

      <div className="app-main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMobileNav(true)}>☰</button>
          <Link className="mobile-brand" to="/">Spotune</Link>
          <div className="top-search">
            <span>⌕</span>
            <input placeholder={t('Search music…')} onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) window.location.href = `/library?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
            }} />
          </div>
          <Link className="top-profile" to="/profile">
            <span>{t(currentUser?.displayName || '')}</span>
            <img src={currentUser?.avatar || '/covers/default-avatar.svg'} alt="" />
          </Link>
        </header>
        <main className="page-container"><Outlet /></main>
      </div>

      <MusicPlayer />
      {toast && <div className={`toast ${toast.type}`}>{t(toast.message)}</div>}
    </div>
  );
}
