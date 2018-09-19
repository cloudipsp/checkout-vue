import optionsDefault from '@/config/options-default'
import configCss from '@/config/css'
import configLocales from '@/config/locales'
import configPaymentSystems from '@/config/payment-systems'
import configPriority from '@/config/priority'
import notSet from '@/config/not-set'
import { getCookie, deepMerge, validate, sendRequest } from '@/utils/helpers'
import { isObject, isExist } from '@/utils/object'

export default {
  state: {
    ...JSON.parse(JSON.stringify(optionsDefault)),
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
    loading: false,
    cards: [],
    submit: false,
    read_only: false,
    need_verify_code: false,
    verification_type: '',
    default_country: '',
  },
  // server: {
  //   ...JSON.parse(JSON.stringify(optionsDefault))
  // },
  default: optionsDefault,
  setOptions(optionsUser, $i18n) {
    this.optionsFormat(optionsUser)
    validate(optionsUser)
    this.user = optionsUser
    deepMerge(this.state.params, optionsUser.params, notSet.params)
    Object.assign(this.state.options, optionsUser.options, notSet.options)
    Object.assign(this.state.regular, optionsUser.regular)
    Object.assign(this.state.messages, optionsUser.messages)
    Object.assign(this.state.validate, optionsUser.validate)
    Object.assign(this.state.popup, optionsUser.popup)
    this.setFast()
    this.setCss()
    this.setLocale()
    $i18n.mergeLocaleMessage('en', this.state.messages['en'])
  },
  optionsFormat: function(options) {
    let regex = /[A-Z]+/g;

    if(!isObject(options)) return

    for (let prop in options) {
      if( options.hasOwnProperty(prop) ) {
        let modified = prop.replace(regex, function(match) {
          return '_' + match.toLowerCase();
        });
        if(prop !== modified){
          if(options.hasOwnProperty(modified)) continue
          options[modified] = options[prop]
          delete options[prop]
          this.optionsFormat(options[modified])
        } else {
          this.optionsFormat(options[prop])
        }
      }
    }
  },
  priority: function(field, priority){
    priority = priority || this.attr(configPriority, field)
    let priorityValue = []

    if(!priority) return

    priority.forEach((item) => {
      priorityValue.push(this.attr(this[item], field))
    })
    this.attr(this.state, field, this.merge(priorityValue))
  },
  attr: function(data, name, value){
    name = (name || '').split('.')
    let prop = name.pop()
    let len = arguments.length
    for (let i = 0; i < name.length; i++) {
      if (data && data.hasOwnProperty(name[i])) {
        data = data[name[i]];
      }
      else {
        if (len === 3) {
          data = (data[name[i]] = {});
        }
        else {
          break;
        }
      }
    }
    if (len === 2) {
      return data ? data[prop] : null;
    }
    if (len === 3) {
      data[prop] = value;
    }
  },
  merge: function(data){
    for (let i = 0; i < data.length; i++) {
      if(isExist(data[i])){
        return data[i]
      }
    }
  },
  mergeServer: function() {
    function merge(obj, field){
      for ( let prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          let f  = (field && field.slice()) || []
          f.push(prop)
          if (isObject(obj[prop])) {
            merge.call(this, obj[prop], f);
          } else {
            this.priority(f.join('.'))
          }
        }
      }
    }
    merge.call(this, this.server)
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
    if (this.state.options.full_screen) {
      lang = getCookie('lang') || this.state.params.lang
    } else {
      lang = this.state.params.lang || getCookie('lang')
    }
    if (locales.length) {
      if (locales.indexOf(lang) < 0) {
        lang = locales[0]
      }
    } else if (configLocales.indexOf(lang) < 0) {
      lang = 'en'
    }
    this.state.params.lang = lang
  },
  setCardNumber: function (card) {
    this.state.params.card_number = card.card_number.replace(/ /g, '')
    this.state.params.expiry_date = card.expiry_date.replace(/ /g, '')
    this.state.params.email = card.email || this.state.params.email
    this.state.params.hash = card.hash
    this.state.params.cvv2 = ''
    this.state.read_only = card.read_only
  },
  getAmountWithFee: function () {
    if (this.state.params.fee && this.state.params.amount) {
      return sendRequest('api.checkout.fee', 'get', this.state.params, String(this.state.params.amount) + String(this.state.params.fee)).then(
        (model) => {
          this.state.params.amount_with_fee = parseInt(model.attr('amount_with_fee'))
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
