import configLocales from '@/config/locales'
import configCss from '@/config/css'

const options = {
  options: {
    methods: ['card'],
    banklinks_eu: [],
    card_icons: ['mastercard', 'visa'],
    banklinks_eu_icons: [],
    title: '',
    full_screen: true,
    link: '',
    locales: configLocales,
    messages: {},
    api_domain: 'api.fondy.eu',
    endpoint: {
      gateway: '/checkout/v2/index.html',
      button: '/checkout/v2/button/index.html',
    },
    customer_fields: [],
    active_tab: 'card',
    logo_url: '',
    offerta_url: '',
    button: true,
    cancel: false,
    fee: true,
    email: false,
    fields: false,
    default_country: '',
    countries: [],
    lang: true,
    css: '',
    theme: {
      type: 'light',
      preset: 'fondy',
    },
    region: 'ua',
  },
  regular: {
    insert: false,
    open: false,
    period: ['day', 'week', 'month'],
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
      readonly: false,
    },
    card_number: '',
    expiry_date: '',
    cvv2: '',
    email: '',
    code: '',
    order_desc: '',
    offer: false,
    lang: 'en',
    custom: {},
    customer_data: {},
    order_id: '',
  },
  template: {},
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
    page: '', // payment-method success pending
    method: '', // card banklinks_eu sepa
    system: '',
  },
  css: configCss.default,
  loading: false,
  cards: [],
  submit: false,
  read_only: false,
  need_verify_code: false,
  verification_type: '',
  cdn: 'https://pay.fondy.eu/icons/dist/svg/',
  tabs: {},
  ready: false,
  showModalMethods: false,
  fields: [],
  validate_expdate: true,
  isOnlyCard: true,
}

configLocales.forEach(function(locale) {
  options.messages[locale] = {}
  options.validate[locale] = {}
})

export default options
