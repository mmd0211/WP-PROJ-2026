# WP-PROJ-2026 — Spotune

پیاده‌سازی فاز اول پروژه درس **برنامه‌سازی وب** دانشگاه صنعتی شریف؛ یک سرویس استریم موسیقی شبیه Spotify با رابط کاربری نقش‌محور برای شنونده، هنرمند، پشتیبان و مدیر سامانه.

> وضعیت فعلی مخزن: **Phase 1 — Frontend Mock**. در این فاز بک‌اند وجود ندارد و داده‌های Mock در `localStorage` نگهداری می‌شوند. اتصال واقعی به Django/DRF مربوط به فاز دوم است.

## Tech Stack

- React
- Vite
- React Router
- Vitest
- LocalStorage Mock Persistence
- PWA (Manifest + Service Worker)

## اجرا

پیش‌نیاز: Node.js 18 یا جدیدتر.

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

اجرای تست‌ها:

```bash
npm test
```

## حساب‌های دمو

رمز تمام حساب‌های زیر `123456` است.

| نقش | ایمیل |
|---|---|
| شنونده پایه | `sara@example.com` |
| شنونده نقره‌ای | `mina@example.com` |
| شنونده طلایی | `gold@example.com` |
| هنرمند تاییدشده | `nima@artist.com` |
| پشتیبان | `support@example.com` |
| مدیر سامانه | `admin@example.com` |

## قابلیت‌های فاز اول

### احراز هویت و ثبت‌نام
- ورود مشترک برای تمام نقش‌ها و هدایت Role-based.
- بازیابی رمز عبور به صورت Mock.
- ثبت‌نام شنونده با اطلاعات موردنیاز پروژه و پذیرش حریم خصوصی.
- ثبت‌نام اختصاصی هنرمند با نمونه‌کار و وضعیت `pending`.
- تایید یا رد هنرمند توسط پشتیبان/مدیر و اعلان نتیجه.

### صفحه خانه
- نمایش کاربر و تصویر پروفایل با fallback.
- آخرین پلی‌لیست‌های شنیده‌شده، آلبوم‌های جدید و آهنگ‌های پرشنونده.
- بخش Early Access برای کاربران Gold.
- طراحی Responsive برای دسکتاپ، تبلت و موبایل.

### پروفایل کاربر و هنرمند
- اطلاعات شخصی، username سیستمی، اشتراک، follower/following و آمار استریم.
- Follow / Unfollow.
- ویرایش پروفایل.
- محدودیت تغییر عکس برای کاربران Basic.
- پروفایل هنرمند شامل Bio، آثار منتشرشده و Verified Badge.
- نمایش آمار هنرمند برای کاربران Gold.

### تنظیمات
- محدودیت اعلان‌ها.
- صدای رابط.
- تغییر زبان و RTL/LTR.
- نمایش سطح اشتراک و قیمت‌های پویا.
- حذف حساب کاربری.
- ارسال تیکت پشتیبانی.
- Reset داده‌های دمو.

### اعلان‌ها
- تفکیک اعلان‌های خوانده‌شده و خوانده‌نشده.
- Mark as Read، Delete و Read All.
- Empty State.
- اعلان‌های Role-based.

### پلی‌لیست‌ها
- ایجاد، حذف و تغییر نام.
- محدودیت تعداد پلی‌لیست بر اساس اشتراک: Basic = 6، Silver = 100، Gold = نامحدود.
- افزودن/حذف آهنگ از چند پلی‌لیست.
- Empty State و CTA ایجاد اولین پلی‌لیست.

### آرشیو موسیقی
- جستجو بر اساس نام اثر یا هنرمند.
- مرتب‌سازی بر اساس Listener Count و Release Date.
- صفحات آلبوم و تک‌آهنگ.
- لینک به پروفایل هنرمند و آلبوم.
- قابلیت دانلود برای Silver/Gold.
- Early Access برای Gold.

### Music Player
- فایل‌های WAV محلی واقعی در `public/audio`.
- Player ثابت در دسکتاپ و Mini Player در موبایل.
- Play / Pause / Next / Previous.
- Seekable Progress Bar.
- Volume Control.
- Repeat: off / all / one.
- Shuffle.
- Queue.
- Lyrics.
- لینک هنرمند و آلبوم.
- آمار اختصاصی برای Gold.
- اعمال محدودیت 60 استریم روزانه برای Basic در منطق دامنه.

### پنل هنرمند
- انتشار و مدیریت آثار برای هنرمند تاییدشده.
- ورودی MP3/WAV/FLAC.
- Cover، Lyrics، Genre، Release Date، Collaborators و نوع انتشار.
- ویرایش و حذف آثار.
- آمار Listener، Stream و درآمد.

### داشبورد پشتیبان و مدیر
- دسترسی Role-based.
- بررسی درخواست تایید هنرمندان.
- Approve/Reject همراه دلیل.
- مدیریت تیکت‌ها با رابط Chat-like.
- Accounting و وضعیت تسویه هنرمندان.
- Confirm Settlement برای Admin.
- قیمت‌گذاری پویای Silver/Gold.
- Pie Chart توزیع اشتراک‌ها و Revenue Widgets.

## تست و معماری

- بیش از حداقل 10 تست موردنیاز فاز اول.
- تست policy اشتراک، role access، stream limit، search/sort/repeat و storage.
- persistence در `src/services/storage.js` از UI جدا شده است.
- permissionها در `src/utils/permissions.js` متمرکز شده‌اند.
- application state و عملیات اصلی در `src/store/AppContext.jsx` نگهداری می‌شوند.
- ساختار پروژه برای جایگزینی لایه Mock با API فاز دوم طراحی شده است.

## PWA

- `public/manifest.webmanifest`
- آیکن‌های 192 و 512
- `public/service-worker.js`
- Service Worker registration در build production

## ساختار پروژه

```text
WP-PROJ-2026/
├── public/
│   ├── audio/
│   ├── covers/
│   ├── manifest.webmanifest
│   └── service-worker.js
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── tests/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── vite.config.js
```

## فاز دوم

در فاز دوم، LocalStorage و داده‌های Mock با API جنگو/DRF جایگزین می‌شوند. ساختار فعلی طوری طراحی شده که عملیات اصلی و قراردادهای UI تا حد ممکن ثابت بمانند و نیاز به refactor گسترده کاهش یابد.

موارد امنیتی و سروری مانند authorization واقعی، password storage، media upload، synchronization بین دستگاه‌ها، payment gateway و aggregated reports باید در Backend پیاده‌سازی شوند.

## Git Workflow

تغییرات بعدی پروژه در commitهای مستقل و با پیام مشخص ثبت می‌شوند تا تاریخچه توسعه قابل پیگیری باقی بماند.
