import React, { useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { getTextDirection, localizeDocument } from '../i18n';
import { localizeExtraDocument } from '../i18n/extra';
import { localizeFragments } from '../i18n/fragments';
import { translateAppText } from '../i18n/useI18n';

export default function LocalizationBridge() {
  const { settings } = useApp();
  const language = settings.language === 'fa' ? 'fa' : 'en';

  useEffect(() => {
    const direction = getTextDirection(language);
    const applyDocumentLocale = () => {
      document.documentElement.lang = language;
      document.documentElement.dir = direction;
      document.body.dataset.language = language;
      document.title = language === 'fa' ? 'Spotune | پخش موسیقی' : 'Spotune | Music streaming';
    };

    applyDocumentLocale();

    let frameId = null;
    const applyLocalization = () => {
      frameId = null;
      // AppContext historically set a fixed LTR locale on mount. Re-assert the
      // selected locale here so the user setting is always authoritative.
      applyDocumentLocale();
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

    const localizeMessage = (message) => translateAppText(String(message), language);
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
