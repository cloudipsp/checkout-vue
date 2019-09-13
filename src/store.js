import optionsDefault from '@/config/options-default'
import configCss from '@/config/css'
import configPaymentSystems from '@/config/payment-systems'
import notSet from '@/config/not-set'
import {
  getCookie,
  setCookie,
  deepMerge,
  validate,
  sendRequest,
} from '@/utils/helpers'
import { isObject, isExist } from '@/utils/object'
import { i18n, loadLanguageAsync } from '@/i18n'

export default {
  setStateDefault: function() {
    this.state = JSON.parse(JSON.stringify(optionsDefault))
  },
  default: optionsDefault,
  setOptions(optionsUser) {
    this.optionsFormat(optionsUser)
    validate(optionsUser)
    this.user = optionsUser
    deepMerge(this.state.params, optionsUser.params, notSet.params)
    deepMerge(this.state.options, optionsUser.options, notSet.options)
    Object.assign(this.state.regular, optionsUser.regular)
    Object.assign(this.state.messages, optionsUser.messages)
    Object.assign(this.state.validate, optionsUser.validate)
    Object.assign(this.state.popup, optionsUser.popup)
    this.setFast()
    this.setCss()
    this.setLocale()
    this.setLocation()
  },
  optionsFormat: function(options) {
    let regex = /[A-Z]+/g

    if (!isObject(options)) return

    for (let prop in options) {
      if (options.hasOwnProperty(prop)) {
        let modified = prop.replace(regex, function(match) {
          return '_' + match.toLowerCase()
        })
        if (prop !== modified) {
          if (options.hasOwnProperty(modified)) continue
          options[modified] = options[prop]
          delete options[prop]
          this.optionsFormat(options[modified])
        } else {
          this.optionsFormat(options[prop])
        }
      }
    }
  },
  setFast: function() {
    let fast = []
    this.state.options.fast.forEach(function(system) {
      Object.keys(configPaymentSystems).forEach(function(method) {
        if (this.state.options[method].indexOf(system) > -1) {
          fast.push({
            method: method,
            system: system,
          })
        }
      }, this)
    }, this)
    this.state.options.fast = fast
  },
  setCss: function() {
    Object.assign(
      this.state.css,
      configCss[this.state.options.css] || configCss.default
    )
  },
  setLocale: function() {
    let lang
    let locales = this.state.options.locales
    if (this.state.options.full_screen) {
      lang = getCookie('lang') || this.state.params.lang
    } else {
      lang = this.state.params.lang || getCookie('lang')
    }
    if (locales.length) {
      if (locales.indexOf(lang) < 0) {
        lang = locales[0]
      }
    }
    this.changeLocale(lang)
  },
  changeLocale(lang) {
    loadLanguageAsync(lang).then(() => {
      this.state.params.lang = lang

      setCookie('lang', lang, {
        path: '/',
        expires: 3600,
      })
    })
  },
  setLocation: function() {
    let methods = this.state.options.methods
    let active_tab = this.state.options.active_tab
    let method = methods.indexOf(active_tab) > -1 ? active_tab : methods[0]
    this.location('f-payment-method', method)
  },
  setCardNumber: function(card) {
    this.state.params.card_number = card.card_number.replace(/ /g, '')
    this.state.params.expiry_date = card.expiry_date.replace(/ /g, '')
    this.state.params.email = card.email || this.state.params.email
    this.state.params.hash = card.hash
    this.state.params.cvv2 = ''
    this.state.read_only = card.read_only
  },
  getAmountWithFee: function() {
    if (this.state.params.fee && this.state.params.amount) {
      return sendRequest(
        'api.checkout.fee',
        'get',
        this.state.params,
        String(this.state.params.amount) + String(this.state.params.fee)
      ).then(model => {
        this.state.params.amount_with_fee = parseInt(
          model.attr('amount_with_fee')
        )
      })
    }
  },
  location: function(page, method, system) {
    this.state.showChangeMethods = false
    this.state.router.page = page
    this.state.router.method = method
    this.state.router.system = system
  },
  locationSystem: function(system) {
    this.state.router.system = system
  },
  showError: function(code, message) {
    if (code || message) {
      this.state.error.code = code
      this.state.error.message = message
      this.state.error.show = true
    }
  },
  formLoading: function(loading) {
    if (loading) {
      this.state.error.show = false
    }

    this.state.loading = loading
  },
  setParams(params) {
    if (this.state.params.token || this.state.params.order_id) {
      console.warn(
        'You can not change the parameters if there is a token or an order is created'
      )
      return
    }
    validate({ params: params })
    if (!this.state.error.errors.length) {
      deepMerge(this.state.params, params, notSet.params)
    }
  },
  formParams() {
    let params = Object.assign({}, this.state.params)

    let custom = {}
    for (let field in params.custom) {
      if (params.custom.hasOwnProperty(field)) {
        custom[field] = {
          value: params.custom[field],
          label: i18n.t(field),
        }
      }
    }
    params.custom = custom

    params.payment_system = this.state.router.system || this.state.router.method

    if (this.state.need_verify_code) {
      delete params.custom
    }

    params.amount = params.amount / 100
    if (this.state.params.recurring_data.amount) {
      this.state.params.recurring_data.amount =
        this.state.params.recurring_data.amount / 100
    }

    if (params.recurring === 'n') {
      delete params.recurring_data
    }
    return params
  },
  setError(errors) {
    this.state.error.errors = errors
  },
}
