import configCss from '@/config/css'
import configLocales from '@/config/locales'
import configMethods from '@/config/methods'
import configPaymentSystems from '@/config/payment-systems'
import { getCookie } from '@/utils/helpers'

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
      email: false,
      fields: false,
      link: '',
      offer: false,
      locales: [],
      lang: 'en',
      messages: {},
      digitsCvv: 3
    },
    regular: {
      insert: false,
      open: false,
      hide: false,
      period: ['day', 'week', 'month', 'year']
    },
    form: {
      // merchant_id: '1396424', // prod
      merchant_id: '900024', // dev
      amount: 100,
      fee: 0,
      amount_with_fee: 0,
      currency: 'UAH',
      recurring_data: {
        period: 'month',
        every: 1,
        start_time: '',
        end_time: '',
        amount: 100
      },
      card_number: '',
      expiry_date: '',
      cvv2: '',
      email: '',
      code: '',
      order_desc: '',
      offer: false,
      token: ''
    },
    error: {
      flag: false,
      buffer: false,
      code: '',
      message: ''
    },
    router: {
      page: undefined, // payment-method verify success
      method: undefined,
      system: undefined
    },
    css: {},
    messages: {}
  },
  setOptions (options, $i18n) {
    Object.assign(this.state.options, options.options)
    Object.assign(this.state.regular, options.regular)
    Object.assign(this.state.form, options.params)
    Object.assign(this.state.form.recurring_data, options.recurring_data)
    Object.assign(this.state.messages, options.messages)
    this.validFast()
    this.validCss()
    this.validLocales()
    this.validLocale()
    this.validMethods()
    $i18n.mergeLocaleMessage('en', this.state.messages['en'])
  },
  validFast: function () {
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
  validCss: function () {
    this.state.css = configCss[this.state.options.css] || configCss.default
  },
  validLocales: function () {
    let result = []
    this.state.options.locales.forEach(function (lang) {
      if (lang in configLocales) {
        result.push(lang)
      }
    }, this)
    this.state.options.locales = result
  },
  validLocale: function () {
    let lang
    let locales = this.state.options.locales
    if (this.state.options.fullScreen) {
      lang = getCookie('lang') || this.state.options.lang
    } else {
      lang = this.state.options.lang || getCookie('lang')
    }
    if (locales.length) {
      if (locales.indexOf(lang) < 0) {
        lang = locales[0]
      }
    } else
    if (!(lang in configLocales)) {
      lang = 'en'
    }
    this.state.options.lang = lang
  },
  validMethods: function () {
    let result = []
    this.state.options.methods.forEach(function (method) {
      if (configMethods.indexOf(method) > -1) {
        result.push(method)
      }
    }, this)
    this.state.options.methods = result
  }
}
