import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/domain';

export default function NotificationsPage() {
  const { currentUser, notifications, settings, markNotification, markAllNotifications, deleteNotification } = useApp();
  const { t, number } = useI18n();
  const mine = notifications.filter((notification) => notification.userId === currentUser.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const visible = settings.notificationLimit === 'all' ? mine : mine.slice(0, Number(settings.notificationLimit || 10));
  const unreadCount = mine.filter((notification) => !notification.read).length;

  return (
    <div className="page-stack">
      <div className="page-title action-title"><div><span className="eyebrow">{t('Notification Center')}</span><h1>{t('Notifications')}</h1><p>{t(`${unreadCount} unread notifications`)}</p></div>{mine.length > 0 && <button className="secondary-button" onClick={markAllNotifications}>{t('Mark all as read')}</button>}</div>
      {!visible.length ? <EmptyState icon="🔔" title={t('No notifications')} text={t('New releases, subscription reminders, and role-related events will appear here.')} /> : (
        <div className="notification-list">
          {visible.map((notification) => (
            <article key={notification.id} className={`notification-card ${!notification.read ? 'unread' : ''}`}>
              <div className="notification-icon">{notification.type === 'release' ? '♫' : notification.type === 'subscription' ? '◈' : notification.type === 'finance' ? '⌁' : notification.type === 'ticket' ? '✉' : '✓'}</div>
              <div className="notification-copy"><div className="notification-title-row"><h3>{t(notification.title)}</h3>{!notification.read && <span className="unread-dot" />}</div><p>{t(notification.body)}</p><small>{formatDate(notification.createdAt)}</small>{notification.link && <Link to={notification.link} onClick={() => markNotification(notification.id, true)}>{t('View details →')}</Link>}</div>
              <div className="notification-actions">{!notification.read && <button className="secondary-button small" onClick={() => markNotification(notification.id, true)}>{t('Mark as read')}</button>}<button className="icon-button danger-text" onClick={() => deleteNotification(notification.id)} title={t('Delete notification')}>⌫</button></div>
            </article>
          ))}
        </div>
      )}
      {visible.length < mine.length && <p className="muted centered">{t(`Because of your notification limit, only the first ${visible.length} notifications are shown.`)}</p>}
    </div>
  );
}
