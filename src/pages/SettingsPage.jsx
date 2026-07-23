import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { useI18n } from '../i18n/useI18n';
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
  const { language, t, number } = useI18n();
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

  const changeLanguage = (nextLanguage) => {
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextLanguage === 'fa' ? 'rtl' : 'ltr';
    updateSettings({ language: nextLanguage });
  };

  const planLabel = t(subscriptionLabel(currentUser.subscription));

  return (
    <div className="page-stack settings-page">
      <div className="page-title"><div><span className="eyebrow">{t('Preferences')}</span><h1>{t('Application Settings')}</h1><p>{t('Phase 1 settings are stored in Local Storage.')}</p></div></div>

      <section className="panel-card settings-section">
        <div><h2>{t('Notifications')}</h2><p>{t('Choose how many notifications are displayed on the Notifications page.')}</p></div>
        <label className="inline-field">{t('Display limit')}<select value={settings.notificationLimit} onChange={(e) => updateSettings({ notificationLimit: e.target.value === 'all' ? 'all' : Number(e.target.value) })}><option value="5">{t('5 notifications')}</option><option value="10">{t('10 notifications')}</option><option value="20">{t('20 notifications')}</option><option value="all">{t('Unlimited')}</option></select></label>
      </section>

      <section className="panel-card settings-section">
        <div><h2>{t('UI Sound')}</h2><p>{t('Adjust the volume of interface sound effects.')}</p></div>
        <div className="sound-setting"><input aria-label={t('UI Sound')} type="range" min="0" max="1" step="0.05" value={settings.uiVolume} onChange={(e) => updateSettings({ uiVolume: Number(e.target.value) })} /><span>{number(Math.round(settings.uiVolume * 100))}{language === 'fa' ? '٪' : '%'}</span><button className="secondary-button" onClick={() => playTestTone(settings.uiVolume)}>{t('Test sound')}</button></div>
      </section>

      <section className="panel-card settings-section">
        <div><h2>{t('Interface Language')}</h2><p>{t('Switch the entire interface language and text direction.')}</p></div>
        <div className="segmented language-segmented" dir="ltr">
          <button className={language === 'fa' ? 'active' : ''} onClick={() => changeLanguage('fa')}>{t('Persian')}</button>
          <button className={language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>{t('English')}</button>
        </div>
      </section>

      <section className="panel-card subscription-settings">
        <div className="section-head"><div><h2>{t('Subscription')}</h2><p>{t('Current plan:')} <strong>{planLabel}</strong></p></div><span className={`pill ${currentUser.subscription}`}>{planLabel}</span></div>
        <div className="plan-grid">
          <article><span>{t('Basic')}</span><strong>{t('Free')}</strong><small>{t('60 streams/day · 6 playlists')}</small></article>
          <article><span>{t('Silver')}</span><strong>{formatMoney(prices.silver)} {t('IRR')}</strong><small>{t('Unlimited streams · 100 playlists · downloads')}</small></article>
          <article><span>{t('Gold')}</span><strong>{formatMoney(prices.gold)} {t('IRR')}</strong><small>{t('All features + Early Access and statistics')}</small></article>
        </div>
        <button className="primary-button inline" onClick={() => setPaymentOpen(true)}>{t('Upgrade or change plan')}</button>
      </section>

      {!['support', 'admin'].includes(currentUser.role) && (
        <section className="panel-card">
          <div className="section-head"><div><h2>{t('Support')}</h2><p>{t('Send a question to the support team.')}</p></div></div>
          <form className="form-stack" onSubmit={(e) => { e.preventDefault(); const result = createTicket(ticket.subject, ticket.text); if (!result.ok) return setError(result.message); setError(''); setTicket({ subject: '', text: '' }); }}>
            <label>{t('Subject')}<input value={ticket.subject} onChange={(e) => setTicket((v) => ({ ...v, subject: e.target.value }))} placeholder={t('For example: playlist issue')} /></label>
            <label>{t('Message')}<textarea rows="4" value={ticket.text} onChange={(e) => setTicket((v) => ({ ...v, text: e.target.value }))} placeholder={t('Describe your question or problem…')} /></label>
            <button className="secondary-button inline">{t('Submit support ticket')}</button>
          </form>
        </section>
      )}

      <section className="panel-card settings-section danger-zone">
        <div><h2>{t('Delete Account')}</h2><p>{t('This removes your mock account and playlist data from the browser.')}</p></div>
        <button className="danger-button" onClick={() => setDeleteOpen(true)}>{t('Delete account')}</button>
      </section>

      <section className="panel-card settings-section">
        <div><h2>{t('Demo Tools')}</h2><p>{t('Restore all demo accounts, notifications, and sample data to their initial state.')}</p></div>
        <button className="secondary-button" onClick={resetDemo}>{t('Reset demo data')}</button>
      </section>

      {error && <div className="form-error">{t(error)}</div>}

      <Modal open={paymentOpen} title={t('Subscription Payment')} onClose={() => setPaymentOpen(false)}>
        <div className="center-message"><div className="phase-badge">{t('Phase 2')}</div><p>{t('Real payment processing is not part of Phase 1. This handoff point is reserved for Django and payment-gateway integration in Phase 2.')}</p><button className="primary-button" onClick={() => setPaymentOpen(false)}>{t('Got it')}</button></div>
      </Modal>

      <Modal open={deleteOpen} title={t('Delete account')} onClose={() => setDeleteOpen(false)}>
        <div className="center-message"><div className="danger-mark">!</div><p>{t('This action cannot be undone in the mock application unless you reset the demo data. Continue?')}</p><div className="button-row"><button className="secondary-button" onClick={() => setDeleteOpen(false)}>{t('Cancel')}</button><button className="danger-button" onClick={confirmDelete}>{t('Yes, delete account')}</button></div></div>
      </Modal>
    </div>
  );
}
