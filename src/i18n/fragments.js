const EN_TO_FA = {
  'tracks': 'آهنگ',
  'tracks ·': 'آهنگ ·',
  'listeners': 'شنونده',
  'listeners ·': 'شنونده ·',
  'streams': 'پخش',
  'streams ·': 'پخش ·',
  'results': 'نتیجه',
  'followers': 'دنبال‌کننده',
  'releases': 'اثر',
  'playlists': 'پلی‌لیست',
  'of': 'از',
  'Plan:': 'اشتراک:',
  'Current plan:': 'اشتراک فعلی:',
  'Ticket': 'تیکت',
  'Ticket #': 'تیکت شماره ',
  'user': 'کاربر',
  'users': 'کاربر',
  'Basic:': 'پایه:',
  'Silver:': 'نقره‌ای:',
  'Gold:': 'طلایی:',
  'Single': 'تک‌آهنگ',
  'Other': 'سایر',
  'pending': 'در انتظار',
  'approved': 'تاییدشده',
  'rejected': 'ردشده',
  'settled': 'تسویه‌شده',
  'open': 'باز',
  'answered': 'پاسخ داده‌شده',
  'closed': 'بسته',
  'IRR': 'ریال',
};

const FA_TO_EN = Object.fromEntries(Object.entries(EN_TO_FA).map(([en, fa]) => [fa, en]));
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

function faDigits(value) {
  return value.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]).replaceAll('%', '٪');
}

function enDigits(value) {
  return value.replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit))).replaceAll('٪', '%');
}

export function translateFragment(rawValue, language = 'en') {
  if (rawValue === null || rawValue === undefined) return rawValue;
  const raw = String(rawValue);
  if (!raw.trim()) return raw;
  const leading = raw.match(/^\s*/)?.[0] || '';
  const trailing = raw.match(/\s*$/)?.[0] || '';
  const value = raw.trim();
  if (/^(https?:\/\/|\/|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/.test(value)) return raw;

  let translated = language === 'fa' ? (EN_TO_FA[value] || value) : (FA_TO_EN[value] || value);
  if (/^[\d۰-۹][\d۰-۹\s.,،٫:%٪+\-/]*$/.test(translated)) translated = language === 'fa' ? faDigits(translated) : enDigits(translated);
  return `${leading}${translated}${trailing}`;
}

export function localizeFragments(language = 'en', root = document.body) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const parent = node.parentElement;
    if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE'].includes(parent.tagName) || parent.closest('[data-no-i18n]')) return;
    const translated = translateFragment(node.data, language);
    if (translated !== node.data) node.data = translated;
  });
}
