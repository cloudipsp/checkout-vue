import { deepMerge } from '@/utils/helpers'
import { saas } from '@/config/saas'
import configLocales from '@/config/locales.json'
import configSubscription from '@/config/subscription'

const locales = Object.keys(configLocales)

let config = {
  options: {
    methods: ['card'],
    methods_disabled: [],
    most_popular_icons: [],
    card_icons: ['mastercard', 'visa'],
    banklinks_eu_icons: [],
    local_methods_icons: [],
    crypto_icons: ['bitcoincore', 'coinbase', 'binance'],
    loans_icons: [],
    emoney_icons: [],
    wallets_icons: [],
    title: '',
    hide_title: false,
    full_screen: true,
    link: '',
    hide_link: false,
    locales,
    active_tab: '',
    active_method: '',
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
      type: 'light',
      preset: '',
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
    hide_button_title: false,
    amount_readonly: true,
  },
  params: {
    amount: 0,
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
    token: '',
    promocode: '',
  },
  button: {},
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
  orderModel: {},
  order: {},
  info: {},
  cards: [],
  isSubmit: false,
  submited: false,
  read_only: false,
  tabs: {},
  ready: false,
  fields_custom: [],
  fields_customer: [],
  validate_expdate: true,
  isOnlyCard: true,
  region: '',
  show_gdpr_frame: false,
  subscription: configSubscription.disabled,
  can_make_payment: '',
  has_fields: false,
  need_validate_card: true,
  discount_percent: 0,
  discount_amount: 0,
  fee_amount: 0,
  total_amount: 0,
  notification: '',
  cvv2_requirement: 'mandatory',
  currencies: [],
  init_wallets: false,
  vm_wallets: null,
  mode_test: false,
  promo: false,
  click2pay_otp: false,
}

export const configDefault = deepMerge(config, saas)

locales.forEach(function (locale) {
  configDefault.messages[locale] = {}
  configDefault.validate[locale] = {}
})
