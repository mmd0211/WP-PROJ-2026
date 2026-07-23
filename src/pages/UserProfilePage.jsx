import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
import { canChangeAvatar, subscriptionLabel } from '../utils/permissions';
import { formatDate } from '../utils/domain';

function readImage(file, callback) {
  if (!file) return;
  if (file.size > 900_000) return callback(null, 'Choose an image smaller than 900 KB for the mock application.');
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result), null);
  reader.onerror = () => callback(null, 'Failed to read the image.');
  reader.readAsDataURL(file);
}

export default function UserProfilePage() {
  const { id } = useParams();
  const { currentUser, users, updateProfile, toggleFollow } = useApp();
  const { t, number } = useI18n();
  const profile = users.find((user) => user.id === (id || currentUser.id));
  const isOwn = profile?.id === currentUser.id;
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(() => ({ displayName: profile?.displayName || '', birthDate: profile?.birthDate || '', gender: profile?.gender || 'other', avatar: profile?.avatar || '' }));
  const following = currentUser.following?.includes(profile?.id);
  const followerUsers = useMemo(() => (profile?.followers || []).map((uid) => users.find((user) => user.id === uid)).filter(Boolean), [profile, users]);
  const followingUsers = useMemo(() => (profile?.following || []).map((uid) => users.find((user) => user.id === uid)).filter(Boolean), [profile, users]);

  if (!profile) return <div className="empty-state"><h2>{t('User not found.')}</h2><Link to="/">{t('Home')}</Link></div>;
  if (profile.role === 'artist' && !isOwn) return <div className="empty-state"><h2>{t('This is an artist account.')}</h2><Link to={`/artists/${profile.id}`}>{t('Open artist profile')}</Link></div>;

  const save = (event) => {
    event.preventDefault();
    const result = updateProfile(profile.id, form);
    if (!result.ok) return setError(result.message);
    setError('');
    setEditing(false);
  };

  return (
    <div className="page-stack">
      <section className="profile-header-card">
        <div className="avatar-wrap"><img src={profile.avatar || '/covers/default-avatar.svg'} alt={t(`Profile image of ${profile.displayName}`)} /><span className={`subscription-ring ${profile.subscription}`}></span></div>
        <div className="profile-heading">
          <span className="eyebrow">{t('User Profile')}</span>
          <h1>{t(profile.displayName)}</h1>
          <p className="username">@{profile.username}</p>
          <div className="profile-pills"><span className={`pill ${profile.subscription}`}>{t('Plan:')} {t(subscriptionLabel(profile.subscription))}</span><span className="pill">{t(profile.role === 'listener' ? 'Listener' : profile.role)}</span></div>
        </div>
        <div className="profile-actions">
          {isOwn ? <button className="primary-button" onClick={() => setEditing((value) => !value)}>{t(editing ? 'Cancel' : 'Edit profile')}</button> : <button className={following ? 'secondary-button' : 'primary-button'} onClick={() => toggleFollow(profile.id)}>{t(following ? 'Unfollow' : 'Follow')}</button>}
        </div>
      </section>

      <div className="stat-grid four">
        <div className="stat-card"><span>{t('Followers')}</span><strong>{number(profile.followers?.length || 0)}</strong></div>
        <div className="stat-card"><span>{t('Following')}</span><strong>{number(profile.following?.length || 0)}</strong></div>
        <div className="stat-card"><span>{t('Streams today')}</span><strong>{number(profile.streamsToday || 0)}</strong></div>
        <div className="stat-card"><span>{t('Subscription')}</span><strong>{t(subscriptionLabel(profile.subscription))}</strong></div>
      </div>

      {editing && isOwn && (
        <section className="panel-card">
          <div className="section-head"><h2>{t('Profile Management')}</h2><span>{t('Changes are stored in Local Storage.')}</span></div>
          <form className="form-stack" onSubmit={save}>
            <div className="form-two"><label>{t('Display name')}<input required value={form.displayName} onChange={(event) => setForm((value) => ({ ...value, displayName: event.target.value }))} /></label><label>{t('System username')}<input value={profile.username} disabled /></label></div>
            <div className="form-two"><label>{t('Birth date')}<input type="date" value={form.birthDate || ''} onChange={(event) => setForm((value) => ({ ...value, birthDate: event.target.value }))} /></label><label>{t('Gender')}<select value={form.gender || 'other'} onChange={(event) => setForm((value) => ({ ...value, gender: event.target.value }))}><option value="female">{t('Female')}</option><option value="male">{t('Male')}</option><option value="other">{t('Other / Prefer not to say')}</option></select></label></div>
            <label>{t('Profile image')}<input type="file" accept="image/*" disabled={!canChangeAvatar(profile.subscription)} onChange={(event) => readImage(event.target.files?.[0], (data, imageError) => { if (imageError) setError(imageError); else { setError(''); setForm((value) => ({ ...value, avatar: data })); } })} /></label>
            {!canChangeAvatar(profile.subscription) && <p className="warning-note">{t('Profile image uploads and changes are unavailable on the Basic plan.')}</p>}
            {error && <div className="form-error">{t(error)}</div>}
            <button className="primary-button">{t('Save changes')}</button>
          </form>
        </section>
      )}

      <div className="split-grid">
        <section className="panel-card"><h2>{t('Personal Information')}</h2><dl className="detail-list"><div><dt>{t('Email')}</dt><dd>{profile.email}</dd></div><div><dt>{t('Username')}</dt><dd>@{profile.username}</dd></div><div><dt>{t('Birth date')}</dt><dd>{profile.birthDate ? formatDate(profile.birthDate) : t('Not provided')}</dd></div><div><dt>{t('Gender')}</dt><dd>{t(profile.gender === 'female' ? 'Female' : profile.gender === 'male' ? 'Male' : 'Other / Unknown')}</dd></div></dl></section>
        <section className="panel-card"><h2>{t('Connections')}</h2><div className="connection-list"><strong>{t('Followers')}</strong>{followerUsers.length ? followerUsers.map((user) => <Link key={user.id} to={user.role === 'artist' ? `/artists/${user.id}` : `/users/${user.id}`}>{t(user.displayName)}</Link>) : <span className="muted">{t('No users yet.')}</span>}<strong>{t('Following')}</strong>{followingUsers.length ? followingUsers.map((user) => <Link key={user.id} to={user.role === 'artist' ? `/artists/${user.id}` : `/users/${user.id}`}>{t(user.displayName)}</Link>) : <span className="muted">{t('No users yet.')}</span>}</div></section>
      </div>
    </div>
  );
}
