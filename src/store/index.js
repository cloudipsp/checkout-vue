import Vue from 'vue'

import optionsDefault from '@/config/options-default'
import configCss from '@/config/css'
import notSet from '@/config/not-set'
import cssVarisble from '@/config/css-varisble'
import {
  getCookie,
  setCookie,
  deepMerge,
  findGetParameter,
  errorHandler,
} from '@/utils/helpers'
import { initApi, sendRequest } from '@/utils/api'
import { isPlainObject } from '@/utils/typeof'
import { loadLanguageAsync } from '@/i18n/index'
import i18n from '@/i18n/index'
import store from './setup'
import { getLabel } from '@/store/button'
import initCssVariable from '@/store/css-variable'
import { methods } from '@/utils/compatibility'
import { localStorage } from '@/utils/store'
import config from '@/config/config'
import Schema from 'async-validator'

Vue.use(store)

export default {
  attr(name, value) {
    name = (name || '').split('.')
    let data = this
    let prop = name.pop()
    let len = arguments.length
    for (let i = 0; i < name.length; i++) {
      if (data && data.hasOwnProperty(name[i])) {
        data = data[name[i]]
      } else {
        if (len === 2) {
          data = data[name[i]] = {}
        } else {
          break
        }
      }
    }
    if (len === 1) {
      return data ? data[prop] : null
    }
    if (len === 2) {
      data[prop] = value
    }
  },
  sendRequest(...args) {
    if (this.state.options.disable_request) return Promise.reject()

    return sendRequest(...args).catch(model => {
      this.showError(model.attr('error.code'), model.attr('error.message'))
      return Promise.reject(model)
    })
  },
  setStateDefault() {
    this.state = JSON.parse(JSON.stringify(optionsDefault))
  },
  default: optionsDefault,
  setOptions(optionsUser) {
    this.optionsFormat(optionsUser)
    this.validate(optionsUser)
    this.user = optionsUser
    deepMerge(this.state.params, optionsUser.params, notSet.params)
    deepMerge(this.state.options, optionsUser.options, notSet.options)
    Object.assign(this.state.regular, optionsUser.regular)
    Object.assign(this.state.messages, optionsUser.messages)
    Object.assign(this.state.validate, optionsUser.validate)
    Object.assign(
      this.state.css_variable,
      cssVarisble(this.state.options.theme),
      optionsUser.css_variable,
      this.state.options.theme
    )
    Object.assign(
      this.state.css,
      configCss[this.state.options.css],
      optionsUser.css
    )
    this.initCdn()
    this.initMethods()
    this.initLang()
    this.initLocation()
    this.initError()
    this.initToken()
    this.initApi()
    this.initReferrer()
    this.initCssDevice()
    this.initOnlyCard()
    this.initShowMenuFirst()
    initCssVariable(this.state.css_variable)
  },
  optionsFormat(options) {
    let regex = /[A-Z]+/g

    if (!isPlainObject(options)) return

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
  validate(options) {
    new Schema(config).validate(options, errors => {
      if (!errors) return
      this.setError(errors)
    })
  },
  initCdn() {
    let scriptFondyEl = [
      ...document.querySelectorAll('script[src$="checkout.js"]'),
    ].filter(item => /fondy/.test(item.src))[0]

    if (!scriptFondyEl) return

    this.state.cdn = scriptFondyEl.src.replace('/checkout.js', '')
  },
  initMethods() {
    this.state.options.methods = methods(
      this.state.options.methods,
      this.state.options.methods_disabled
    )
  },
  initLang() {
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
    this.changeLang(lang)
  },
  initError() {
    const token = findGetParameter('token')
    const button = findGetParameter('button')
    if ((this.state.params.token || token) && button) {
      this.setError([
        {
          message:
            "Conflict error: order token and button token can't be used concurrently.",
        },
      ])
    }
  },
  initToken() {
    this.setParam(this.state.params, 'token', findGetParameter('token'))
  },
  initCssDevice() {
    if (!this.state.options.full_screen) return

    require('@/scss/style-adaptive.scss?no-extract')
  },
  initOnlyCard() {
    this.state.isOnlyCard =
      this.state.options.methods.length === 1 &&
      this.state.options.methods[0] === 'card'
  },
  initShowMenuFirst() {
    this.state.options.show_menu_first =
      this.state.options.show_menu_first && !this.state.isOnlyCard
  },
  setButtonParams(options) {
    deepMerge(this.state, options)
  },
  setParam(object, key, value) {
    if (!value) return
    object[key] = value
  },
  initApi() {
    initApi(
      {
        origin: 'https://' + this.state.options.api_domain,
        endpoint: this.state.options.endpoint,
      },
      () => {
        this.formLoading(false)
      }
    )
  },
  initReferrer() {
    this.state.params.referrer = document.referrer
  },
  changeLang(lang) {
    loadLanguageAsync(lang, this)
      .then(() => {
        this.state.params.lang = lang

        setCookie('lang', lang, {
          path: '/',
          expires: 3600,
        })
      })
      .catch(errorHandler)
  },
  initLocation() {
    let methods = this.state.options.methods
    let active_tab = this.state.router.method
    let method = methods.indexOf(active_tab) > -1 ? active_tab : methods[0]
    this.state.router.page = 'payment-method'
    this.state.router.method = method
  },
  setCardNumber(card) {
    this.state.params.card_number = card.card_number || ''
    this.state.params.expiry_date = card.expiry_date || ''
    this.state.params.email = card.email || this.state.params.email
    this.state.params.hash = card.hash
    this.state.params.cvv2 = ''
    this.state.read_only = card.read_only
  },
  getAmountWithFee() {
    if (!this.state.params.amount) return
    if (!this.state.params.fee) return
    return this.sendRequest('api.checkout.fee', 'get', this.state.params, {
      cached: true,
      params: {
        amount: this.state.params.amount,
        fee: this.state.params.fee,
      },
    })
      .then(model => {
        this.state.params.amount_with_fee = parseInt(
          model.attr('amount_with_fee')
        )
      })
      .catch(errorHandler)
  },
  location(page, method, system) {
    this.state.options.show_menu_first = false
    this.state.router.page = page
    this.state.router.method = method
    this.state.router.system = system
  },
  locationSystem(system) {
    this.state.router.system = system
  },
  showError(code, message) {
    this.state.error.code = code
    this.state.error.message = message
    this.state.error.show = true
  },
  formLoading(loading) {
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
    this.validate({ params: params })
    if (!this.state.error.errors.length) {
      deepMerge(this.state.params, params, notSet.params)
    }
  },
  formParams() {
    // copy params
    let params = JSON.parse(JSON.stringify(this.state.params))

    params.save_card = Boolean(localStorage.get('save_card'))

    params.custom = Object.fromEntries(
      Object.entries(params.custom).map(([name, value]) => {
        return [
          name,
          {
            value,
            label: getLabel(name) || i18n.t(name),
          },
        ]
      })
    )
    params.payment_system = this.state.router.system || this.state.router.method

    if (this.state.need_verify_code) {
      delete params.custom
    }

    params.amount = params.amount / 100
    if (params.recurring_data.amount) {
      params.recurring_data.amount = params.recurring_data.amount / 100
    }

    if (params.recurring === 'n') {
      delete params.recurring_data
    }
    return params
  },
  setError(errors) {
    this.state.error.errors = errors
  },
  setRecurring(order) {
    if (!order) return

    Object.assign(this.state.params.recurring_data, order.recurring_data)
    this.state.regular.insert = order.subscription
  },
  toggleMenu() {
    this.state.options.show_menu_first = !this.state.options.show_menu_first
  },
}
