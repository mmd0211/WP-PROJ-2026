export const SUBSCRIPTIONS = {
  basic: { label: 'پایه', playlistLimit: 6, dailyStreamLimit: 60, canAvatar: false, canDownload: false, earlyAccess: false, stats: false },
  silver: { label: 'نقره‌ای', playlistLimit: 100, dailyStreamLimit: Infinity, canAvatar: true, canDownload: true, earlyAccess: false, stats: false },
  gold: { label: 'طلایی', playlistLimit: Infinity, dailyStreamLimit: Infinity, canAvatar: true, canDownload: true, earlyAccess: true, stats: true },
};

export const demoUsers = [
  {
    id: 'u-basic', role: 'listener', email: 'sara@example.com', password: '123456', displayName: 'سارا', username: 'sara_204',
    birthDate: '2001-04-12', gender: 'female', subscription: 'basic', avatar: '', followers: ['u-gold'], following: ['a-nima'], streamsToday: 12,
  },
  {
    id: 'u-silver', role: 'listener', email: 'mina@example.com', password: '123456', displayName: 'مینا', username: 'mina_875',
    birthDate: '1999-08-02', gender: 'female', subscription: 'silver', avatar: '/covers/default-avatar.svg', followers: [], following: ['a-nima', 'u-basic'], streamsToday: 71,
  },
  {
    id: 'u-gold', role: 'listener', email: 'gold@example.com', password: '123456', displayName: 'آرین طلایی', username: 'arian_gold',
    birthDate: '1998-11-20', gender: 'male', subscription: 'gold', avatar: '/covers/default-avatar.svg', followers: ['u-basic'], following: ['a-nima', 'a-roya'], streamsToday: 104,
  },
  {
    id: 'a-nima', role: 'artist', email: 'nima@artist.com', password: '123456', displayName: 'نیما آذر', stageName: 'NIMA AZAR', username: 'nimaazar',
    birthDate: '1994-03-14', gender: 'male', subscription: 'gold', avatar: '/covers/cover-neon.svg', followers: ['u-basic', 'u-silver', 'u-gold'], following: [], status: 'approved', verified: true,
    bio: 'تهیه‌کننده و آهنگساز موسیقی الکترونیک؛ عاشق ترکیب سینت‌ویو با سازهای ایرانی.', streamsToday: 0,
  },
  {
    id: 'a-roya', role: 'artist', email: 'roya@artist.com', password: '123456', displayName: 'رویا مهر', stageName: 'رویا مهر', username: 'royamehr',
    birthDate: '1996-09-09', gender: 'female', subscription: 'gold', avatar: '/covers/cover-rain.svg', followers: ['u-gold'], following: [], status: 'approved', verified: true,
    bio: 'خواننده و ترانه‌سرا در سبک آلترناتیو و ایندی.', streamsToday: 0,
  },
  {
    id: 'support-1', role: 'support', email: 'support@example.com', password: '123456', displayName: 'پشتیبان سامانه', username: 'support1', subscription: 'gold', avatar: '', followers: [], following: [], streamsToday: 0,
  },
  {
    id: 'admin-1', role: 'admin', email: 'admin@example.com', password: '123456', displayName: 'مدیر سامانه', username: 'root_admin', subscription: 'gold', avatar: '', followers: [], following: [], streamsToday: 0,
  },
];

export const demoAlbums = [
  { id: 'al-neon', title: 'شب‌های نئون', artistId: 'a-nima', cover: '/covers/cover-neon.svg', releaseDate: '2026-05-14', listenerCount: 18420, earlyAccess: false },
  { id: 'al-rain', title: 'باران آرام', artistId: 'a-roya', cover: '/covers/cover-rain.svg', releaseDate: '2026-06-02', listenerCount: 12440, earlyAccess: false },
  { id: 'al-dawn', title: 'سپیده', artistId: 'a-nima', cover: '/covers/cover-dawn.svg', releaseDate: '2026-08-15', listenerCount: 610, earlyAccess: true },
];

export const demoTracks = [
  { id: 't1', title: 'خیابان خیس', artistIds: ['a-nima'], albumId: 'al-neon', cover: '/covers/cover-neon.svg', audio: '/audio/track1.wav', duration: 8, genre: 'Electronic', releaseDate: '2026-05-14', listenerCount: 12940, streamCount: 48221, earlyAccess: false, lyrics: 'نور روی آسفالت می‌رقصد\nشهر هنوز بیدار است\nدر نبض این شب آرام\nیک ملودی تکرار است', income: 3450000 },
  { id: 't2', title: 'آخرین مترو', artistIds: ['a-nima'], albumId: 'al-neon', cover: '/covers/cover-moon.svg', audio: '/audio/track2.wav', duration: 8, genre: 'Synthwave', releaseDate: '2026-05-14', listenerCount: 9820, streamCount: 33780, earlyAccess: false, lyrics: 'آخرین قطار می‌رسد\nساعت از نیمه گذشته\nشیشه‌ها تصویر تو را\nتا انتهای شهر برده', income: 2710000 },
  { id: 't3', title: 'باران روی شیشه', artistIds: ['a-roya'], albumId: 'al-rain', cover: '/covers/cover-rain.svg', audio: '/audio/track3.wav', duration: 8, genre: 'Indie', releaseDate: '2026-06-02', listenerCount: 10560, streamCount: 29440, earlyAccess: false, lyrics: 'باران روی شیشه\nنام تو را می‌نویسد\nو شهر آرام آرام\nاز خاطره لبریز است', income: 2380000 },
  { id: 't4', title: 'کویر آبی', artistIds: ['a-roya', 'a-nima'], albumId: null, cover: '/covers/cover-desert.svg', audio: '/audio/track4.wav', duration: 8, genre: 'Alternative', releaseDate: '2026-06-21', listenerCount: 15110, streamCount: 52200, earlyAccess: false, lyrics: '', income: 3960000 },
  { id: 't5', title: 'قبل از طلوع', artistIds: ['a-nima'], albumId: 'al-dawn', cover: '/covers/cover-dawn.svg', audio: '/audio/track5.wav', duration: 8, genre: 'Ambient', releaseDate: '2026-08-15', listenerCount: 610, streamCount: 1024, earlyAccess: true, lyrics: 'پیش از طلوع\nصدای جهان آهسته می‌شود', income: 82000 },
  { id: 't6', title: 'موج آخر', artistIds: ['a-roya'], albumId: null, cover: '/covers/cover-ocean.svg', audio: '/audio/track6.wav', duration: 8, genre: 'Indie Pop', releaseDate: '2026-07-02', listenerCount: 7900, streamCount: 18850, earlyAccess: false, lyrics: 'موج آخر رسید\nاما ساحل هنوز روشن بود', income: 1550000 },
];

export const demoPlaylists = [
  { id: 'p1', ownerId: 'u-basic', name: 'شب‌گردی', trackIds: ['t1', 't2', 't4'], updatedAt: '2026-07-20T19:20:00Z' },
  { id: 'p2', ownerId: 'u-gold', name: 'تمرکز', trackIds: ['t3', 't5'], updatedAt: '2026-07-21T08:10:00Z' },
  { id: 'p3', ownerId: 'u-silver', name: 'بارانی', trackIds: ['t3'], updatedAt: '2026-07-18T15:00:00Z' },
];

export const demoNotifications = [
  { id: 'n1', userId: 'u-basic', type: 'release', title: 'اثر جدید نیما آذر', body: 'تک‌آهنگ «کویر آبی» منتشر شد.', link: '/library?track=t4', read: false, createdAt: '2026-07-21T12:30:00Z' },
  { id: 'n2', userId: 'u-basic', type: 'subscription', title: 'یادآوری اشتراک', body: 'اشتراک پایه شما فعال است؛ برای دانلود آهنگ می‌توانید ارتقا دهید.', read: true, createdAt: '2026-07-18T09:00:00Z' },
  { id: 'n3', userId: 'a-nima', type: 'finance', title: 'گزارش مالی ماهانه', body: 'محاسبات مالی تیرماه برای آثار شما آماده است.', link: '/studio', read: false, createdAt: '2026-07-20T10:00:00Z' },
  { id: 'n4', userId: 'support-1', type: 'ticket', title: 'تیکت جدید', body: 'تیکت #1042 درباره محدودیت پخش ثبت شد.', link: '/dashboard', read: false, createdAt: '2026-07-22T17:15:00Z' },
  { id: 'n5', userId: 'admin-1', type: 'artist-request', title: 'درخواست احراز هویت هنرمند', body: 'یک هنرمند جدید منتظر بررسی است.', link: '/dashboard', read: false, createdAt: '2026-07-22T12:00:00Z' },
];

export const demoArtistRequests = [
  { id: 'ar1', userId: 'pending-artist-1', stageName: 'سایه', email: 'saye@example.com', samples: 'https://example.com/demo/saye', status: 'pending', reason: '', createdAt: '2026-07-22T12:00:00Z' },
  { id: 'ar2', userId: 'pending-artist-2', stageName: 'پژمان نو', email: 'pejman@example.com', samples: 'https://example.com/demo/pejman', status: 'pending', reason: '', createdAt: '2026-07-19T10:20:00Z' },
];

export const demoTickets = [
  { id: '1042', userName: 'سارا', subject: 'محدودیت پخش روزانه', createdAt: '2026-07-22T17:15:00Z', status: 'open', messages: [{ from: 'user', text: 'چطور متوجه شوم چند پخش از سهمیه امروز باقی مانده؟' }] },
  { id: '1038', userName: 'مینا', subject: 'دانلود آفلاین', createdAt: '2026-07-20T10:00:00Z', status: 'answered', messages: [{ from: 'user', text: 'فایل دانلودشده کجا قرار می‌گیرد؟' }, { from: 'support', text: 'در نسخه وب، فایل در مسیر دانلود مرورگر شما ذخیره می‌شود.' }] },
];

export const demoFinance = [
  { artistId: 'a-nima', uniqueListeners: 21920, streams: 83025, reward: 6420000, status: 'pending' },
  { artistId: 'a-roya', uniqueListeners: 17440, streams: 65410, reward: 4880000, status: 'settled' },
];

export const demoSettings = {
  language: 'fa',
  notificationLimit: 10,
  uiVolume: 0.55,
};

export const demoPrices = { silver: 149000, gold: 249000 };
