import React, { useMemo, useState } from 'react';
import { useApp } from '../store/AppContext';
import { formatDate, formatMoney } from '../utils/domain';
import { isAdmin, isBackoffice } from '../utils/permissions';
import EmptyState from '../components/EmptyState';

export default function DashboardPage() {
  const { currentUser, artistRequests, tickets, finance, users, prices, reviewArtistRequest, respondTicket, settleFinance, updatePrices } = useApp();
  const admin = isAdmin(currentUser.role);
  const [tab, setTab] = useState('verification');
  const [ticketId, setTicketId] = useState(tickets[0]?.id || '');
  const [reply, setReply] = useState('');
  const [draftPrices, setDraftPrices] = useState(prices);

  if (!isBackoffice(currentUser.role)) return <EmptyState title="دسترسی غیرمجاز" text="این صفحه فقط برای پشتیبان و مدیر سامانه قابل مشاهده است." />;

  const tabs = [
    ['verification', 'تایید هنرمندان'],
    ['tickets', 'تیکت‌ها'],
    ...(admin ? [['audit', 'حسابرسی'], ['subscriptions', 'اشتراک‌ها و گزارش‌ها']] : []),
  ];
  const selectedTicket = tickets.find((t) => t.id === ticketId);
  const listeners = users.filter((u) => u.role === 'listener');
  const dist = useMemo(() => ({
    basic: listeners.filter((u) => u.subscription === 'basic').length,
    silver: listeners.filter((u) => u.subscription === 'silver').length,
    gold: listeners.filter((u) => u.subscription === 'gold').length,
  }), [listeners]);
  const total = Math.max(1, dist.basic + dist.silver + dist.gold);
  const basicDeg = (dist.basic / total) * 360;
  const silverDeg = basicDeg + (dist.silver / total) * 360;
  const monthlyRevenue = dist.silver * prices.silver + dist.gold * prices.gold;

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-nav">
        <div><span className="eyebrow">پنل {admin ? 'مدیر سامانه' : 'پشتیبان'}</span><h2>داشبورد مدیریت</h2></div>
        {tabs.map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}
        {!admin && <p className="info-note">پشتیبان فقط به تیکت‌ها و احراز هویت هنرمندان دسترسی دارد.</p>}
      </aside>

      <div className="dashboard-content">
        {tab === 'verification' && (
          <section className="panel-card">
            <div className="section-head"><div><span className="eyebrow">احراز هویت</span><h1>درخواست‌های تایید هنرمندان</h1></div></div>
            <div className="responsive-table"><table><thead><tr><th>نام هنری</th><th>ایمیل</th><th>تاریخ</th><th>نمونه‌کار</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody>{artistRequests.map((r) => <tr key={r.id}><td><strong>{r.stageName}</strong></td><td>{r.email}</td><td>{formatDate(r.createdAt)}</td><td><a href={r.samples.startsWith('http') ? r.samples : '#'} target="_blank" rel="noreferrer">مشاهده نمونه‌کار</a></td><td><span className={`status ${r.status}`}>{r.status === 'pending' ? 'در انتظار تایید' : r.status === 'approved' ? 'تایید شده' : 'رد شده'}</span>{r.reason && <small className="block muted">{r.reason}</small>}</td><td>{r.status === 'pending' ? <div className="button-row nowrap"><button className="success-button small" onClick={() => reviewArtistRequest(r.id, true)}>Approve / تایید</button><button className="danger-button small" onClick={() => { const reason = window.prompt('علت رد درخواست:'); if (reason !== null) reviewArtistRequest(r.id, false, reason); }}>Reject / رد</button></div> : '—'}</td></tr>)}</tbody></table></div>
          </section>
        )}

        {tab === 'tickets' && (
          <section className="ticket-workspace">
            <div className="ticket-list panel-card"><div className="section-head"><h2>تیکت‌های پشتیبانی</h2></div>{tickets.map((t) => <button key={t.id} className={ticketId === t.id ? 'active' : ''} onClick={() => setTicketId(t.id)}><div><strong>#{t.id} · {t.subject}</strong><span>{t.userName}</span></div><span className={`status ${t.status}`}>{t.status === 'open' ? 'باز' : t.status === 'answered' ? 'پاسخ داده شده' : 'بسته شده'}</span></button>)}</div>
            <div className="ticket-chat panel-card">{selectedTicket ? <><div className="section-head"><div><span className="eyebrow">تیکت #{selectedTicket.id}</span><h2>{selectedTicket.subject}</h2><p>{selectedTicket.userName} · {formatDate(selectedTicket.createdAt)}</p></div></div><div className="chat-box">{selectedTicket.messages.map((m, i) => <div key={i} className={`chat-message ${m.from}`}><span>{m.from === 'user' ? selectedTicket.userName : 'پشتیبان'}</span><p>{m.text}</p></div>)}</div><form className="reply-box" onSubmit={(e) => { e.preventDefault(); respondTicket(selectedTicket.id, reply); setReply(''); }}><textarea rows="3" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="پاسخ خود را بنویسید…" /><div className="button-row"><button className="primary-button">ارسال پاسخ</button><button type="button" className="secondary-button" onClick={() => { if (reply.trim()) { respondTicket(selectedTicket.id, reply, true); setReply(''); } else respondTicket(selectedTicket.id, 'تیکت توسط پشتیبان بسته شد.', true); }}>پاسخ و بستن</button></div></form></> : <EmptyState title="تیکتی انتخاب نشده" />}</div>
          </section>
        )}

        {tab === 'audit' && admin && (
          <section className="panel-card">
            <div className="section-head"><div><span className="eyebrow">مالی ماه جاری</span><h1>حسابرسی و پاداش هنرمندان</h1></div></div>
            <div className="responsive-table"><table><thead><tr><th>هنرمند / شناسه</th><th>شنوندگان منحصربه‌فرد</th><th>کل استریم</th><th>پاداش محاسبه‌شده</th><th>وضعیت پرداخت</th><th>عملیات</th></tr></thead><tbody>{finance.map((f) => { const artist = users.find((u) => u.id === f.artistId); return <tr key={f.artistId}><td><strong>{artist?.stageName || artist?.displayName}</strong><small className="block muted">{artist?.username}</small></td><td>{f.uniqueListeners.toLocaleString('fa-IR')}</td><td>{f.streams.toLocaleString('fa-IR')}</td><td>{formatMoney(f.reward)} تومان</td><td><span className={`status ${f.status}`}>{f.status === 'pending' ? 'در انتظار پرداخت' : 'تسویه شده'}</span></td><td>{f.status === 'pending' ? <button className="success-button small" onClick={() => settleFinance(f.artistId)}>تایید تسویه حساب</button> : '—'}</td></tr>; })}</tbody></table></div>
          </section>
        )}

        {tab === 'subscriptions' && admin && (
          <div className="page-stack">
            <section className="panel-card"><div className="section-head"><div><span className="eyebrow">قیمت‌گذاری پویا</span><h1>کنترل قیمت اشتراک‌ها</h1><p>بدون تغییر در کد، قیمت‌ها را در داده‌های ماک بروزرسانی کنید.</p></div></div><form className="price-form" onSubmit={(e) => { e.preventDefault(); updatePrices(draftPrices); }}><label>اشتراک نقره‌ای (تومان)<input type="number" min="0" required value={draftPrices.silver} onChange={(e) => setDraftPrices((v) => ({ ...v, silver: e.target.value }))} /></label><label>اشتراک طلایی (تومان)<input type="number" min="0" required value={draftPrices.gold} onChange={(e) => setDraftPrices((v) => ({ ...v, gold: e.target.value }))} /></label><button className="primary-button">بروزرسانی قیمت‌ها</button></form></section>
            <section className="report-grid"><article className="panel-card revenue-widget"><span>درآمد برآوردی فروش اشتراک در ماه جاری</span><strong>{formatMoney(monthlyRevenue)} تومان</strong><small>بر مبنای کاربران دمو و قیمت فعلی</small></article><article className="panel-card pie-widget"><div><span className="eyebrow">توزیع کاربران</span><h2>سطوح اشتراک</h2><ul><li><span className="dot basic-dot" />پایه: {dist.basic.toLocaleString('fa-IR')}</li><li><span className="dot silver-dot" />نقره‌ای: {dist.silver.toLocaleString('fa-IR')}</li><li><span className="dot gold-dot" />طلایی: {dist.gold.toLocaleString('fa-IR')}</li></ul></div><div className="pie-chart" style={{ '--basic-deg': `${basicDeg}deg`, '--silver-deg': `${silverDeg}deg` }}><span>{total.toLocaleString('fa-IR')}<small>کاربر</small></span></div></article></section>
          </div>
        )}
      </div>
    </div>
  );
}
