import Vue from 'vue'

import optionsDefault from '@/config/options-default'
import notSet from '@/config/not-set'
import cssVarisble from '@/config/css-varisble'
import {
  getCookie,
  deepMerge,
  findGetParameter,
  errorHandler,
  removeWallets,
} from '@/utils/helpers'
import { initApi, sendRequest } from '@/utils/api'
import { isPlainObject, isExist } from '@/utils/typeof'
import i18n, { loadLanguageAsync, getBrowserLanguage } from '@/i18n/index'
import store from './setup'
import { getLabel } from '@/store/button'
import initCssVariable from '@/store/css-variable'
import loadButton from '@/store/button'
import loadCardImg from '@/store/card-img'
import { methods, tabs } from '@/utils/compatibility'
import { localStorage } from '@/utils/store'
import config from '@/config/config'
import Schema from 'async-validator'
import configSubscription from '@/config/subscription'
import { subscription } from '@/store/subscription'
import { correctingUserConfig } from '@/utils/compatibility'
import Model from '@/class/model'

Vue.use(store)

let instance = {}

class Store extends Model {
  constructor() {
    super()
    this.setStateDefault()
    this.server = {}
  }
  sendRequest(...args) {
    if (this.state.options.disable_request) return Promise.reject()

    Object.assign(args[2], this.defaultParams())

    return sendRequest(...args).catch(model => {
      this.showError(model.attr('error.code'), model.attr('error.message'))
      return Promise.reject(model)
    })
  }
  sendRequestInfo(data) {
    this.sendRequest('api.checkout.info', 'get', this.formParams(data))
      .then(model => this.info(model))
      .catch(errorHandler)
  }
  infoSuccess(model) {
    this.info(model)

    this.state.params.lang = this.user.params?.lang || model.attr('lang')

    this.initLang()
  }
  info(model) {
    if (isExist(model.attr('validate_expdate'))) {
      this.state.validate_expdate = model.attr('validate_expdate')
    }
    this.state.options.link =
      model.attr('merchant_url') || this.state.options.link
    this.state.options.email =
      model.attr('checkout_email_required') || this.state.options.email
    this.state.options.title =
      this.state.options.title || model.attr('merchant.localized_name')
    this.state.options.logo_url =
      this.state.options.logo_url || model.attr('merchant.logo_url')
    this.state.options.offerta_url =
      this.state.options.offerta_url || model.attr('merchant.offerta_url')
    this.state.region = (model.attr('merchant.country') || '').toLowerCase()

    if (model.attr('tabs_order') && model.attr('tabs_order').length) {
      this.state.options.methods = methods(
        this.state.options.methods,
        model.attr('tabs_order'),
        this.state.options.methods_disabled
      )
      this.initLocation()
      this.initIsOnlyCard()
      this.initIsOnlyWallets()
    }
    this.state.tabs = tabs(model.attr('tabs'))
    this.state.options.default_country =
      this.state.options.default_country || model.attr('default_country')

    this.state.params.fee = model.attr('client_fee') || 0
    this.state.options.customer_fields =
      model.attr('customer_required_data') || []

    this.state.params.order_desc =
      this.state.params.order_desc || model.attr('order.order_desc') || ' '

    if (model.attr('order.verification')) {
      this.state.verification_type = model.attr('verification_type')
      this.state.options.title = 'verification_t'
      this.state.params.order_desc =
        'verification_' + this.state.verification_type + '_d'
    }

    subscription(model.attr('order'))
      .then(config => this.setState(config))
      .catch(errorHandler)

    this.state.show_gdpr_frame = model.attr('show_gdpr_frame')
  }
  setStateDefault() {
    this.state = JSON.parse(JSON.stringify(optionsDefault))
  }
  setOptions(userConfig) {
    userConfig = correctingUserConfig(userConfig)

    // delete undefined property
    this.user = JSON.parse(JSON.stringify(userConfig))

    this.optionsFormat(this.user)
    this.validate(this.user)
    deepMerge(this.state.params, this.user.params, notSet.params)
    deepMerge(this.state.options, this.user.options, notSet.options)
    Object.assign(this.state.messages, this.user.messages)
    Object.assign(this.state.validate, userConfig.validate) // userConfig because functions are removed in this.user
    Object.assign(
      this.state.css_variable,
      cssVarisble(this.state.options.theme),
      this.user.css_variable
    )

    this.setState(this.server)
    Object.assign(
      this.state.subscription,
      configSubscription[this.state.options.subscription.type]
    )

    this.initCdn()
    this.initMethods()
    this.initLang()
    this.initLocation(this.state.options.active_tab)
    this.initError()
    this.initToken()
    this.initApi()
    this.initCssDevice()
    this.initIsOnlyCard()
    this.initIsOnlyWallets()
    this.initShowMenuFirst()
    initCssVariable(this.state.css_variable)
  }
  optionsFormat(options) {
    let regex = /[A-Z]+/g

    if (!isPlainObject(options)) return

    for (let prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        let modified = prop.replace(regex, function (match) {
          return '_' + match.toLowerCase()
        })
        if (prop !== modified) {
          if (Object.prototype.hasOwnProperty.call(options, modified)) continue
          options[modified] = options[prop]
          delete options[prop]
          this.optionsFormat(options[modified])
        } else {
          this.optionsFormat(options[prop])
        }
      }
    }
  }
  validate(options) {
    new Schema(config).validate({ config: options }, errors => {
      if (!errors) return
      this.setError(errors)
    })
  }
  initCdn() {
    let scriptFondyEl = [
      ...document.querySelectorAll('script[src$="checkout.js"]'),
    ].filter(item => /fondy/.test(item.src))[0]

    if (!scriptFondyEl) return

    this.state.cdn = scriptFondyEl.src.replace('/checkout.js', '')
  }
  initMethods() {
    this.state.options.methods = methods(
      this.state.options.methods,
      this.state.options.methods,
      this.state.options.methods_disabled
    )
  }
  initLang() {
    this.changeLang(
      getCookie('lang_s') || this.state.params.lang || getBrowserLanguage()
    )
  }
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
  }
  initToken() {
    this.setParam(this.state.params, 'token', findGetParameter('token'))
  }
  initCssDevice() {
    if (!this.state.options.full_screen) return

    require('@/scss/style-adaptive.scss?no-extract')
  }
  initIsOnlyCard() {
    let methods = this.state.options.methods.filter(removeWallets)
    this.state.isOnlyCard = methods.length === 1 && methods[0] === 'card'
  }
  initIsOnlyWallets() {
    this.state.is_only_wallets =
      this.state.options.methods.length === 1 &&
      this.state.options.methods[0] === 'wallets'
  }
  initShowMenuFirst() {
    this.state.options.show_menu_first =
      this.state.options.show_menu_first && !this.state.isOnlyCard
  }
  setParam(object, key, value) {
    if (!value) return
    object[key] = value
  }
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
  }
  loadButton() {
    return loadButton().then(config => {
      if (!config) return
      if (this.state.options.full_screen) {
        document.title = config.options.title
      }
      this.setServer(config)
    })
  }
  loadCardImg(preset) {
    return loadCardImg(preset).then(config => {
      if (!config) return
      this.setServer(config)
    })
  }
  setState(state) {
    deepMerge(this.state, JSON.parse(JSON.stringify(state)))
  }
  setServer(state) {
    deepMerge(this.server, JSON.parse(JSON.stringify(state)))
  }
  changeLang(lang) {
    if (this.state.options.full_screen) {
      document.querySelector('html').setAttribute('lang', lang)
    }

    this.state.params.lang = lang

    loadLanguageAsync(lang, this).catch(errorHandler)
  }
  initLocation(active_method) {
    let methods = this.state.options.methods
    let active_tab = active_method || this.state.router.method
    let method = methods.indexOf(active_tab) > -1 ? active_tab : methods[0]
    this.state.router.page = 'payment-method'
    this.state.router.method = method
  }
  setCardNumber({ card_number, expiry_date, email, hash, read_only } = {}) {
    this.state.params.card_number = card_number || ''
    this.state.params.expiry_date = expiry_date || ''
    this.state.params.email = email || this.state.params.email
    this.state.params.hash = hash
    this.state.params.cvv2 = ''
    this.state.read_only = read_only

    let el = document.getElementById('f-cvv2')
    if (card_number && expiry_date && el) {
      setTimeout(() => {
        el && el.focus()
      }, 100)
    }
  }
  getAmountWithFee() {
    if (!this.state.params.amount) return Promise.reject()
    if (!this.state.params.fee) return Promise.reject()
    return this.sendRequest(
      'api.checkout.fee',
      'get',
      {
        amount: this.state.params.amount,
        fee: this.state.params.fee,
        token: this.state.params.token,
      },
      {
        cached: true,
      }
    )
      .then(model => {
        this.state.params.amount_with_fee = parseInt(
          model.attr('amount_with_fee')
        )
      })
      .catch(errorHandler)
  }
  location(page, method, system) {
    this.state.options.show_menu_first = false
    this.state.router.page = page
    this.state.router.method = method
    this.state.router.system = system
  }
  locationSystem(system) {
    this.state.router.system = system
  }
  showError(code, message) {
    this.state.error.code = code
    this.state.error.message = message
    this.state.error.show = true
  }
  formLoading(loading) {
    if (loading) {
      this.state.error.show = false
    }

    this.state.loading = loading
  }
  setParams(params) {
    if (this.state.params.token || this.state.params.order_id) {
      console.warn(
        'You can not change the parameters if there is a token or an order is created'
      )
      return
    }
    this.validate({ params: params })
    if (!this.state.error.errors.length) {
      deepMerge(this.state.params, params)
    }
  }
  defaultParams() {
    return {
      referrer: document.referrer,
      embedded: !this.state.options.full_screen,
      location: location.href,
    }
  }
  formParams(data) {
    // copy params
    let params = JSON.parse(JSON.stringify(this.state.params))

    params.referrer = document.referrer
    params.embedded = !this.state.options.full_screen
    params.location = location.href

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

    params.recurring_data = Object.fromEntries(
      Object.entries(params.recurring_data).filter(
        ([, value]) => value !== 0 && value !== ''
      )
    )

    if (params.recurring === 'n') {
      delete params.recurring_data
    }

    delete params.lang

    return Object.assign(params, data, this.defaultParams())
  }
  setError(errors) {
    this.state.error.errors = errors
  }
  toggleMenu() {
    this.state.options.show_menu_first = !this.state.options.show_menu_first
  }
}

export default name => {
  // if (instance[name]) return instance[name]
  return (instance[name] = new Store())
}
