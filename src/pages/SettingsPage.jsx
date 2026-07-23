import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { formatMoney } from '../utils/domain';
import { subscriptionLabel } from '../utils/permissions';
import Modal from '../components/Modal';

function playTestTone(volume = 0.5) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 660;
    gain.gain.value = Math.max(0, Math.min(1, volume)) * 0.12;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch {
    // AudioContext may be unavailable in some browsers.
  }
}

export default function SettingsPage() {
  const { currentUser, settings, updateSettings, prices, deleteAccount, resetDemo, createTicket } = useApp();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState({ subject: '', text: '' });

  const confirmDelete = () => {
    const result = deleteAccount();
    if (!result.ok) return setError(result.message);
    navigate('/auth');
  };

  return (
    <div className="page-stack settings-page">
      <div className="page-title"><div><span className="eyebrow">شخصی‌سازی</span><h1>تنظیمات برنامه</h1><p>تنظیمات در فاز اول روی Local Storage ذخیره می‌شوند.</p></div></div>

      <section className="panel-card settings-section">
        <div><h2>اعلان‌ها</h2><p>تعداد اعلان‌هایی که در صفحه اعلان‌ها نمایش داده می‌شود.</p></div>
        <label className="inline-field">محدودیت نمایش<select value={settings.notificationLimit} onChange={(e) => updateSettings({ notificationLimit: e.target.value === 'all' ? 'all' : Number(e.target.value) })}><option value="5">۵ اعلان</option><option value="10">۱۰ اعلان</option><option value="20">۲۰ اعلان</option><option value="all">بدون محدودیت</option></select></label>
      </section>

      <section className="panel-card settings-section">
        <div><h2>صدای سامانه</h2><p>بلندی صدای افکت‌های رابط کاربری را تنظیم کنید.</p></div>
        <div className="sound-setting"><input aria-label="صدای سامانه" type="range" min="0" max="1" step="0.05" value={settings.uiVolume} onChange={(e) => updateSettings({ uiVolume: Number(e.target.value) })} /><span>{Math.round(settings.uiVolume * 100).toLocaleString('fa-IR')}٪</span><button className="secondary-button" onClick={() => playTestTone(settings.uiVolume)}>تست صدا</button></div>
      </section>

      <section className="panel-card settings-section">
        <div><h2>زبان رابط</h2><p>زبان و جهت کلی رابط را تغییر دهید.</p></div>
        <div className="segmented"><button className={settings.language === 'fa' ? 'active' : ''} onClick={() => updateSettings({ language: 'fa' })}>فارسی</button><button className={settings.language === 'en' ? 'active' : ''} onClick={() => updateSettings({ language: 'en' })}>English</button></div>
      </section>

      <section className="panel-card subscription-settings">
        <div className="section-head"><div><h2>اشتراک</h2><p>اشتراک فعلی: <strong>{subscriptionLabel(currentUser.subscription)}</strong></p></div><span className={`pill ${currentUser.subscription}`}>{subscriptionLabel(currentUser.subscription)}</span></div>
        <div className="plan-grid">
          <article><span>پایه</span><strong>رایگان</strong><small>۶۰ استریم/روز · ۶ پلی‌لیست</small></article>
          <article><span>نقره‌ای</span><strong>{formatMoney(prices.silver)} تومان</strong><small>استریم نامحدود · ۱۰۰ پلی‌لیست · دانلود</small></article>
          <article><span>طلایی</span><strong>{formatMoney(prices.gold)} تومان</strong><small>همه امکانات + دسترسی زودهنگام و آمار</small></article>
        </div>
        <button className="primary-button inline" onClick={() => setPaymentOpen(true)}>ارتقا یا تغییر اشتراک</button>
      </section>

      {!['support', 'admin'].includes(currentUser.role) && (
        <section className="panel-card">
          <div className="section-head"><div><h2>پشتیبانی</h2><p>سوال خود را برای تیم پشتیبانی ارسال کنید.</p></div></div>
          <form className="form-stack" onSubmit={(e) => { e.preventDefault(); const result = createTicket(ticket.subject, ticket.text); if (!result.ok) return setError(result.message); setError(''); setTicket({ subject: '', text: '' }); }}>
            <label>موضوع<input value={ticket.subject} onChange={(e) => setTicket((v) => ({ ...v, subject: e.target.value }))} placeholder="مثلا مشکل در پلی‌لیست" /></label>
            <label>شرح درخواست<textarea rows="4" value={ticket.text} onChange={(e) => setTicket((v) => ({ ...v, text: e.target.value }))} placeholder="جزئیات سوال یا مشکل را بنویسید…" /></label>
            <button className="secondary-button inline">ارسال تیکت پشتیبانی</button>
          </form>
        </section>
      )}

      <section className="panel-card settings-section danger-zone">
        <div><h2>حذف حساب کاربری</h2><p>این عملیات داده‌های ماک مربوط به حساب و پلی‌لیست‌های شما را از مرورگر حذف می‌کند.</p></div>
        <button className="danger-button" onClick={() => setDeleteOpen(true)}>حذف حساب</button>
      </section>

      <section className="panel-card settings-section">
        <div><h2>ابزار ارائه پروژه</h2><p>برای بازگرداندن همه حساب‌ها، اعلان‌ها و داده‌های نمونه به وضعیت اولیه.</p></div>
        <button className="secondary-button" onClick={resetDemo}>بازنشانی داده‌های دمو</button>
      </section>

      {error && <div className="form-error">{error}</div>}

      <Modal open={paymentOpen} title="پرداخت اشتراک" onClose={() => setPaymentOpen(false)}>
        <div className="center-message"><div className="phase-badge">فاز دوم</div><p>طبق صورت پروژه، صفحه و اتصال واقعی پرداخت جزو نیازمندی‌های فاز اول نیست. این نقطه اتصال برای ادغام با Django و درگاه پرداخت آماده نگه داشته شده است.</p><button className="primary-button" onClick={() => setPaymentOpen(false)}>متوجه شدم</button></div>
      </Modal>

      <Modal open={deleteOpen} title="حذف حساب" onClose={() => setDeleteOpen(false)}>
        <div className="center-message"><div className="danger-mark">!</div><p>این کار در نسخه ماک برگشت‌پذیر نیست، مگر با بازنشانی داده‌های دمو. ادامه می‌دهید؟</p><div className="button-row"><button className="secondary-button" onClick={() => setDeleteOpen(false)}>انصراف</button><button className="danger-button" onClick={confirmDelete}>بله، حذف شود</button></div></div>
      </Modal>
    </div>
  );
}
