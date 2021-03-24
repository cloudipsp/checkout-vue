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

export const loadCheckout = () =>
  import(/* webpackChunkName: "1" */ 'ipsp-js-sdk/dist/checkout').then(
    module => module.default
  )

export const loadCssVars = () =>
  import(/* webpackChunkName: "2" */ 'css-vars-ponyfill').then(
    module => module.default
  )

export const loadSentry = () =>
  import(/* webpackChunkName: "3" */ '@sentry/vue')

export const loadAsyncValidator = () =>
  import(/* webpackChunkName: "4" */ 'async-validator').then(
    module => module.default
  )

export const loadAxios = () =>
  import(/* webpackChunkName: "5" */ 'axios').then(module => module.default)

export const DatePicker = () =>
  import(
    /* webpackChunkName: "6" */ '@/components/form/item/helpers/date-picker'
  )

export const loadSvg = () =>
  import(
    /* webpackChunkName: "20" */
    '@/svg/'
  )

export const SvgServerTrouble = () =>
  loadSvg().then(({ SvgServerTrouble }) => SvgServerTrouble)

export const SvgDecline = () => loadSvg().then(({ SvgDecline }) => SvgDecline)

export const SvgVerifiedByVisa = () =>
  loadSvg().then(({ SvgVerifiedByVisa }) => SvgVerifiedByVisa)

export const SvgMasterCardSecureCode = () =>
  loadSvg().then(({ SvgMasterCardSecureCode }) => SvgMasterCardSecureCode)

export const SvgPciDss = () => loadSvg().then(({ SvgPciDss }) => SvgPciDss)

export const SvgLogo = () => loadSvg().then(({ SvgLogo }) => SvgLogo)

export const SvgTimer = () => loadSvg().then(({ SvgTimer }) => SvgTimer)

export const loadStyleAdaptive = () =>
  import(
    /* webpackChunkName: "18" */
    '@/scss/style-adaptive.scss'
  )
