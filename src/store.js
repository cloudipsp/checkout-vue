import configCss from '@/config/css'
import configLocales from '@/config/locales'
import configPaymentSystems from '@/config/payment-systems'
import notSet from '@/config/not-set'
import { getCookie, setOrigin, deepMerge, validate, sendRequest } from '@/utils/helpers'

export default {
  state: {
    options: {
      methods: ['card'],
      ibank: [],
      emoney: [],
      cash: [],
      fast: [],
      cardIcons: ['mastercard', 'visa'],
      title: '',
      button: true,
      fullScreen: true,
      tooltip: true,
      email: false,
      fields: false,
      link: '',
      offer: '',
      locales: [],
      messages: {},
      apiDomain: 'api.fondy.eu',
      fee: true,
      customerFields: [],
      activeTab: 'card',
      logoUrl: '',
      offertaUrl: '',
    },
    popup: {
      appendTo: 'body'
    },
    regular: {
      insert: false,
      open: false,
      hide: false,
      period: ['day', 'week', 'month']
    },
    form: {
      merchant_id: 1396424, // 900024 dev, 1396424 prod
      amount: 0,
      amount_with_fee: 0,
      fee: 0,
      currency: 'USD',
      recurring_data: {
        period: 'month',
        every: 1,
        start_time: '',
        end_time: '',
        amount: 0,
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
    },
    error: {
      flag: false,
      buffer: false,
      code: '',
      message: '',
      errors: [],
    },
    router: {
      page: undefined, // payment-method verify success
      method: undefined,
      system: undefined,
    },
    css: {},
    template: {},
    messages: {},
    validate: {},
    loading: false,
    cards: [],
    submit: false,
    read_only: false,
  },
  setOptions(options, $i18n) {
    validate(options)
    deepMerge(this.state.form, options.params, notSet.form)
    Object.assign(this.state.options, options.options, notSet.options)
    Object.assign(this.state.regular, options.regular)
    Object.assign(this.state.messages, options.messages)
    Object.assign(this.state.validate, options.validate)
    Object.assign(this.state.popup, options.popup)
    this.setFast()
    this.setCss()
    this.setLocale()
    setOrigin()
    $i18n.mergeLocaleMessage('en', this.state.messages['en'])
  },
  setFast: function () {
    let fast = []
    this.state.options.fast.forEach(function (system) {
      Object.keys(configPaymentSystems).forEach(function (method) {
        if (this.state.options[method].indexOf(system) > -1) {
          fast.push({
            method: method,
            system: system
          })
        }
      }, this)
    }, this)
    this.state.options.fast = fast
  },
  setCss: function () {
    Object.assign(this.state.css, configCss[this.state.options.css] || configCss.default)
  },
  setLocale: function () {
    let lang
    let locales = this.state.options.locales
    if (this.state.options.fullScreen) {
      lang = getCookie('lang') || this.state.form.lang
    } else {
      lang = this.state.form.lang || getCookie('lang')
    }
    if (locales.length) {
      if (locales.indexOf(lang) < 0) {
        lang = locales[0]
      }
    } else if (configLocales.indexOf(lang) < 0) {
      lang = 'en'
    }
    this.state.form.lang = lang
  },
  setCardNumber: function (card) {
    this.state.form.card_number = card.card_number.replace(/ /g, '')
    this.state.form.expiry_date = card.expiry_date.replace(/ /g, '')
    this.state.form.email = card.email
    this.state.form.hash = card.hash
    this.state.form.cvv2 = ''
    this.state.read_only = card.read_only
  },
  getAmountWithFee: function () {
    if (this.state.form.fee) {
      return sendRequest('api.checkout.fee', 'get', this.state.form, String(this.state.form.amount) + String(this.state.form.fee)).then(
        (model) => {
          this.state.form.amount_with_fee = parseInt(model.attr('amount_with_fee'))
        })
    }
  },
  location: function(page, method, system) {
    this.state.router.page = page
    this.state.router.method = method
    this.state.router.system = system
  },
  showError: function(code, message) {
    if (code || message) {
      this.state.error.code = code
      this.state.error.message = message
      setTimeout(() => {
        this.state.error.flag = true
      })
    }
  },
  formLoading: function(loading) {
    this.state.loading = loading
  }
}
