export const loadLang = chunk => {
  switch (chunk) {
    case 'cs':
      return import(
        /* webpackChunkName: "cs" */
        '@/i18n/lang/cs'
      )
    case 'de':
      return import(
        /* webpackChunkName: "de" */
        '@/i18n/lang/de'
      )
    case 'en':
      return import('@/i18n/lang/en')
    case 'es':
      return import(
        /* webpackChunkName: "es" */
        '@/i18n/lang/es'
      )
    case 'fr':
      return import(
        /* webpackChunkName: "fr" */
        '@/i18n/lang/fr'
      )
    case 'hu':
      return import(
        /* webpackChunkName: "hu" */
        '@/i18n/lang/hu'
      )
    case 'it':
      return import(
        /* webpackChunkName: "it" */
        '@/i18n/lang/it'
      )
    case 'ko':
      return import(
        /* webpackChunkName: "ko" */
        '@/i18n/lang/ko'
      )
    case 'lv':
      return import(
        /* webpackChunkName: "lv" */
        '@/i18n/lang/lv'
      )
    case 'pl':
      return import(
        /* webpackChunkName: "pl" */
        '@/i18n/lang/pl'
      )
    case 'ro':
      return import(
        /* webpackChunkName: "ro" */
        '@/i18n/lang/ro'
      )
    case 'ru':
      return import(
        /* webpackChunkName: "ru" */
        '@/i18n/lang/ru'
      )
    case 'sk':
      return import(
        /* webpackChunkName: "sk" */
        '@/i18n/lang/sk'
      )
    case 'uk':
      return import(
        /* webpackChunkName: "uk" */
        '@/i18n/lang/uk'
      )
  }
}
