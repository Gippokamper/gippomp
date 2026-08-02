import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
// import LanguageDetector from 'i18next-browser-languagedetector'
import { API_URL } from '../helpers/request'

i18n

  // Enables the i18next backend
  .use(Backend)

  // Enable automatic language detection
  //   .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)
  .init({
    supportedLngs: ['uz', 'en', 'ru'],
    fallbackLng: 'uz',

    lng: 'uz',
    backend: {
      /* translation file path */
      loadPath: API_URL + '/vocabulary?lang={{lng}}',
      customHeaders: () => {
        const token = window.localStorage.getItem('accessToken')
        // Token bo'lmasa 'Bearer null' yubormaymiz — aks holda ochiq sahifalarda 401 bo'ladi.
        return token ? { authorization: 'Bearer ' + token } : {}
      }
    },
    debug: false,
    keySeparator: false,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n
