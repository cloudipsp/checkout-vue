import Vue from 'vue'

import optionsDefault from '@/config/options-default'
import notSet from '@/config/not-set'
import cssVariable from '@/config/css-variable'
import cssClass from '@/config/css-class'
import {
  getCookie,
  deepMerge,
  errorHandler,
  removeWallets,
} from '@/utils/helpers'
import { sendRequest } from '@/utils/api'
import { isExist } from '@/utils/inspect'
import i18n, { loadLanguageAsync, getBrowserLanguage } from '@/i18n/index'
import store from '@/store/setup'
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
import { arrayIncludes } from '@/utils/array'
import { formatKiev } from '@/utils/date'
import locales from '@/config/locales.json'
import { keys } from '@/utils/object'

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
    this.sendRequest('api.checkout.info', 'get', this.tokenFormParams(data))
      .then(model => this.info(model))
      .catch(errorHandler)
  }
  infoSuccess(model) {
    this.info(model)

    let lang = model.attr('lang')
    if (arrayIncludes(keys(locales), lang) && !this.user.params?.lang) {
      this.state.params.lang = lang
      this.initLang()
    }
    this.initHasFields()
    this.initIsOnlyCard()
    return this.getRouteName(model)
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

    if (!this.state.tabs[method]) return Promise.reject()

    let systems = Object.keys(this.state.tabs[method])

    if (systems.length !== 1) return Promise.reject()

    let system = systems[0]

    return Promise.resolve({ method, system })
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
    }
    this.state.tabs = tabs(model.attr('tabs'))
    this.state.options.default_country =
      this.state.options.default_country || model.attr('default_country')

    this.state.params.fee = model.attr('client_fee') || 0
    this.state.options.customer_fields =
      model.attr('customer_required_data') || []

    this.state.params.order_desc =
      this.state.params.order_desc || model.attr('order.order_desc') || ' '

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
    Object.assign(this.state.css_class, cssClass(this.state.options.theme.type))
    Object.assign(
      this.state.subscription,
      configSubscription[this.state.options.subscription.type]
    )

    this.initFavicon()
    this.initMethods()
    this.initLocaleMessageEn()
    this.initLang()
    this.initCssDevice()
    this.initHasFields()
    this.initIsOnlyCard()
    this.initShowMenuFirst()
    initCssVariable(this.state.css_variable)
  }
  initFavicon() {
    if (!this.state.options.full_screen) return
    initFavicon()
  }
  initMethods() {
    this.state.options.methods = methods(
      this.state.options.methods,
      this.state.options.methods,
      this.state.options.methods_disabled
    )
  }
  initLocaleMessageEn() {
    i18n.setLocaleMessage('en', {
      ...i18n._vm.messages.en,
      ...this.state.messages['en'],
    })
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
  initHasFields() {
    this.state.has_fields =
      !this.state.amount_readonly ||
      this.state.options.customer_fields.length ||
      this.state.fields.length ||
      this.state.options.fields ||
      this.state.options.offerta_url
  }
  initIsOnlyCard() {
    let methods = this.state.options.methods.filter(removeWallets)
    this.state.isOnlyCard = methods.length === 1 && methods[0] === 'card'
  }
  initShowMenuFirst() {
    let methodsLength = this.state.options.methods.filter(removeWallets).length

    if (isExist(this.user.options?.show_menu_first)) return

    if (methodsLength > 1) {
      this.state.options.show_menu_first = true
    }

    if (methodsLength === 1) {
      this.state.options.show_menu_first = false
    }
  }
  getRouteName(model) {
    let active_tab = model.active_tab === 'card' ? '' : model.active_tab
    let methodsLength = this.state.options.methods.filter(removeWallets).length

    if (!this.state.params.token) return

    if (active_tab) return active_tab

    if (isExist(this.user.options?.show_menu_first)) return

    if (methodsLength > 1) {
      return 'menu'
    }

    if (methodsLength === 1) {
      return this.state.options.methods[0]
    }
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
      this.initHasFields()
      this.initIsOnlyCard()
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
        this.state.amount_with_fee = parseInt(model.attr('amount_with_fee'), 10)
      })
      .catch(errorHandler)
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
  tokenFormParams(data) {
    return this.state.params.token
      ? Object.assign(
          { token: this.state.params.token },
          data,
          this.defaultParams()
        )
      : this.formParams()
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

    if (this.state.order.need_verify_code) {
      delete params.custom
    }

    params.amount = params.amount / 100
    if (params.recurring_data.amount) {
      params.recurring_data.amount = params.recurring_data.amount / 100
    }

    params.recurring_data = Object.fromEntries(
      Object.entries(params.recurring_data)
        .filter(([, value]) => value !== 0 && value !== '')
        .map(([name, value]) => [
          name,
          arrayIncludes(['start_time', 'end_time'], name)
            ? formatKiev(value)
            : value,
        ])
    )

    if (params.recurring === 'n') {
      delete params.recurring_data
    }

    delete params.lang

    return Object.assign(params, data, this.defaultParams())
  }
}

export default (name, fromCache) => {
  if (instance[name] && fromCache) return instance[name]

  return (instance[name] = new Store())
}
