import Vue from 'vue'

import optionsDefault from '@/config/options-default'
import notSet from '@/config/not-set'
import cssVariable from '@/config/css-variable'
import {
  getCookie,
  deepMerge,
  errorHandler,
  removeWallets,
} from '@/utils/helpers'
import { sendRequest } from '@/utils/api'
import { isExist } from '@/utils/typeof'
import i18n, { loadLanguageAsync, getBrowserLanguage } from '@/i18n/index'
import store from './setup'
import loadButton, { getLabel } from '@/store/button'
import initCssVariable from '@/store/css-variable'
import loadCardImg from '@/store/card-img'
import { methods, tabs } from '@/utils/compatibility'
import { localStorage } from '@/utils/store'
import configSubscription from '@/config/subscription'
import configAutoSubmit from '@/config/auto-submit'
import { subscription } from '@/store/subscription'
import validate from '@/schema/validate'
import Model from '@/class/model'
import initFavicon from '@/store/favicon'
import { loadStyleAdaptive } from '@/import'
import router from '@/router/index'

Vue.use(store)

let instance = {}

class Store extends Model {
  constructor() {
    super()
    this.setStateDefault()
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
  autoSubmit() {
    let methods = this.state.options.methods

    if (
      !this.user.options?.methods?.includes('wallets') ||
      this.user.options?.methods_disabled?.includes('wallets')
    ) {
      methods = methods.filter(removeWallets)
    }

    if (methods.length !== 1) return Promise.reject()

    let method = methods[0]

    if (!configAutoSubmit.includes(method)) return Promise.reject()

    let payment_systems = Object.keys(this.state.tabs[method].payment_systems)

    if (payment_systems.length !== 1) return Promise.reject()

    let payment_system = payment_systems[0]

    return Promise.resolve({ payment_system })
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
    return validate(userConfig)
      .init()
      .then(() => {
        this.init(userConfig)
      })
  }
  init(userConfig) {
    // delete undefined property
    this.user = JSON.parse(JSON.stringify(userConfig))

    deepMerge(this.state.params, this.user.params, notSet.params)
    deepMerge(this.state.options, this.user.options, notSet.options)
    Object.assign(this.state.messages, this.user.messages)
    Object.assign(this.state.validate, userConfig.validate) // userConfig because functions are removed in this.user
    Object.assign(
      this.state.css_variable,
      cssVariable(this.state.options.theme),
      this.user.css_variable
    )

    Object.assign(
      this.state.subscription,
      configSubscription[this.state.options.subscription.type]
    )

    this.initFavicon()
    this.initMethods()
    this.initLocaleMessageEn()
    this.initLang()
    this.initLocation(this.state.options.active_tab)
    this.initCssDevice()
    this.initIsOnlyCard()
    this.initIsOnlyWallets()
    this.initShowMenuFirst()
    initCssVariable(this.state.css_variable)
  }
  initFavicon() {
    initFavicon(this.state.cdnIcons, this.state.options.full_screen)
  }
  initMethods() {
    this.state.options.methods = methods(
      this.state.options.methods,
      this.state.options.methods,
      this.state.options.methods_disabled
    )
  }
  initLocaleMessageEn() {
    i18n.setLocaleMessage('en', this.state.messages['en'])
  }
  initLang() {
    this.changeLang(
      getCookie('lang_s') || this.state.params.lang || getBrowserLanguage()
    )
  }
  initCssDevice() {
    if (!this.state.options.full_screen) return

    loadStyleAdaptive()
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
  load() {
    return Promise.all([this.loadButton(), this.loadCardImg()])
  }
  loadButton() {
    return loadButton(
      this.state.options.api_domain,
      this.state.params.button
    ).then(config => {
      if (!config) return
      if (this.state.options.full_screen) {
        document.title = config.options.title
      }
      this.setState(config)
      this.initLang()
    })
  }
  loadCardImg() {
    return loadCardImg(this.state.options.theme.preset).then(config => {
      if (!config) return
      this.setState(config)
      initCssVariable(config.css_variable)
    })
  }
  setState(state) {
    deepMerge(this.state, JSON.parse(JSON.stringify(state)))
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
    let active_tab = active_method || router.history.current.name
    let method = methods.indexOf(active_tab) > -1 ? active_tab : methods[0]
    router.push({ name: method }).catch(() => {})
  }
  setCardNumber({
    card_number = '',
    expiry_date = '',
    email = this.state.params.email,
    hash,
    read_only,
  } = {}) {
    this.setState({
      params: {
        card_number,
        expiry_date,
        email,
        hash,
        cvv2: '',
      },
      read_only,
    })

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
  location(name, system) {
    this.state.options.show_menu_first = false
    this.state.router.system = system
    router.push({ name }).catch(() => {})
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
    validate({ params: params })
      .validate()
      .then(() => {
        deepMerge(this.state.params, params)
      })
      .catch(errorHandler)
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
    params.payment_system =
      this.state.router.system || router.history.current.name

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
  toggleMenu() {
    this.state.options.show_menu_first = !this.state.options.show_menu_first
  }
}

export default name => {
  // if (instance[name]) return instance[name]
  return (instance[name] = new Store())
}
