import {
  Validator,
  install as VeeValidate,
} from 'vee-validate/dist/vee-validate.minimal.esm.js'
import {
  required,
  email,
  numeric,
  decimal,
  date_format,
  alpha,
  min,
  max,
  after,
  digits,
  regex,
} from 'vee-validate/dist/rules.esm.js'
import { validate as messages } from '@/i18n/lang/en'
import {
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate/dist/vee-validate.minimal.esm.js'

const install = Vue => {
  const REGEX_CUSTOMER_FIELD = /^(?!\s)[0-9A-Za-z-\/\.,\s]+$/
  const REGEX_CUSTOMER_FIELD_UTF8 = /^(?!\s+)[\u00BF-\u1FFF\u2C00-\uD7FF\w`\s]+$/
  const REGEX_CUSTOMER_NAME = /^([a-zA-Z]+(\s|$)){2,}$/
  const REGEX_RTRIM = /\S+$/

  Validator.extend('required', required)
  Validator.extend('email', email)
  Validator.extend('numeric', numeric)
  Validator.extend('decimal', decimal)
  Validator.extend('date_format', date_format)
  Validator.extend('alpha', alpha)
  Validator.extend('min', min)
  Validator.extend('max', max)
  Validator.extend('after', after)
  Validator.extend('digits', digits)
  Validator.extend('regex', regex)

  Validator.extend('customer_field', {
    validate: value =>
      REGEX_CUSTOMER_FIELD.test(value) && REGEX_RTRIM.test(value),
  })
  Validator.extend('customer_name', {
    validate: value =>
      REGEX_CUSTOMER_NAME.test(value) && REGEX_RTRIM.test(value),
  })
  Validator.extend('customer_field_utf8', {
    validate: value =>
      REGEX_CUSTOMER_FIELD_UTF8.test(value) && REGEX_RTRIM.test(value),
  })
  Validator.extend('phone', {
    validate: value => /^\+?\d{7,14}$/.test(value),
  })
  Validator.extend('numrange', {
    validate: (value, range) => {
      value = parseInt(value, 10)
      range = range.map(function (i) {
        return parseInt(i, 10)
      })
      return range[0] <= value && value <= range[1]
    },
  })
  Validator.extend('ccard', {
    validate: value => {
      let REGEXP_LUHN_DASHED = /^[\d\-\s]+$/
      if (!REGEXP_LUHN_DASHED.test(value)) return false
      let nCheck = 0
      let nDigit = 0
      let bEven = false
      let strippedField = value.replace(/\D/g, '')
      for (let n = strippedField.length - 1; n >= 0; n--) {
        let cDigit = strippedField.charAt(n)
        nDigit = parseInt(cDigit, 10)
        if (bEven) {
          if ((nDigit *= 2) > 9) nDigit -= 9
        }
        nCheck += nDigit
        bEven = !bEven
      }
      return nCheck % 10 === 0
    },
  })
  Validator.extend('one', {
    validate: value => {
      return parseInt(value, 10) > 0
    },
  })

  Validator.localize('en', messages)

  Vue.use(VeeValidate, {
    errorBagName: 'deprecatedErrors',
    inject: false,
    events: 'change|input|blur',
  })

  Vue.component('ValidationProvider', ValidationProvider)
  Vue.component('ValidationObserver', ValidationObserver)
}

export default { install }
