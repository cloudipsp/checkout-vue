import css from '@/css'
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
      title: 'Test payment',
      button: true,
      fullScreen: true,
      email: false,
      fields: false,
      link: '',
      offer: false,
      locales: [],
      locale: 'en',
      messages: {}
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
      code: ''
    },
    error: {
      flag: false,
      buffer: false,
      code: '',
      message: ''
    },
    router: {
      page: undefined,
      method: undefined,
      system: undefined
    },
    css: {}
  },
  config: {
    locales: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українською',
      lv: 'Latviešu',
      fr: 'Français',
      cs: 'Čeština',
      sk: 'Slovenský'
    },
    methods: ['card', 'emoney', 'ibank', 'cash', 'sepa']
  },
  setOptions (options, $i18n) {
    Object.assign(this.state.options, options)
    delete this.state.options.regular
    delete this.state.options.params
    delete this.state.options.recurring_data

    Object.assign(this.state.regular, options.regular)
    Object.assign(this.state.form, options.params)
    Object.assign(this.state.form.recurring_data, options.recurring_data)
    this.validFast()
    this.validCss()
    this.validLocales($i18n)
    this.validLocale()
    this.validMethods()
  },
  validFast: function () {
    let fast = []
    this.state.options.fast.forEach(function (system) {
      ['emoney', 'ibank', 'cash'].forEach(function (method) {
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
    this.state.css = css[this.state.options.css] || css.default
  },
  validLocales: function ($i18n) {
    let result = []
    this.state.options.locales.forEach(function (locale) {
      if (locale in this.config.locales) {
        result.push(locale)
        $i18n.mergeLocaleMessage(locale, this.state.options.messages[locale])
      }
    }, this)
    this.state.options.locales = result
  },
  validLocale: function () {
    let locale = getCookie('lang') || this.state.options.locale
    let locales = this.state.options.locales
    if (locales.length && locales.indexOf(locale) < 0) {
      locale = locales[0]
    }
    this.state.options.locale = locale
  },
  validMethods: function () {
    let result = []
    this.state.options.methods.forEach(function (method) {
      if (this.config.methods.indexOf(method) > -1) {
        result.push(method)
      }
    }, this)
    this.state.options.methods = result
  }
}
