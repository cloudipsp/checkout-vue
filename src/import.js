export const loadLang = chunk => {
  switch (chunk) {
    case 'az':
      return import(
        /* webpackChunkName: "az" */
        '@/i18n/lang/az'
      )
    case 'cs':
      return import(
        /* webpackChunkName: "cs" */
        '@/i18n/lang/cs'
      )
    case 'da':
      return import(
        /* webpackChunkName: "da" */
        '@/i18n/lang/da'
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
    case 'fi':
      return import(
        /* webpackChunkName: "fi" */
        '@/i18n/lang/fi'
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
    case 'nl':
      return import(
        /* webpackChunkName: "nl" */
        '@/i18n/lang/nl'
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
    case 'zh':
      return import(
        /* webpackChunkName: "zh" */
        '@/i18n/lang/zh'
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

export const loadCardBrands = () =>
  import(/* webpackChunkName: "7" */ '@/config/card-brands').then(
    module => module.default
  )

export const FAlertGdpr = () =>
  import(/* webpackChunkName: "8" */ '@/components/alert/alert-gdpr')

export const Card = () =>
  import(/* webpackChunkName: "11" */ '@/views/checkout/method/card')

export const CardIndex = () =>
  import(/* webpackChunkName: "11" */ '@/views/checkout/method/card/index')

export const Banklinks_eu = () =>
  import(/* webpackChunkName: "12" */ '@/views/checkout/method/banklinks_eu')

export const Local_methods = () =>
  import(/* webpackChunkName: "13" */ '@/views/checkout/method/local_methods')

export const Sepa = () =>
  import(/* webpackChunkName: "14" */ '@/views/checkout/method/sepa')

export const Receipt = () =>
  import(/* webpackChunkName: "15" */ '@/views/checkout/method/receipt')

export const Wallets = () =>
  import(/* webpackChunkName: "16" */ '@/views/checkout/method/wallets')

export const Loans = () =>
  import(/* webpackChunkName: "17" */ '@/views/checkout/method/loans')

export const loadStyleAdaptive = () =>
  import(
    /* webpackChunkName: "18" */
    '@/scss/style-adaptive.scss'
  )

export const Success = () =>
  import(
    /* webpackChunkName: "19" */ '@/views/checkout/without-sidebar/success'
  )

export const FSecurityIcons = () =>
  import(/* webpackChunkName: "20" */ '@/components/security-icons')

export const Error = () => import(/* webpackChunkName: "21" */ '@/views/error')

export const ErrorModal = () =>
  import(/* webpackChunkName: "22" */ '@/views/error_modal')

export const System = () =>
  import(/* webpackChunkName: "23" */ '@/views/checkout/method/system')

export const FSubscription = () =>
  import(/* webpackChunkName: "24" */ '@/components/subscription')

export const CardVerify = () =>
  import(/* webpackChunkName: "25" */ '@/views/checkout/method/card/verify')

export const InputText = () =>
  import(/* webpackChunkName: "26" */ '@/components/input-text')

export const InputHidden = () =>
  import(/* webpackChunkName: "26" */ '@/components/input-hidden')

export const InputAmount = () =>
  import(/* webpackChunkName: "26" */ '@/components/input-amount')

export const WithoutSidebar = () =>
  import(/* webpackChunkName: "27" */ '@/views/checkout/without-sidebar')

export const Menu = () =>
  import(/* webpackChunkName: "28" */ '@/views/checkout/without-sidebar/menu')

export const FModalError = () =>
  import(/* webpackChunkName: "29" */ '@/components/modal/modal-error')

export const SvgLogo = () => import(/* webpackChunkName: "30" */ '@/svg/logo')

export const BlankWallets = () =>
  import(/* webpackChunkName: "31" */ '@/views/checkout/blank/wallets')

export const FCardListWrapper = () =>
  import(/* webpackChunkName: "32" */ '@/components/card-list-wrapper')

export const TooltipTemplate = () =>
  import(
    /* webpackChunkName: "33" */ '@/components/tooltip/helpers/tooltip-template'
  )

export const Emoney = () =>
  import(/* webpackChunkName: "34" */ '@/views/checkout/method/emoney')

export const FAlertNotification = () =>
  import(/* webpackChunkName: "35" */ '@/components/alert/alert-notification')

export const FSidebarInner = () =>
  import(/* webpackChunkName: "36" */ '@/components/sidebar-inner')
