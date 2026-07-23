import { describe, expect, it } from 'vitest';
import { formatLocaleNumber, getTextDirection, localizeDocument, translateText } from '../i18n';
import { translateExtraText } from '../i18n/extra';
import { translateFragment } from '../i18n/fragments';
import { translateAppText } from '../i18n/useI18n';

describe('Persian localization', () => {
  it('translates core interface copy to Persian', () => {
    expect(translateText('Application Settings', 'fa')).toBe('تنظیمات برنامه');
    expect(translateText('Notifications', 'fa')).toBe('اعلان‌ها');
    expect(translateText('  Notifications  ', 'fa')).toBe('  اعلان‌ها  ');
  });

  it('translates authentication and subscription copy to Persian', () => {
    expect(translateText('Login', 'fa')).toBe('ورود');
    expect(translateText('Gold', 'fa')).toBe('طلایی');
    expect(translateText('Current plan:', 'fa')).toBe('اشتراک فعلی:');
  });

  it('translates dynamic counters with Persian digits', () => {
    expect(translateText('18 streams today', 'fa')).toBe('۱۸ پخش امروز');
    expect(translateText('6 tracks', 'fa')).toBe('۶ آهنگ');
    expect(translateText('3 unread notifications', 'fa')).toBe('۳ اعلان خوانده‌نشده');
  });

  it('uses RTL direction for Persian', () => {
    expect(getTextDirection('fa')).toBe('rtl');
  });

  it('translates artist studio and dashboard copy to Persian', () => {
    expect(translateExtraText('Artist Verification', 'fa')).toBe('احراز هویت هنرمندان');
    expect(translateExtraText('Publish a new release', 'fa')).toBe('انتشار اثر جدید');
    expect(translateExtraText('Management Dashboard', 'fa')).toBe('داشبورد مدیریت');
  });

  it('localizes numeric fragments and percent signs', () => {
    expect(translateFragment('55%', 'fa')).toBe('۵۵٪');
    expect(translateFragment('100', 'fa')).toBe('۱۰۰');
  });

  it('uses the complete translation pipeline for Persian text', () => {
    expect(translateAppText('Artist Verification', 'fa')).toBe('احراز هویت هنرمندان');
    expect(translateAppText('55%', 'fa')).toBe('۵۵٪');
  });

  it('does not translate technical URLs, routes, or email addresses', () => {
    expect(translateText('https://example.com/music', 'fa')).toBe('https://example.com/music');
    expect(translateText('/library', 'fa')).toBe('/library');
    expect(translateText('user@example.com', 'fa')).toBe('user@example.com');
  });

  it('localizes DOM text and attributes while respecting data-no-i18n', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <p>Notifications</p>
      <input placeholder="Search music…" aria-label="Music player" />
      <span data-no-i18n>English</span>
    `;

    localizeDocument('fa', root);

    expect(root.querySelector('p')).toHaveTextContent('اعلان‌ها');
    expect(root.querySelector('input')).toHaveAttribute('placeholder', 'جستجو در موسیقی…');
    expect(root.querySelector('input')).toHaveAttribute('aria-label', 'پخش‌کننده موسیقی');
    expect(root.querySelector('[data-no-i18n]')).toHaveTextContent('English');
  });

  it('formats locale numbers with Persian digits', () => {
    const formatted = formatLocaleNumber(1234567, 'fa');
    expect(formatted).toMatch(/[۰-۹]/);
    expect(formatted).not.toMatch(/[0-9]/);
  });
});
