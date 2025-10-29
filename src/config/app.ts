import { ILanguage } from '@/interface/common';

const appConfig = {
  BASE_URL: 'https://hrms-live-backend.hyperapp.site',
  FILE_PATH: 'https://hrms-live-backend.hyperapp.site/public/',
  ENVIRONMENT: 'development',
  PERSIST_STORE_NAME: 'boilerplate',
  CACHE_TOKEN: '3002910e-c28d-45c2-9ce5-edf9b8831724',
};

export const AVAILABLE_LANGUAGES: ILanguage[] = [
  {
    code: 'en',
    dir: 'ltr',
  },
];

export const { ENVIRONMENT, PERSIST_STORE_NAME, BASE_URL, FILE_PATH, CACHE_TOKEN } = appConfig;
export default appConfig;
