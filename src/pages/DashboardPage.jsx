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

  if (!isBackoffice(currentUser.role)) return <EmptyState title="Access Denied" text="This page is available only to support agents and the system administrator." />;

  const tabs = [
    ['verification', 'Artist Verification'],
    ['tickets', 'Tickets'],
    ...(admin ? [['audit', 'Accounting'], ['subscriptions', 'Subscriptions & Reports']] : []),
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
        <div><span className="eyebrow">{admin ? 'System Administrator' : 'Support'}</span><h2>Management Dashboard</h2></div>
        {tabs.map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}
        {!admin && <p className="info-note">Support agents can access only tickets and artist verification.</p>}
      </aside>

      <div className="dashboard-content">
        {tab === 'verification' && (
          <section className="panel-card">
            <div className="section-head"><div><span className="eyebrow">Verification</span><h1>Artist Verification Requests</h1></div></div>
            <div className="responsive-table"><table><thead><tr><th>Stage name</th><th>Email</th><th>Date</th><th>Portfolio</th><th>Status</th><th>Actions</th></tr></thead><tbody>{artistRequests.map((r) => <tr key={r.id}><td><strong>{r.stageName}</strong></td><td>{r.email}</td><td>{formatDate(r.createdAt)}</td><td><a href={r.samples.startsWith('http') ? r.samples : '#'} target="_blank" rel="noreferrer">View portfolio</a></td><td><span className={`status ${r.status}`}>{r.status === 'pending' ? 'Pending approval' : r.status === 'approved' ? 'Approved' : 'Rejected'}</span>{r.reason && <small className="block muted">{r.reason}</small>}</td><td>{r.status === 'pending' ? <div className="button-row nowrap"><button className="success-button small" onClick={() => reviewArtistRequest(r.id, true)}>Approve</button><button className="danger-button small" onClick={() => { const reason = window.prompt('Rejection reason:'); if (reason !== null) reviewArtistRequest(r.id, false, reason); }}>Reject</button></div> : '—'}</td></tr>)}</tbody></table></div>
          </section>
        )}

        {tab === 'tickets' && (
          <section className="ticket-workspace">
            <div className="ticket-list panel-card"><div className="section-head"><h2>Support Tickets</h2></div>{tickets.map((t) => <button key={t.id} className={ticketId === t.id ? 'active' : ''} onClick={() => setTicketId(t.id)}><div><strong>#{t.id} · {t.subject}</strong><span>{t.userName}</span></div><span className={`status ${t.status}`}>{t.status === 'open' ? 'Open' : t.status === 'answered' ? 'Answered' : 'Closed'}</span></button>)}</div>
            <div className="ticket-chat panel-card">{selectedTicket ? <><div className="section-head"><div><span className="eyebrow">Ticket #{selectedTicket.id}</span><h2>{selectedTicket.subject}</h2><p>{selectedTicket.userName} · {formatDate(selectedTicket.createdAt)}</p></div></div><div className="chat-box">{selectedTicket.messages.map((m, i) => <div key={i} className={`chat-message ${m.from}`}><span>{m.from === 'user' ? selectedTicket.userName : 'Support'}</span><p>{m.text}</p></div>)}</div><form className="reply-box" onSubmit={(e) => { e.preventDefault(); respondTicket(selectedTicket.id, reply); setReply(''); }}><textarea rows="3" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" /><div className="button-row"><button className="primary-button">Send reply</button><button type="button" className="secondary-button" onClick={() => { if (reply.trim()) { respondTicket(selectedTicket.id, reply, true); setReply(''); } else respondTicket(selectedTicket.id, 'Ticket closed by support.', true); }}>Reply and close</button></div></form></> : <EmptyState title="No ticket selected" />}</div>
          </section>
        )}

        {tab === 'audit' && admin && (
          <section className="panel-card">
            <div className="section-head"><div><span className="eyebrow">Current Month</span><h1>Artist Accounting & Rewards</h1></div></div>
            <div className="responsive-table"><table><thead><tr><th>Artist / ID</th><th>Unique Listeners</th><th>Total Streams</th><th>Calculated Reward</th><th>Payment Status</th><th>Actions</th></tr></thead><tbody>{finance.map((f) => { const artist = users.find((u) => u.id === f.artistId); return <tr key={f.artistId}><td><strong>{artist?.stageName || artist?.displayName}</strong><small className="block muted">{artist?.username}</small></td><td>{f.uniqueListeners.toLocaleString('en-US')}</td><td>{f.streams.toLocaleString('en-US')}</td><td>{formatMoney(f.reward)} IRR</td><td><span className={`status ${f.status}`}>{f.status === 'pending' ? 'Pending payment' : 'Settled'}</span></td><td>{f.status === 'pending' ? <button className="success-button small" onClick={() => settleFinance(f.artistId)}>Confirm settlement</button> : '—'}</td></tr>; })}</tbody></table></div>
          </section>
        )}

        {tab === 'subscriptions' && admin && (
          <div className="page-stack">
            <section className="panel-card"><div className="section-head"><div><span className="eyebrow">Dynamic Pricing</span><h1>Subscription Pricing</h1><p>Update subscription prices in mock state without changing code.</p></div></div><form className="price-form" onSubmit={(e) => { e.preventDefault(); updatePrices(draftPrices); }}><label>Silver plan price (IRR)<input type="number" min="0" required value={draftPrices.silver} onChange={(e) => setDraftPrices((v) => ({ ...v, silver: e.target.value }))} /></label><label>Gold plan price (IRR)<input type="number" min="0" required value={draftPrices.gold} onChange={(e) => setDraftPrices((v) => ({ ...v, gold: e.target.value }))} /></label><button className="primary-button">Update prices</button></form></section>
            <section className="report-grid"><article className="panel-card revenue-widget"><span>Estimated subscription revenue this month</span><strong>{formatMoney(monthlyRevenue)} IRR</strong><small>Based on demo users and current prices</small></article><article className="panel-card pie-widget"><div><span className="eyebrow">User Distribution</span><h2>Subscription Tiers</h2><ul><li><span className="dot basic-dot" />Basic: {dist.basic.toLocaleString('en-US')}</li><li><span className="dot silver-dot" />Silver: {dist.silver.toLocaleString('en-US')}</li><li><span className="dot gold-dot" />Gold: {dist.gold.toLocaleString('en-US')}</li></ul></div><div className="pie-chart" style={{ '--basic-deg': `${basicDeg}deg`, '--silver-deg': `${silverDeg}deg` }}><span>{total.toLocaleString('en-US')}<small>users</small></span></div></article></section>
          </div>
        )}
      </div>
    </div>
  );
}
