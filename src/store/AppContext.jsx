import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  demoAlbums,
  demoArtistRequests,
  demoFinance,
  demoNotifications,
  demoPlaylists,
  demoPrices,
  demoSettings,
  demoTickets,
  demoTracks,
  demoUsers,
} from '../data/mock';
import { loadPersistedState, savePersistedState, clearPersistedState } from '../services/storage';
import { safeUsername, toggleId } from '../utils/domain';
import * as permissions from '../utils/permissions';

const AppContext = createContext(null);

const createInitialState = () => ({
  currentUserId: null,
  users: demoUsers,
  albums: demoAlbums,
  tracks: demoTracks,
  playlists: demoPlaylists,
  notifications: demoNotifications,
  artistRequests: demoArtistRequests,
  tickets: demoTickets,
  finance: demoFinance,
  prices: demoPrices,
  settingsByUser: {},
});

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadPersistedState() || createInitialState());
  const [player, setPlayer] = useState({ currentTrackId: null, queue: [], isPlaying: false, repeat: 'off', shuffle: false, expanded: false });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  const currentUser = useMemo(() => state.users.find((u) => u.id === state.currentUserId) || null, [state.users, state.currentUserId]);
  const settings = useMemo(() => ({ ...demoSettings, ...(state.settingsByUser[state.currentUserId] || {}) }), [state.settingsByUser, state.currentUserId]);

  useEffect(() => {
    document.documentElement.lang = settings.language || 'fa';
    document.documentElement.dir = settings.language === 'en' ? 'ltr' : 'rtl';
  }, [settings.language]);

  const notify = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const login = useCallback((email, password) => {
    const user = state.users.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase() && u.password === password);
    if (!user) return { ok: false, message: 'ایمیل یا رمز عبور نادرست است.' };
    setState((s) => ({ ...s, currentUserId: user.id }));
    return { ok: true, user };
  }, [state.users]);

  const logout = useCallback(() => {
    setPlayer((p) => ({ ...p, isPlaying: false, currentTrackId: null, queue: [] }));
    setState((s) => ({ ...s, currentUserId: null }));
  }, []);

  const registerListener = useCallback((payload) => {
    if (state.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return { ok: false, message: 'این ایمیل قبلا ثبت شده است.' };
    }
    const user = {
      id: `u-${Date.now()}`,
      role: 'listener',
      email: payload.email,
      password: payload.password,
      displayName: payload.displayName,
      username: safeUsername(payload.displayName),
      birthDate: payload.birthDate,
      gender: payload.gender,
      subscription: 'basic',
      avatar: '',
      followers: [],
      following: [],
      streamsToday: 0,
    };
    setState((s) => ({ ...s, users: [...s.users, user], currentUserId: user.id }));
    return { ok: true, user };
  }, [state.users]);

  const registerArtist = useCallback((payload) => {
    if (state.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return { ok: false, message: 'این ایمیل قبلا ثبت شده است.' };
    }
    const id = `artist-${Date.now()}`;
    const user = {
      id,
      role: 'artist',
      email: payload.email,
      password: payload.password,
      displayName: payload.stageName,
      stageName: payload.stageName,
      username: safeUsername(payload.stageName),
      subscription: 'gold',
      avatar: '',
      followers: [],
      following: [],
      status: 'pending',
      verified: false,
      bio: '',
      streamsToday: 0,
    };
    const request = { id: `ar-${Date.now()}`, userId: id, stageName: payload.stageName, email: payload.email, samples: payload.samples, status: 'pending', reason: '', createdAt: new Date().toISOString() };
    setState((s) => ({
      ...s,
      users: [...s.users, user],
      artistRequests: [request, ...s.artistRequests],
      notifications: [
        ...s.notifications,
        ...s.users.filter((u) => ['support', 'admin'].includes(u.role)).map((u) => ({ id: `n-${Date.now()}-${u.id}`, userId: u.id, type: 'artist-request', title: 'درخواست احراز هویت هنرمند', body: `${payload.stageName} منتظر بررسی است.`, link: '/dashboard', read: false, createdAt: new Date().toISOString() })),
      ],
    }));
    return { ok: true, pending: true };
  }, [state.users]);

  const updateProfile = useCallback((userId, patch) => {
    const user = state.users.find((u) => u.id === userId);
    if (!user) return { ok: false, message: 'کاربر پیدا نشد.' };
    if ('avatar' in patch && !permissions.canChangeAvatar(user.subscription)) {
      return { ok: false, message: 'تغییر عکس نمایه برای اشتراک پایه فعال نیست.' };
    }
    setState((s) => ({ ...s, users: s.users.map((u) => u.id === userId ? { ...u, ...patch } : u) }));
    notify('اطلاعات نمایه ذخیره شد.', 'success');
    return { ok: true };
  }, [state.users, notify]);

  const toggleFollow = useCallback((targetId) => {
    if (!currentUser || currentUser.id === targetId) return;
    const wasFollowing = currentUser.following?.includes(targetId);
    setState((s) => ({
      ...s,
      users: s.users.map((u) => {
        if (u.id === currentUser.id) return { ...u, following: toggleId(u.following || [], targetId) };
        if (u.id === targetId) return { ...u, followers: wasFollowing ? (u.followers || []).filter((id) => id !== currentUser.id) : [...(u.followers || []), currentUser.id] };
        return u;
      }),
    }));
  }, [currentUser]);

  const createPlaylist = useCallback((name) => {
    if (!currentUser) return { ok: false };
    const mine = state.playlists.filter((p) => p.ownerId === currentUser.id);
    if (!permissions.canCreatePlaylist(currentUser.subscription, mine.length)) {
      return { ok: false, message: `سقف تعداد پلی‌لیست برای اشتراک ${permissions.subscriptionLabel(currentUser.subscription)} تکمیل شده است.` };
    }
    const playlist = { id: `p-${Date.now()}`, ownerId: currentUser.id, name: name.trim(), trackIds: [], updatedAt: new Date().toISOString() };
    setState((s) => ({ ...s, playlists: [playlist, ...s.playlists] }));
    return { ok: true, playlist };
  }, [currentUser, state.playlists]);

  const renamePlaylist = useCallback((playlistId, name) => {
    setState((s) => ({ ...s, playlists: s.playlists.map((p) => p.id === playlistId && p.ownerId === s.currentUserId ? { ...p, name: name.trim(), updatedAt: new Date().toISOString() } : p) }));
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setState((s) => ({ ...s, playlists: s.playlists.filter((p) => !(p.id === playlistId && p.ownerId === s.currentUserId)) }));
  }, []);

  const toggleTrackInPlaylist = useCallback((playlistId, trackId) => {
    setState((s) => ({ ...s, playlists: s.playlists.map((p) => p.id === playlistId && p.ownerId === s.currentUserId ? { ...p, trackIds: toggleId(p.trackIds, trackId), updatedAt: new Date().toISOString() } : p) }));
  }, []);

  const markNotification = useCallback((notificationId, read = true) => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => n.id === notificationId && n.userId === s.currentUserId ? { ...n, read } : n) }));
  }, []);

  const markAllNotifications = useCallback(() => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => n.userId === s.currentUserId ? { ...n, read: true } : n) }));
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setState((s) => ({ ...s, notifications: s.notifications.filter((n) => !(n.id === notificationId && n.userId === s.currentUserId)) }));
  }, []);

  const updateSettings = useCallback((patch) => {
    if (!currentUser) return;
    setState((s) => ({ ...s, settingsByUser: { ...s.settingsByUser, [currentUser.id]: { ...(s.settingsByUser[currentUser.id] || {}), ...patch } } }));
  }, [currentUser]);

  const deleteAccount = useCallback(() => {
    if (!currentUser || ['admin', 'support'].includes(currentUser.role)) return { ok: false, message: 'حساب‌های سیستمی از نسخه ماک حذف نمی‌شوند.' };
    const id = currentUser.id;
    setState((s) => ({
      ...s,
      currentUserId: null,
      users: s.users.filter((u) => u.id !== id),
      playlists: s.playlists.filter((p) => p.ownerId !== id),
      notifications: s.notifications.filter((n) => n.userId !== id),
    }));
    return { ok: true };
  }, [currentUser]);

  const playTrack = useCallback((trackId, queueIds) => {
    const track = state.tracks.find((t) => t.id === trackId);
    if (!track || !currentUser) return { ok: false };
    if (track.earlyAccess && !permissions.canAccessEarlyRelease(currentUser.subscription)) {
      notify('این اثر فعلا فقط برای کاربران طلایی در دسترس است.', 'warning');
      return { ok: false };
    }
    if (!permissions.canStream(currentUser.subscription, currentUser.streamsToday || 0)) {
      notify('سقف ۶۰ پخش روزانه اشتراک پایه تکمیل شده است.', 'warning');
      return { ok: false };
    }
    const isNewTrack = player.currentTrackId !== trackId;
    if (isNewTrack) {
      setState((s) => ({ ...s, users: s.users.map((u) => u.id === s.currentUserId ? { ...u, streamsToday: (u.streamsToday || 0) + 1 } : u) }));
    }
    setPlayer((p) => ({ ...p, currentTrackId: trackId, queue: queueIds?.length ? queueIds : (p.queue.length ? p.queue : [trackId]), isPlaying: true }));
    return { ok: true };
  }, [state.tracks, currentUser, player.currentTrackId, notify]);

  const setPlayerState = useCallback((patch) => setPlayer((p) => ({ ...p, ...patch })), []);

  const reviewArtistRequest = useCallback((requestId, approved, reason = '') => {
    if (!currentUser || !permissions.isBackoffice(currentUser.role)) return;
    let targetUserId = null;
    let stageName = '';
    setState((s) => {
      const req = s.artistRequests.find((r) => r.id === requestId);
      if (!req) return s;
      targetUserId = req.userId;
      stageName = req.stageName;
      const status = approved ? 'approved' : 'rejected';
      const users = s.users.map((u) => u.id === req.userId ? { ...u, status, verified: approved } : u);
      const notifications = s.users.some((u) => u.id === req.userId)
        ? [{ id: `n-${Date.now()}`, userId: req.userId, type: 'artist-result', title: approved ? 'حساب هنرمند تایید شد' : 'درخواست هنرمند رد شد', body: approved ? 'حساب شما تایید شد و پنل مدیریت آثار فعال است.' : `علت رد: ${reason || 'نیاز به اطلاعات بیشتر'}`, link: '/studio', read: false, createdAt: new Date().toISOString() }, ...s.notifications]
        : s.notifications;
      return { ...s, users, notifications, artistRequests: s.artistRequests.map((r) => r.id === requestId ? { ...r, status, reason } : r) };
    });
    notify(approved ? `حساب ${stageName || 'هنرمند'} تایید شد.` : 'درخواست رد شد.', approved ? 'success' : 'warning');
    return targetUserId;
  }, [currentUser, notify]);

  const respondTicket = useCallback((ticketId, text, close = false) => {
    if (!currentUser || !permissions.isBackoffice(currentUser.role) || !text.trim()) return;
    setState((s) => ({ ...s, tickets: s.tickets.map((t) => t.id === ticketId ? { ...t, status: close ? 'closed' : 'answered', messages: [...t.messages, { from: 'support', text: text.trim() }] } : t) }));
  }, [currentUser]);

  const createTicket = useCallback((subject, text) => {
    if (!currentUser || !subject.trim() || !text.trim()) return { ok: false, message: 'موضوع و متن تیکت الزامی است.' };
    const numeric = Math.max(1000, ...state.tickets.map((t) => Number(t.id) || 0)) + 1;
    const ticket = { id: String(numeric), userName: currentUser.displayName, subject: subject.trim(), createdAt: new Date().toISOString(), status: 'open', messages: [{ from: 'user', text: text.trim() }] };
    setState((s) => ({
      ...s,
      tickets: [ticket, ...s.tickets],
      notifications: [
        ...s.users.filter((u) => ['support', 'admin'].includes(u.role)).map((u) => ({ id: `n-${Date.now()}-${u.id}`, userId: u.id, type: 'ticket', title: 'تیکت جدید', body: `تیکت #${numeric} از ${currentUser.displayName}: ${subject.trim()}`, link: '/dashboard', read: false, createdAt: new Date().toISOString() })),
        ...s.notifications,
      ],
    }));
    notify('تیکت پشتیبانی ثبت شد.', 'success');
    return { ok: true, ticket };
  }, [currentUser, state.tickets, notify]);

  const settleFinance = useCallback((artistId) => {
    if (!currentUser || !permissions.isAdmin(currentUser.role)) return;
    setState((s) => ({ ...s, finance: s.finance.map((f) => f.artistId === artistId ? { ...f, status: 'settled' } : f) }));
  }, [currentUser]);

  const updatePrices = useCallback((prices) => {
    if (!currentUser || !permissions.isAdmin(currentUser.role)) return;
    setState((s) => ({ ...s, prices: { silver: Number(prices.silver), gold: Number(prices.gold) } }));
    notify('قیمت اشتراک‌ها بروزرسانی شد.', 'success');
  }, [currentUser, notify]);

  const publishTrack = useCallback((payload) => {
    if (!permissions.canUseArtistStudio(currentUser)) return { ok: false, message: 'حساب هنرمند هنوز تایید نشده است.' };
    const now = Date.now();
    let albumId = payload.albumId || null;
    let newAlbum = null;
    if (payload.releaseType === 'album' && !albumId) {
      albumId = `al-${now}`;
      newAlbum = { id: albumId, title: payload.albumTitle || payload.title, artistId: currentUser.id, cover: payload.cover || '/covers/cover-neon.svg', releaseDate: payload.releaseDate, listenerCount: 0, earlyAccess: !!payload.earlyAccess };
    }
    const track = {
      id: `t-${now}`,
      title: payload.title,
      artistIds: [currentUser.id, ...(payload.collaboratorIds || [])],
      albumId,
      cover: payload.cover || '/covers/cover-neon.svg',
      audio: payload.audio || '/audio/track1.wav',
      duration: payload.duration || 8,
      genre: payload.genre || 'Other',
      releaseDate: payload.releaseDate || new Date().toISOString().slice(0, 10),
      listenerCount: 0,
      streamCount: 0,
      earlyAccess: !!payload.earlyAccess,
      lyrics: payload.lyrics || '',
      income: 0,
    };
    setState((s) => ({ ...s, tracks: [track, ...s.tracks], albums: newAlbum ? [newAlbum, ...s.albums] : s.albums }));
    notify('اثر جدید در داده‌های ماک منتشر شد.', 'success');
    return { ok: true, track };
  }, [currentUser, notify]);

  const updateTrack = useCallback((trackId, patch) => {
    if (!currentUser) return;
    setState((s) => ({ ...s, tracks: s.tracks.map((t) => t.id === trackId && t.artistIds.includes(currentUser.id) ? { ...t, ...patch } : t) }));
  }, [currentUser]);

  const deleteTrack = useCallback((trackId) => {
    if (!currentUser) return;
    setState((s) => ({ ...s, tracks: s.tracks.filter((t) => !(t.id === trackId && t.artistIds.includes(currentUser.id))), playlists: s.playlists.map((p) => ({ ...p, trackIds: p.trackIds.filter((id) => id !== trackId) })) }));
  }, [currentUser]);

  const resetDemo = useCallback(() => {
    clearPersistedState();
    setState(createInitialState());
    setPlayer({ currentTrackId: null, queue: [], isPlaying: false, repeat: 'off', shuffle: false, expanded: false });
    notify('داده‌های دمو به حالت اولیه برگشت.', 'success');
  }, [notify]);

  const value = useMemo(() => ({
    ...state,
    currentUser,
    settings,
    player,
    toast,
    login,
    logout,
    registerListener,
    registerArtist,
    updateProfile,
    toggleFollow,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    toggleTrackInPlaylist,
    markNotification,
    markAllNotifications,
    deleteNotification,
    updateSettings,
    deleteAccount,
    playTrack,
    setPlayerState,
    reviewArtistRequest,
    createTicket,
    respondTicket,
    settleFinance,
    updatePrices,
    publishTrack,
    updateTrack,
    deleteTrack,
    resetDemo,
    notify,
  }), [state, currentUser, settings, player, toast, login, logout, registerListener, registerArtist, updateProfile, toggleFollow, createPlaylist, renamePlaylist, deletePlaylist, toggleTrackInPlaylist, markNotification, markAllNotifications, deleteNotification, updateSettings, deleteAccount, playTrack, setPlayerState, reviewArtistRequest, createTicket, respondTicket, settleFinance, updatePrices, publishTrack, updateTrack, deleteTrack, resetDemo, notify]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
