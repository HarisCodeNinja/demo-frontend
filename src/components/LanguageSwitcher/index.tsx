// LanguageSwitcher.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocale } from '@/i18n';
import { Button } from '@/components/ui/button';
import { AVAILABLE_LANGUAGES } from '@/config/app';

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLocale();
  const { t } = useTranslation('common');

  return (
    <div className="flex gap-1">
      {AVAILABLE_LANGUAGES.length > 1 &&
        AVAILABLE_LANGUAGES.map((lang) => (
          <Button key={lang.code} variant={language === lang.code ? 'default' : 'outline'} size="sm" onClick={() => changeLanguage(lang)}>
            {t(lang.code)}
          </Button>
        ))}
    </div>
  );
};

export default LanguageSwitcher;
