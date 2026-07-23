import React, { useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getTextDirection, localizeDocument, translateText } from '../i18n';

export default function LocalizationBridge() {
  const { settings } = useApp();
  const language = settings.language === 'fa' ? 'fa' : 'en';

  useEffect(() => {
    const direction = getTextDirection(language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dataset.language = language;
    document.title = language === 'fa' ? 'Spotune | پخش موسیقی' : 'Spotune | Music streaming';

    let scheduled = false;
    const applyLocalization = () => {
      scheduled = false;
      localizeDocument(language, document.body);
    };
    const scheduleLocalization = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(applyLocalization);
    };

    scheduleLocalization();
    const observer = new MutationObserver(scheduleLocalization);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt'],
    });

    const nativeAlert = window.alert.bind(window);
    const nativeConfirm = window.confirm.bind(window);
    const nativePrompt = window.prompt.bind(window);
    window.alert = (message) => nativeAlert(translateText(String(message), language));
    window.confirm = (message) => nativeConfirm(translateText(String(message), language));
    window.prompt = (message, defaultValue) => nativePrompt(translateText(String(message), language), defaultValue);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame?.(0);
      window.alert = nativeAlert;
      window.confirm = nativeConfirm;
      window.prompt = nativePrompt;
    };
  }, [language]);

  return null;
}
