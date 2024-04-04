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
      return import(/* webpackChunkName: "en" */ '@/i18n/lang/en')
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
    case 'ka':
      return import(
        /* webpackChunkName: "ka" */
        '@/i18n/lang/ka'
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

export const Vue = () =>
  import(/* webpackChunkName: "00" */ 'vue').then(module => module.default)

export const App = () =>
  import(/* webpackChunkName: "01" */ '@/app').then(module => module.default)

export const installValidate = () =>
  import(/* webpackChunkName: "02" */ '@/validate').then(
    ({ install }) => install
  )

export const installComponents = () =>
  import(/* webpackChunkName: "03" */ '@/components').then(
    ({ install }) => install
  )

export const installApi = () =>
  import(/* webpackChunkName: "04" */ '@/api').then(({ install }) => install)

export const i18n = () => import(/* webpackChunkName: "05" */ '@/i18n')

export const router = () => import(/* webpackChunkName: "06" */ '@/router')

export const store = () => import(/* webpackChunkName: "07" */ '@/store')

export const configDefault = () =>
  import(/* webpackChunkName: "08" */ '@/config/config-default')

export const inspect = () =>
  import(/* webpackChunkName: "09" */ '@/utils/inspect')

export const loadCheckout = () =>
  import(/* webpackChunkName: "1" */ 'ipsp-js-sdk/dist/checkout').then(
    module => module.default
  )

export const loadCssVars = () =>
  import(/* webpackChunkName: "2" */ 'css-vars-ponyfill').then(
    module => module.default
  )

export const installSentry = () =>
  import(/* webpackChunkName: "3" */ '@/sentry').then(({ install }) => install)

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

export const FIconBin = () =>
  import(/* webpackChunkName: "7" */ '@/components/icon-bin')

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

export const SvgLogo = () =>
  import(/* webpackChunkName: "30" */ '@/svg/logo.svg')

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

export const Crypto = () =>
  import(/* webpackChunkName: "37" */ '@/views/checkout/method/crypto')

export const MostPopular = () =>
  import(/* webpackChunkName: "38" */ '@/views/checkout/method/most_popular')

export const FCountry = () =>
  import(/* webpackChunkName: "39" */ '@/components/country')

export const countriesSearch = () =>
  import(/* webpackChunkName: "40" */ '@/config/countries-search')

export const FAlertGdprYapily = () =>
  import(/* webpackChunkName: "41" */ '@/components/alert/alert-gdpr-yapily')

export const FLoading = () =>
  import(/* webpackChunkName: "42" */ '@/components/loading')

export const FLoadingDefault = () =>
  import(/* webpackChunkName: "43" */ '@/components/loading-default')

export const FLoadingCustom = () =>
  import(/* webpackChunkName: "44" */ '@/components/loading-custom')

export const LoadingMono = () =>
  import(/* webpackChunkName: "45" */ '@/views/checkout/loading-monobank')

export const Installments = () =>
  import(
    /* webpackChunkName: "46" */ '@/views/checkout/method/installments/list'
  )

export const InstallmentsSystem = () =>
  import(
    /* webpackChunkName: "47" */ '@/views/checkout/method/installments/system'
  )

export const FMode = () => import(/* webpackChunkName: "48" */ '@/views/mode')

export const FButtonCancel = () =>
  import(/* webpackChunkName: "49" */ '@/components/button/button-cancel')

export const FPromo = () =>
  import(/* webpackChunkName: "50" */ '@/components/promo')

export const countriesCallingCodes = () =>
  import(/* webpackChunkName: "51" */ '@/config/countries-calling-codes')

export const FButtonReturnToSite = () =>
  import(
    /* webpackChunkName: "52" */ '@/views/checkout/without-sidebar/button-return-to-site'
  )

export const FLinkDownloadReceipt = () =>
  import(
    /* webpackChunkName: "52_" */ '@/views/checkout/without-sidebar/link-download-receipt'
  )
