import { useCallback, useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { formatLocaleNumber, getTextDirection, translateText } from './index';
import { translateExtraText } from './extra';
import { translateFragment } from './fragments';

export function translateAppText(value, language = 'en') {
  return translateFragment(translateExtraText(translateText(value, language), language), language);
}

export function useI18n() {
  const { settings } = useApp();
  const language = settings.language === 'fa' ? 'fa' : 'en';
  const direction = getTextDirection(language);
  const locale = language === 'fa' ? 'fa-IR' : 'en-US';

  const t = useCallback((value) => translateAppText(value, language), [language]);
  const number = useCallback((value) => formatLocaleNumber(value, language), [language]);

  return useMemo(() => ({ language, direction, locale, t, number }), [language, direction, locale, t, number]);
}
