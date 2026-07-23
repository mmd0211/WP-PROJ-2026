import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
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
  const profile = users.find((u) => u.id === (id || currentUser.id));
  const isOwn = profile?.id === currentUser.id;
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(() => ({ displayName: profile?.displayName || '', birthDate: profile?.birthDate || '', gender: profile?.gender || 'other', avatar: profile?.avatar || '' }));
  const following = currentUser.following?.includes(profile?.id);
  const followerUsers = useMemo(() => (profile?.followers || []).map((uid) => users.find((u) => u.id === uid)).filter(Boolean), [profile, users]);
  const followingUsers = useMemo(() => (profile?.following || []).map((uid) => users.find((u) => u.id === uid)).filter(Boolean), [profile, users]);

  if (!profile) return <div className="empty-state"><h2>User not found.</h2><Link to="/">Home</Link></div>;
  if (profile.role === 'artist' && !isOwn) return <div className="empty-state"><h2>This is an artist account.</h2><Link to={`/artists/${profile.id}`}>Open artist profile</Link></div>;

  const save = (e) => {
    e.preventDefault();
    const result = updateProfile(profile.id, form);
    if (!result.ok) return setError(result.message);
    setError('');
    setEditing(false);
  };

  return (
    <div className="page-stack">
      <section className="profile-header-card">
        <div className="avatar-wrap"><img src={profile.avatar || '/covers/default-avatar.svg'} alt={`Profile image of ${profile.displayName}`} /><span className={`subscription-ring ${profile.subscription}`}></span></div>
        <div className="profile-heading">
          <span className="eyebrow">User Profile</span>
          <h1>{profile.displayName}</h1>
          <p className="username">@{profile.username}</p>
          <div className="profile-pills"><span className={`pill ${profile.subscription}`}>Plan: {subscriptionLabel(profile.subscription)}</span><span className="pill">{profile.role === 'listener' ? 'Listener' : profile.role}</span></div>
        </div>
        <div className="profile-actions">
          {isOwn ? <button className="primary-button" onClick={() => setEditing((v) => !v)}>{editing ? 'Cancel' : 'Edit profile'}</button> : <button className={following ? 'secondary-button' : 'primary-button'} onClick={() => toggleFollow(profile.id)}>{following ? 'Unfollow' : 'Follow'}</button>}
        </div>
      </section>

      <div className="stat-grid four">
        <div className="stat-card"><span>Followers</span><strong>{(profile.followers?.length || 0).toLocaleString('en-US')}</strong></div>
        <div className="stat-card"><span>Following</span><strong>{(profile.following?.length || 0).toLocaleString('en-US')}</strong></div>
        <div className="stat-card"><span>Streams today</span><strong>{(profile.streamsToday || 0).toLocaleString('en-US')}</strong></div>
        <div className="stat-card"><span>Subscription</span><strong>{subscriptionLabel(profile.subscription)}</strong></div>
      </div>

      {editing && isOwn && (
        <section className="panel-card">
          <div className="section-head"><h2>Profile Management</h2><span>Changes are stored in Local Storage.</span></div>
          <form className="form-stack" onSubmit={save}>
            <div className="form-two"><label>Display name<input required value={form.displayName} onChange={(e) => setForm((v) => ({ ...v, displayName: e.target.value }))} /></label><label>System username<input value={profile.username} disabled /></label></div>
            <div className="form-two"><label>Birth date<input type="date" value={form.birthDate || ''} onChange={(e) => setForm((v) => ({ ...v, birthDate: e.target.value }))} /></label><label>Gender<select value={form.gender || 'other'} onChange={(e) => setForm((v) => ({ ...v, gender: e.target.value }))}><option value="female">Female</option><option value="male">Male</option><option value="other">Other / Prefer not to say</option></select></label></div>
            <label>Profile image<input type="file" accept="image/*" disabled={!canChangeAvatar(profile.subscription)} onChange={(e) => readImage(e.target.files?.[0], (data, err) => { if (err) setError(err); else { setError(''); setForm((v) => ({ ...v, avatar: data })); } })} /></label>
            {!canChangeAvatar(profile.subscription) && <p className="warning-note">Profile image uploads and changes are unavailable on the Basic plan.</p>}
            {error && <div className="form-error">{error}</div>}
            <button className="primary-button">Save changes</button>
          </form>
        </section>
      )}

      <div className="split-grid">
        <section className="panel-card"><h2>Personal Information</h2><dl className="detail-list"><div><dt>Email</dt><dd>{profile.email}</dd></div><div><dt>Username</dt><dd>@{profile.username}</dd></div><div><dt>Birth date</dt><dd>{profile.birthDate ? formatDate(profile.birthDate) : 'Not provided'}</dd></div><div><dt>Gender</dt><dd>{profile.gender === 'female' ? 'Female' : profile.gender === 'male' ? 'Male' : 'Other / Unknown'}</dd></div></dl></section>
        <section className="panel-card"><h2>Connections</h2><div className="connection-list"><strong>Followers</strong>{followerUsers.length ? followerUsers.map((u) => <Link key={u.id} to={u.role === 'artist' ? `/artists/${u.id}` : `/users/${u.id}`}>{u.displayName}</Link>) : <span className="muted">No users yet.</span>}<strong>Following</strong>{followingUsers.length ? followingUsers.map((u) => <Link key={u.id} to={u.role === 'artist' ? `/artists/${u.id}` : `/users/${u.id}`}>{u.displayName}</Link>) : <span className="muted">No users yet.</span>}</div></section>
      </div>
    </div>
  );
}
