import { describe, expect, it } from 'vitest';
import { getTextDirection, translateText } from '../i18n';
import { translateExtraText } from '../i18n/extra';
import { translateFragment } from '../i18n/fragments';

describe('bilingual localization', () => {
  it('translates core interface copy to Persian', () => {
    expect(translateText('Application Settings', 'fa')).toBe('تنظیمات برنامه');
    expect(translateText('Notifications', 'fa')).toBe('اعلان‌ها');
  });

  it('translates Persian copy back to English', () => {
    expect(translateText('تنظیمات برنامه', 'en')).toBe('Application Settings');
    expect(translateText('اعلان‌ها', 'en')).toBe('Notifications');
  });

  it('translates dynamic counters in both directions', () => {
    expect(translateText('18 streams today', 'fa')).toBe('۱۸ پخش امروز');
    expect(translateText('۱۸ پخش امروز', 'en')).toBe('18 streams today');
  });

  it('uses RTL for Persian and LTR for English', () => {
    expect(getTextDirection('fa')).toBe('rtl');
    expect(getTextDirection('en')).toBe('ltr');
  });

  it('covers studio and dashboard copy', () => {
    expect(translateExtraText('Artist Verification', 'fa')).toBe('احراز هویت هنرمندان');
    expect(translateExtraText('Publish a new release', 'fa')).toBe('انتشار اثر جدید');
  });

  it('localizes mixed numeric fragments', () => {
    expect(translateFragment('55%', 'fa')).toBe('۵۵٪');
    expect(translateFragment('۵۵٪', 'en')).toBe('55%');
  });
});
