import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translation_en from '@i18n/en.json';
import translation_zh from '@i18n/zh.json';

const resources = {
    en: {
        translation: translation_en,
    },
    zh: {
        translation: translation_zh,
    },
};

i18n.use(initReactI18next).init({
    resources,
    // 默认语言  zh/en  中文/英文
    lng: 'zh',
    interpolation: {
        escapeValue: false,
    },
}).then();

export default i18n;