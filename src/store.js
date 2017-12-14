import config from '@/config/config'
import configCss from '@/config/css'
import configTemplate from '@/config/template'
import configLocales from '@/config/locales'
import configPaymentSystems from '@/config/payment-systems'
import { getCookie, setOrigin } from '@/utils/helpers'
import Schema from 'async-validator'

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
      offer: false,
      locales: [],
      messages: {},
      apiDomain: 'api.fondy.eu'
    },
    regular: {
      insert: false,
      open: false,
      hide: false,
      period: ['day', 'week', 'month', 'year']
    },
    form: {
      merchant_id: 900024, // 900024 dev, 1396424 prod
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
      token: '',
      lang: 'en'
    },
    error: {
      flag: false,
      buffer: false,
      code: '',
      message: '',
      errors: []
    },
    router: {
      page: undefined, // payment-method verify success
      method: undefined,
      system: undefined
    },
    css: {},
    template: {},
    messages: {},
    validate: {}
  },
  setOptions (options, $i18n) {
    this.validate(options)
    Object.assign(this.state.options, options.options)
    Object.assign(this.state.regular, options.regular)
    Object.assign(this.state.form, options.params, {
      card_number: '',
      expiry_date: '',
      cvv2: '',
      code: '',
      fee: 0,
      amount_with_fee: 0,
    })
    Object.assign(this.state.form.recurring_data, options.recurring)
    Object.assign(this.state.messages, options.messages)
    Object.assign(this.state.validate, options.validate)
    this.setFast()
    this.setCss()
    this.setLocale()
    setOrigin()
    $i18n.mergeLocaleMessage('en', this.state.messages['en'])
  },
  validate: function (options) {
    new Schema(config).validate(options, (errors, fields) => {
      if (errors) {
        // console.log(errors, fields)
        this.state.error.errors = errors
      }
    })
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
    let css = configCss[this.state.options.css]
    if (css) {
      this.state.css = css
    } else {
      this.state.css = configCss.default
      this.state.template = configTemplate[this.state.options.template] || configTemplate.default
    }
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
    } else
    if (!(lang in configLocales)) {
      lang = 'en'
    }
    this.state.form.lang = lang
  },
}
