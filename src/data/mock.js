export const SUBSCRIPTIONS = {
  basic: { label: 'Basic', playlistLimit: 6, dailyStreamLimit: 60, canAvatar: false, canDownload: false, earlyAccess: false, stats: false },
  silver: { label: 'Silver', playlistLimit: 100, dailyStreamLimit: Infinity, canAvatar: true, canDownload: true, earlyAccess: false, stats: false },
  gold: { label: 'Gold', playlistLimit: Infinity, dailyStreamLimit: Infinity, canAvatar: true, canDownload: true, earlyAccess: true, stats: true },
};

export const demoUsers = [
  { id: 'u-basic', role: 'listener', email: 'sara@example.com', password: '123456', displayName: 'Sara Collins', username: 'sara_204', subscription: 'basic', avatar: '', followers: ['u-gold'], following: ['a-nima'], streamsToday: 18, birthDate: '2002-04-18', gender: 'female' },
  { id: 'u-silver', role: 'listener', email: 'mina@example.com', password: '123456', displayName: 'Mina Parker', username: 'mina_875', subscription: 'silver', avatar: '', followers: [], following: ['a-roya'], streamsToday: 8, birthDate: '2001-09-02', gender: 'female' },
  { id: 'u-gold', role: 'listener', email: 'gold@example.com', password: '123456', displayName: 'Arian Gold', username: 'arian_gold', subscription: 'gold', avatar: '', followers: ['u-basic'], following: ['a-nima', 'a-roya'], streamsToday: 42, birthDate: '1999-12-05', gender: 'male' },
  { id: 'a-nima', role: 'artist', email: 'nima@artist.com', password: '123456', displayName: 'Nima Azar', stageName: 'NIMA AZAR', username: 'nimaazar', subscription: 'gold', avatar: '', followers: ['u-basic', 'u-gold'], following: [], status: 'approved', verified: true, bio: 'Electronic producer and composer blending synthwave textures with cinematic instrumentation.', streamsToday: 0 },
  { id: 'a-roya', role: 'artist', email: 'roya@artist.com', password: '123456', displayName: 'Roya Mehr', stageName: 'ROYA MEHR', username: 'royamehr', subscription: 'gold', avatar: '', followers: ['u-silver', 'u-gold'], following: [], status: 'approved', verified: true, bio: 'Alternative and indie singer-songwriter focused on atmospheric vocals and intimate arrangements.', streamsToday: 0 },
  { id: 'support-1', role: 'support', email: 'support@example.com', password: '123456', displayName: 'Support Agent', username: 'support1', subscription: 'gold', avatar: '', followers: [], following: [], streamsToday: 0 },
  { id: 'admin-1', role: 'admin', email: 'admin@example.com', password: '123456', displayName: 'System Administrator', username: 'root_admin', subscription: 'gold', avatar: '', followers: [], following: [], streamsToday: 0 },
];

export const demoAlbums = [
  { id: 'al-neon', title: 'Neon Nights', artistId: 'a-nima', cover: '/covers/cover-neon.svg', releaseDate: '2026-05-14', listenerCount: 18420, earlyAccess: false },
  { id: 'al-rain', title: 'Quiet Rain', artistId: 'a-roya', cover: '/covers/cover-rain.svg', releaseDate: '2026-06-02', listenerCount: 12440, earlyAccess: false },
  { id: 'al-dawn', title: 'Dawn', artistId: 'a-nima', cover: '/covers/cover-dawn.svg', releaseDate: '2026-08-15', listenerCount: 610, earlyAccess: true },
];

export const demoTracks = [
  { id: 't1', title: 'Wet Streets', artistIds: ['a-nima'], albumId: 'al-neon', cover: '/covers/cover-neon.svg', audio: '/audio/track1.wav', duration: 8, genre: 'Electronic', releaseDate: '2026-05-14', listenerCount: 12940, streamCount: 48221, earlyAccess: false, lyrics: 'Neon dances on the road\nThe city is still awake\nInside the quiet pulse of night\nA melody repeats', income: 3450000 },
  { id: 't2', title: 'Last Metro', artistIds: ['a-nima'], albumId: 'al-neon', cover: '/covers/cover-moon.svg', audio: '/audio/track2.wav', duration: 8, genre: 'Synthwave', releaseDate: '2026-05-14', listenerCount: 9820, streamCount: 33780, earlyAccess: false, lyrics: 'The final train arrives\nLong after midnight\nThe window carries your reflection\nAcross the sleeping city', income: 2710000 },
  { id: 't3', title: 'Rain on Glass', artistIds: ['a-roya'], albumId: 'al-rain', cover: '/covers/cover-rain.svg', audio: '/audio/track3.wav', duration: 8, genre: 'Indie', releaseDate: '2026-06-02', listenerCount: 10560, streamCount: 29440, earlyAccess: false, lyrics: 'Rain traces the window\nWriting a name in light\nThe city slowly fills\nWith memories tonight', income: 2380000 },
  { id: 't4', title: 'Blue Desert', artistIds: ['a-roya', 'a-nima'], albumId: null, cover: '/covers/cover-desert.svg', audio: '/audio/track4.wav', duration: 8, genre: 'Alternative', releaseDate: '2026-06-21', listenerCount: 15110, streamCount: 52200, earlyAccess: false, lyrics: '', income: 3960000 },
  { id: 't5', title: 'Before Sunrise', artistIds: ['a-nima'], albumId: 'al-dawn', cover: '/covers/cover-dawn.svg', audio: '/audio/track5.wav', duration: 8, genre: 'Ambient', releaseDate: '2026-08-15', listenerCount: 610, streamCount: 1024, earlyAccess: true, lyrics: 'Before the sunrise\nThe world becomes quiet', income: 82000 },
  { id: 't6', title: 'Last Wave', artistIds: ['a-roya'], albumId: null, cover: '/covers/cover-ocean.svg', audio: '/audio/track6.wav', duration: 8, genre: 'Indie Pop', releaseDate: '2026-07-02', listenerCount: 7900, streamCount: 18850, earlyAccess: false, lyrics: 'The last wave arrived\nBut the shore was still bright', income: 1550000 },
];

export const demoPlaylists = [
  { id: 'p1', ownerId: 'u-basic', name: 'Night Drive', trackIds: ['t1', 't2', 't4'], updatedAt: '2026-07-20T19:20:00Z' },
  { id: 'p2', ownerId: 'u-gold', name: 'Focus', trackIds: ['t3', 't5'], updatedAt: '2026-07-21T08:10:00Z' },
  { id: 'p3', ownerId: 'u-silver', name: 'Rainy Day', trackIds: ['t3'], updatedAt: '2026-07-18T15:00:00Z' },
];

export const demoNotifications = [
  { id: 'n1', userId: 'u-basic', type: 'release', title: 'New release from NIMA AZAR', body: 'The single “Blue Desert” is now available.', link: '/library?track=t4', read: false, createdAt: '2026-07-21T12:30:00Z' },
  { id: 'n2', userId: 'u-basic', type: 'subscription', title: 'Subscription reminder', body: 'Your Basic plan is active. Upgrade to download tracks.', read: true, createdAt: '2026-07-18T09:00:00Z' },
  { id: 'n3', userId: 'a-nima', type: 'finance', title: 'Monthly finance report', body: 'This month’s artist accounting data is ready.', link: '/studio', read: false, createdAt: '2026-07-20T10:00:00Z' },
  { id: 'n4', userId: 'support-1', type: 'ticket', title: 'New support ticket', body: 'Ticket #1042 was created about the daily stream limit.', link: '/dashboard', read: false, createdAt: '2026-07-22T17:15:00Z' },
  { id: 'n5', userId: 'admin-1', type: 'artist-request', title: 'Artist verification request', body: 'A new artist is waiting for review.', link: '/dashboard', read: false, createdAt: '2026-07-22T12:00:00Z' },
];

export const demoArtistRequests = [
  { id: 'ar1', userId: 'pending-artist-1', stageName: 'SHADOW', email: 'saye@example.com', samples: 'https://example.com/demo/saye', status: 'pending', reason: '', createdAt: '2026-07-22T12:00:00Z' },
  { id: 'ar2', userId: 'pending-artist-2', stageName: 'PEJMAN NOVA', email: 'pejman@example.com', samples: 'https://example.com/demo/pejman', status: 'pending', reason: '', createdAt: '2026-07-19T10:20:00Z' },
];

export const demoTickets = [
  { id: '1042', userName: 'Sara Collins', subject: 'Daily stream limit', createdAt: '2026-07-22T17:15:00Z', status: 'open', messages: [{ from: 'user', text: 'How can I see how many streams remain in my daily allowance?' }] },
  { id: '1038', userName: 'Mina Parker', subject: 'Offline download', createdAt: '2026-07-20T10:00:00Z', status: 'answered', messages: [{ from: 'user', text: 'Where is the downloaded file saved?' }, { from: 'support', text: 'In the web version, the file is saved to your browser download location.' }] },
];

export const demoFinance = [
  { artistId: 'a-nima', uniqueListeners: 22010, streams: 82981, reward: 5186300, status: 'pending' },
  { artistId: 'a-roya', uniqueListeners: 18890, streams: 70490, reward: 4405600, status: 'settled' },
];

export const demoPrices = { silver: 149000, gold: 249000 };

export const demoSettings = { language: 'fa', notificationLimit: 10, uiVolume: 0.55 };
