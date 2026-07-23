import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { formatMoney, formatDate } from '../utils/domain';
import { canUseArtistStudio } from '../utils/permissions';
import EmptyState from '../components/EmptyState';

const initialForm = {
  title: '', releaseType: 'single', albumTitle: '', albumId: '', genre: '', releaseDate: new Date().toISOString().slice(0, 10),
  collaboratorIds: [], lyrics: '', earlyAccess: false, audio: '', cover: '',
};

function fileToDataUrl(file, maxBytes = 950_000) {
  return new Promise((resolve) => {
    if (!file) return resolve({ data: '', error: '' });
    if (file.size > maxBytes) return resolve({ data: '', error: 'برای جلوگیری از پر شدن Local Storage، فایل‌های بزرگ در نسخه ماک ذخیره نمی‌شوند؛ پیش‌نمایش صوتی نمونه استفاده خواهد شد.' });
    const reader = new FileReader();
    reader.onload = () => resolve({ data: String(reader.result), error: '' });
    reader.onerror = () => resolve({ data: '', error: 'خواندن فایل ناموفق بود.' });
    reader.readAsDataURL(file);
  });
}

export default function ArtistStudioPage() {
  const { currentUser, tracks, albums, users, publishTrack, updateTrack, deleteTrack, notify } = useApp();
  const [form, setForm] = useState(initialForm);
  const [fileNote, setFileNote] = useState('');
  const [publishing, setPublishing] = useState(false);
  const myTracks = useMemo(() => tracks.filter((t) => t.artistIds.includes(currentUser.id)), [tracks, currentUser.id]);
  const myAlbums = useMemo(() => albums.filter((a) => a.artistId === currentUser.id), [albums, currentUser.id]);
  const collaborators = users.filter((u) => u.role === 'artist' && u.id !== currentUser.id && u.status === 'approved');
  const totalIncome = myTracks.reduce((s, t) => s + (t.income || 0), 0);
  const totalStreams = myTracks.reduce((s, t) => s + (t.streamCount || 0), 0);
  const totalListeners = myTracks.reduce((s, t) => s + (t.listenerCount || 0), 0);

  if (!canUseArtistStudio(currentUser)) {
    return <EmptyState icon="⌛" title="حساب هنرمند در انتظار تأیید است" text="پس از تایید پشتیبان یا مدیر، پنل مدیریت آثار برای شما فعال می‌شود. نتیجه بررسی از طریق اعلان‌ها قابل مشاهده است." />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setPublishing(true);
    const result = publishTrack({ ...form, collaboratorIds: form.collaboratorIds.filter(Boolean) });
    setPublishing(false);
    if (!result.ok) return notify(result.message, 'warning');
    setForm(initialForm);
    setFileNote('');
  };

  const handleAudio = async (file) => {
    if (!file) return;
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];
    const extOk = /\.(mp3|wav|flac)$/i.test(file.name);
    if (!allowed.includes(file.type) && !extOk) return setFileNote('فرمت مجاز: MP3 / WAV / FLAC');
    const { data, error } = await fileToDataUrl(file);
    setForm((v) => ({ ...v, audio: data || '/audio/track1.wav' }));
    setFileNote(error || `فایل صوتی «${file.name}» برای نسخه ماک آماده شد.`);
  };

  const handleCover = async (file) => {
    const { data, error } = await fileToDataUrl(file, 800_000);
    if (data) setForm((v) => ({ ...v, cover: data }));
    if (error) setFileNote(error);
  };

  return (
    <div className="page-stack">
      <div className="page-title"><div><span className="eyebrow">پنل هنرمند تاییدشده</span><h1>مدیریت آثار</h1><p>انتشار، ویرایش، حذف و مشاهده آمار آثار شما.</p></div></div>

      <div className="stat-grid three premium-stats">
        <div className="stat-card"><span>شنوندگان آثار</span><strong>{totalListeners.toLocaleString('fa-IR')}</strong></div>
        <div className="stat-card"><span>استریم‌ها</span><strong>{totalStreams.toLocaleString('fa-IR')}</strong></div>
        <div className="stat-card"><span>درآمد آثار</span><strong>{formatMoney(totalIncome)} <small>تومان</small></strong></div>
      </div>

      <section className="panel-card">
        <div className="section-head"><div><h2>انتشار اثر جدید</h2><p>اطلاعات متا، رسانه و نوع انتشار را مشخص کنید.</p></div></div>
        <form className="form-stack" onSubmit={submit}>
          <div className="form-two"><label>نام اثر<input required value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} /></label><label>نوع انتشار<select value={form.releaseType} onChange={(e) => setForm((v) => ({ ...v, releaseType: e.target.value, albumId: '' }))}><option value="single">تک‌آهنگ</option><option value="album">عضو آلبوم</option></select></label></div>

          {form.releaseType === 'album' && <div className="form-two"><label>آلبوم موجود<select value={form.albumId} onChange={(e) => setForm((v) => ({ ...v, albumId: e.target.value }))}><option value="">ساخت آلبوم جدید</option>{myAlbums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}</select></label>{!form.albumId && <label>نام آلبوم جدید<input required value={form.albumTitle} onChange={(e) => setForm((v) => ({ ...v, albumTitle: e.target.value }))} /></label>}</div>}

          <div className="form-two"><label>ژانر<input placeholder="Electronic / Indie / ..." value={form.genre} onChange={(e) => setForm((v) => ({ ...v, genre: e.target.value }))} /></label><label>تاریخ/سال انتشار<input type="date" value={form.releaseDate} onChange={(e) => setForm((v) => ({ ...v, releaseDate: e.target.value }))} /></label></div>

          <label>هنرمندان همکار<select multiple value={form.collaboratorIds} onChange={(e) => setForm((v) => ({ ...v, collaboratorIds: Array.from(e.target.selectedOptions).map((o) => o.value) }))}>{collaborators.map((a) => <option key={a.id} value={a.id}>{a.stageName || a.displayName}</option>)}</select><small>برای انتخاب چند مورد Ctrl/Cmd را نگه دارید.</small></label>
          <label>متن آهنگ<textarea rows="5" value={form.lyrics} onChange={(e) => setForm((v) => ({ ...v, lyrics: e.target.value }))} placeholder="در صورت وجود، متن آهنگ را وارد کنید…" /></label>
          <div className="form-two"><label>فایل صوتی (MP3 / WAV / FLAC)<input type="file" accept="audio/*,.mp3,.wav,.flac" onChange={(e) => handleAudio(e.target.files?.[0])} /></label><label>تصویر کاور<input type="file" accept="image/*" onChange={(e) => handleCover(e.target.files?.[0])} /></label></div>
          {fileNote && <p className="info-note">{fileNote}</p>}
          <label className="checkbox-line"><input type="checkbox" checked={form.earlyAccess} onChange={(e) => setForm((v) => ({ ...v, earlyAccess: e.target.checked }))} /><span>انتشار به صورت دسترسی زودهنگام برای کاربران طلایی</span></label>
          <button className="primary-button" disabled={publishing}>{publishing ? 'در حال انتشار…' : 'انتشار در نسخه ماک'}</button>
        </form>
      </section>

      <section className="panel-card">
        <div className="section-head"><div><h2>آثار منتشرشده</h2><p>{myTracks.length.toLocaleString('fa-IR')} اثر</p></div></div>
        {myTracks.length ? <div className="responsive-table"><table><thead><tr><th>اثر</th><th>نوع/آلبوم</th><th>ژانر</th><th>انتشار</th><th>شنونده</th><th>استریم</th><th>درآمد</th><th>عملیات</th></tr></thead><tbody>{myTracks.map((t) => {
          const album = albums.find((a) => a.id === t.albumId);
          return <tr key={t.id}><td><div className="table-media"><img src={t.cover} alt="" /><strong>{t.title}</strong></div></td><td>{album?.title || 'تک‌آهنگ'}</td><td>{t.genre}</td><td>{formatDate(t.releaseDate)}</td><td>{t.listenerCount.toLocaleString('fa-IR')}</td><td>{t.streamCount.toLocaleString('fa-IR')}</td><td>{formatMoney(t.income)} تومان</td><td><div className="button-row nowrap"><button className="secondary-button small" onClick={() => { const title = window.prompt('نام جدید اثر:', t.title); if (title?.trim()) updateTrack(t.id, { title: title.trim() }); }}>ویرایش</button><button className="danger-button small" onClick={() => window.confirm(`اثر «${t.title}» حذف شود؟`) && deleteTrack(t.id)}>حذف</button></div></td></tr>;
        })}</tbody></table></div> : <EmptyState title="اثری منتشر نشده" text="فرم بالا را تکمیل کنید تا اولین اثر در داده‌های ماک ساخته شود." />}
      </section>
    </div>
  );
}
