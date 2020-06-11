import configLocales from '@/config/locales'
import configCss from '@/config/css'
import css_varisble from '@/config/css-varisble'

const options = {
  options: {
    methods: ['card'],
    trustly: [],
    fast: [],
    card_icons: ['mastercard', 'visa'],
    trustly_icons: [],
    title: '',
    full_screen: true,
    link: '',
    locales: [],
    messages: {},
    api_domain: 'api.fondy.eu',
    customer_fields: [],
    active_tab: 'card',
    logo_url: '',
    offerta_url: '',
    button: true,
    cancel: false,
    fee: true,
    tooltip: true,
    email: false,
    fields: false,
    default_country: '',
    countries: [],
    lang: true,
    css: '',
  },
  popup: {
    append_to: 'body',
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
  css_variable: css_varisble,

  // not config
  error: {
    show: false,
    code: '',
    message: '',
    errors: [], // ошибки валидации конфига
  },
  router: {
    page: '', // payment-method success pending
    method: '', // card trustly sepa
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
}

configLocales.forEach(function(locale) {
  options.messages[locale] = {}
  options.validate[locale] = {}
})

export default options
