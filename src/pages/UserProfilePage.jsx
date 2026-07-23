import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { canChangeAvatar, subscriptionLabel } from '../utils/permissions';
import { formatDate } from '../utils/domain';

function readImage(file, callback) {
  if (!file) return;
  if (file.size > 900_000) return callback(null, 'برای نسخه ماک تصویر کمتر از ۹۰۰KB انتخاب کنید.');
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result), null);
  reader.onerror = () => callback(null, 'خواندن تصویر ناموفق بود.');
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

  if (!profile) return <div className="empty-state"><h2>کاربر پیدا نشد.</h2><Link to="/">خانه</Link></div>;
  if (profile.role === 'artist' && !isOwn) return <div className="empty-state"><h2>این حساب هنرمند است.</h2><Link to={`/artists/${profile.id}`}>رفتن به نمایه هنرمند</Link></div>;

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
        <div className="avatar-wrap"><img src={profile.avatar || '/covers/default-avatar.svg'} alt={`عکس ${profile.displayName}`} /><span className={`subscription-ring ${profile.subscription}`}></span></div>
        <div className="profile-heading">
          <span className="eyebrow">نمایه کاربر</span>
          <h1>{profile.displayName}</h1>
          <p className="username">@{profile.username}</p>
          <div className="profile-pills"><span className={`pill ${profile.subscription}`}>اشتراک {subscriptionLabel(profile.subscription)}</span><span className="pill">{profile.role === 'listener' ? 'شنونده' : profile.role}</span></div>
        </div>
        <div className="profile-actions">
          {isOwn ? <button className="primary-button" onClick={() => setEditing((v) => !v)}>{editing ? 'انصراف' : 'ویرایش نمایه'}</button> : <button className={following ? 'secondary-button' : 'primary-button'} onClick={() => toggleFollow(profile.id)}>{following ? 'لغو دنبال‌کردن' : 'دنبال‌کردن'}</button>}
        </div>
      </section>

      <div className="stat-grid four">
        <div className="stat-card"><span>دنبال‌کننده</span><strong>{(profile.followers?.length || 0).toLocaleString('fa-IR')}</strong></div>
        <div className="stat-card"><span>دنبال‌شونده</span><strong>{(profile.following?.length || 0).toLocaleString('fa-IR')}</strong></div>
        <div className="stat-card"><span>استریم امروز</span><strong>{(profile.streamsToday || 0).toLocaleString('fa-IR')}</strong></div>
        <div className="stat-card"><span>نوع اشتراک</span><strong>{subscriptionLabel(profile.subscription)}</strong></div>
      </div>

      {editing && isOwn && (
        <section className="panel-card">
          <div className="section-head"><h2>مدیریت نمایه</h2><span>تغییرات در Local Storage ذخیره می‌شوند.</span></div>
          <form className="form-stack" onSubmit={save}>
            <div className="form-two"><label>نام نمایشی<input required value={form.displayName} onChange={(e) => setForm((v) => ({ ...v, displayName: e.target.value }))} /></label><label>نام کاربری سامانه<input value={profile.username} disabled /></label></div>
            <div className="form-two"><label>تاریخ تولد<input type="date" value={form.birthDate || ''} onChange={(e) => setForm((v) => ({ ...v, birthDate: e.target.value }))} /></label><label>جنسیت<select value={form.gender || 'other'} onChange={(e) => setForm((v) => ({ ...v, gender: e.target.value }))}><option value="female">زن</option><option value="male">مرد</option><option value="other">سایر/ترجیح می‌دهم نگویم</option></select></label></div>
            <label>عکس نمایه<input type="file" accept="image/*" disabled={!canChangeAvatar(profile.subscription)} onChange={(e) => readImage(e.target.files?.[0], (data, err) => { if (err) setError(err); else { setError(''); setForm((v) => ({ ...v, avatar: data })); } })} /></label>
            {!canChangeAvatar(profile.subscription) && <p className="warning-note">طبق محدودیت اشتراک پایه، امکان آپلود یا تغییر عکس نمایه فعال نیست.</p>}
            {error && <div className="form-error">{error}</div>}
            <button className="primary-button">ذخیره تغییرات</button>
          </form>
        </section>
      )}

      <div className="split-grid">
        <section className="panel-card"><h2>اطلاعات شخصی</h2><dl className="detail-list"><div><dt>ایمیل</dt><dd>{profile.email}</dd></div><div><dt>نام کاربری</dt><dd>@{profile.username}</dd></div><div><dt>تاریخ تولد</dt><dd>{profile.birthDate ? formatDate(profile.birthDate) : 'ثبت نشده'}</dd></div><div><dt>جنسیت</dt><dd>{profile.gender === 'female' ? 'زن' : profile.gender === 'male' ? 'مرد' : 'سایر/نامشخص'}</dd></div></dl></section>
        <section className="panel-card"><h2>ارتباطات</h2><div className="connection-list"><strong>دنبال‌کننده‌ها</strong>{followerUsers.length ? followerUsers.map((u) => <Link key={u.id} to={u.role === 'artist' ? `/artists/${u.id}` : `/users/${u.id}`}>{u.displayName}</Link>) : <span className="muted">هنوز کسی نیست.</span>}<strong>دنبال‌شونده‌ها</strong>{followingUsers.length ? followingUsers.map((u) => <Link key={u.id} to={u.role === 'artist' ? `/artists/${u.id}` : `/users/${u.id}`}>{u.displayName}</Link>) : <span className="muted">هنوز کسی نیست.</span>}</div></section>
      </div>
    </div>
  );
}
