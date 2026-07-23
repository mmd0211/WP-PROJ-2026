import React, { useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getTextDirection, localizeDocument, translateText } from '../i18n';
import { localizeExtraDocument, translateExtraText } from '../i18n/extra';
import { localizeFragments, translateFragment } from '../i18n/fragments';

export default function LocalizationBridge() {
  const { settings } = useApp();
  const language = settings.language === 'fa' ? 'fa' : 'en';

  useEffect(() => {
    const direction = getTextDirection(language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dataset.language = language;
    document.title = language === 'fa' ? 'Spotune | پخش موسیقی' : 'Spotune | Music streaming';

    let frameId = null;
    const applyLocalization = () => {
      frameId = null;
      localizeDocument(language, document.body);
      localizeExtraDocument(language, document.body);
      localizeFragments(language, document.body);
    };
    const scheduleLocalization = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(applyLocalization);
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

    const localizeMessage = (message) => translateFragment(translateExtraText(translateText(String(message), language), language), language);
    const nativeAlert = window.alert.bind(window);
    const nativeConfirm = window.confirm.bind(window);
    const nativePrompt = window.prompt.bind(window);
    window.alert = (message) => nativeAlert(localizeMessage(message));
    window.confirm = (message) => nativeConfirm(localizeMessage(message));
    window.prompt = (message, defaultValue) => nativePrompt(localizeMessage(message), defaultValue);

    return () => {
      observer.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.alert = nativeAlert;
      window.confirm = nativeConfirm;
      window.prompt = nativePrompt;
    };
  }, [language]);

  return null;
}
