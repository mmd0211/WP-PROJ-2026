import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/domain';

export default function NotificationsPage() {
  const { currentUser, notifications, settings, markNotification, markAllNotifications, deleteNotification } = useApp();
  const mine = notifications.filter((n) => n.userId === currentUser.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const visible = settings.notificationLimit === 'all' ? mine : mine.slice(0, Number(settings.notificationLimit || 10));
  const unreadCount = mine.filter((n) => !n.read).length;

  return (
    <div className="page-stack">
      <div className="page-title action-title"><div><span className="eyebrow">Notification Center</span><h1>Notifications</h1><p>{unreadCount.toLocaleString('en-US')} unread notifications</p></div>{mine.length > 0 && <button className="secondary-button" onClick={markAllNotifications}>Mark all as read</button>}</div>
      {!visible.length ? <EmptyState icon="🔔" title="No notifications" text="New releases, subscription reminders, and role-related events will appear here." /> : (
        <div className="notification-list">
          {visible.map((n) => (
            <article key={n.id} className={`notification-card ${!n.read ? 'unread' : ''}`}>
              <div className="notification-icon">{n.type === 'release' ? '♫' : n.type === 'subscription' ? '◈' : n.type === 'finance' ? '⌁' : n.type === 'ticket' ? '✉' : '✓'}</div>
              <div className="notification-copy"><div className="notification-title-row"><h3>{n.title}</h3>{!n.read && <span className="unread-dot" />}</div><p>{n.body}</p><small>{formatDate(n.createdAt)}</small>{n.link && <Link to={n.link} onClick={() => markNotification(n.id, true)}>View details →</Link>}</div>
              <div className="notification-actions">{!n.read && <button className="secondary-button small" onClick={() => markNotification(n.id, true)}>Mark as read</button>}<button className="icon-button danger-text" onClick={() => deleteNotification(n.id)} title="Delete notification">⌫</button></div>
            </article>
          ))}
        </div>
      )}
      {visible.length < mine.length && <p className="muted centered">Because of your notification limit, only the first {visible.length.toLocaleString('en-US')} notifications are shown.</p>}
    </div>
  );
}
