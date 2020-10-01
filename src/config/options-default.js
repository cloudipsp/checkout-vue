import configLocales from '@/config/locales.json'
import configCss from '@/config/css'
import configTheme from '@/config/theme'

const locales = Object.keys(configLocales)

const theme = 'light'

const options = {
  options: {
    methods: ['card'],
    methods_disabled: [],
    banklinks_eu: [],
    card_icons: ['mastercard', 'visa'],
    banklinks_eu_icons: [],
    local_methods_icons: [],
    title: '',
    full_screen: true,
    link: '',
    locales,
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
    fee: true,
    email: false,
    fields: false,
    default_country: '',
    countries: [],
    lang: true,
    css: '',
    theme: {
      type: theme,
      preset: configTheme[theme],
    },
    show_menu_first: true,
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
    custom: {}, // users x-vue-template fields
    customer_data: {}, // customer_required_data fields
    form: {}, // bank form fields
    order_id: '',
    save_card: true,
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
    page: '', // payment-method success
    method: '', // card banklinks_eu local_methods sepa
    system: '',
  },
  css: configCss.default,
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
  region: '',
  disable_request: false,
}

locales.forEach(function(locale) {
  options.messages[locale] = {}
  options.validate[locale] = {}
})

export default options
