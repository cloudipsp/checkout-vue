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
    crypto_icons: ['bitcoincore', 'coinbase', 'binance'],
    loans_icons: [],
    emoney_icons: [],
    wallets_icons: [],
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
    active_tab: '',
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
    loading: '',
  },
  params: {
    merchant_id: 1396424, // 900024 dev, 1396424 prod
    amount: null,
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
    hash: '',
    expiry_date: '',
    cvv2: '',
    email: '',
    code: '',
    order_desc: '',
    offer: false,
    lang: '',
    custom: {}, // users x-vue-template fields
    customer_data: {}, // customer_required_data fields
    form: {}, // bank form fields
    order_id: '',
    save_card: true,
    verification_type: null,
  },
  messages: {},
  validate: {},
  css_variable: {},

  // not config
  css_class: {},
  error: {
    show: false,
    code: '',
    message: '',
  },
  loading: false,
  order: {},
  cards: [],
  isSubmit: false,
  submited: false,
  read_only: false,
  tabs: {},
  ready: false,
  fields: [],
  validate_expdate: true,
  isOnlyCard: true,
  region: '',
  amount_readonly: true,
  show_gdpr_frame: false,
  subscription: configSubscription.disabled,
  can_make_payment: '',
  has_fields: false,
  need_validate_card: true,
  amount_with_fee: 0,
  actual_amount: 0,
  card_type_fee: 0,
  notification: '',
  currencies: [],
}

locales.forEach(function (locale) {
  config.messages[locale] = {}
  config.validate[locale] = {}
})

export default config
