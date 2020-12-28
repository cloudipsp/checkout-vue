import configLocales from '@/config/locales.json'
import configTheme from '@/config/theme'
import configSubscription from '@/config/subscription'

const locales = Object.keys(configLocales)

const theme = 'light'

const config = {
  options: {
    methods: ['card'],
    methods_disabled: [],
    card_icons: ['mastercard', 'visa'],
    banklinks_eu_icons: [],
    local_methods_icons: [],
    title: '',
    full_screen: true,
    link: '',
    locales,
    api_domain: 'pay.fondy.eu',
    endpoint: {
      gateway: '/latest/checkout-v2/index.html',
      button: '/latest/checkout-v2/button/index.html',
    },
    customer_fields: [],
    active_tab: 'card',
    logo_url: '',
    offerta_url: '',
    button: true,
    fee: true,
    email: false,
    fields: false,
    default_country: '',
    countries: [],
    lang: true,
    theme: {
      type: theme,
      preset: configTheme[theme],
    },
    show_menu_first: false,
    disable_request: false,
    show_button_amount: true,
    subscription: {
      type: 'disable',
      periods: ['day', 'week', 'month'],
      quantity: false,
      trial: false,
      unlimited: true,
      readonly: false,
    },
  },
  params: {
    merchant_id: 1396424, // 900024 dev, 1396424 prod
    amount: 0,
    amount_with_fee: 0,
    fee: 0, // %
    currency: '',
    recurring: 'n',
    recurring_data: {
      period: 'month',
      every: 1,
      start_time: '',
      end_time: '',
      amount: 0,
      quantity: 0,
      trial_period: '',
      trial_quantity: 0,
    },
    card_number: '',
    expiry_date: '',
    cvv2: '',
    email: '',
    code: '',
    order_desc: '',
    offer: false,
    lang: 'en',
    custom: {}, // users x-vue-template fields
    customer_data: {}, // customer_required_data fields
    form: {}, // bank form fields
    order_id: '',
    save_card: true,
  },
  messages: {},
  validate: {},
  css_variable: {},

  // not config
  error: {
    show: false,
    code: '',
    message: '',
    errors: [], // ошибки валидации конфига
  },
  router: {
    page: '', // payment-method success
    method: '', // card banklinks_eu local_methods sepa
    system: '',
  },
  loading: false,
  cards: [],
  isSubmit: false,
  submited: false,
  read_only: false,
  need_verify_code: false,
  verification_type: '',
  cdn: '',
  cdnIcons: 'https://pay.fondy.eu/icons/dist/',
  tabs: {},
  ready: false,
  fields: [],
  validate_expdate: true,
  isOnlyCard: true,
  is_only_wallets: false,
  region: '',
  amount_readonly: true,
  show_gdpr_frame: false,
  subscription: configSubscription.disabled,
}

locales.forEach(function (locale) {
  config.messages[locale] = {}
  config.validate[locale] = {}
})

export default config
