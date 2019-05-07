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
} from 'vee-validate/dist/rules.esm.js'
import en from 'vee-validate/dist/locale/en'

const install = Vue => {
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

  Validator.extend('customer_field', {
    getMessage: field => `The ${field} field format is invalid.`,
    validate: value => /^(?!\s)[0-9A-Za-z-\/\s\.,]+(?!\s)$/.test(value),
  })
  Validator.extend('phone', {
    getMessage: field => `The ${field} field format is invalid.`,
    validate: value => /^\+?\d{7,14}$/.test(value),
  })
  Validator.extend('numrange', {
    getMessage: field => `Transfer amount limit exceeded.`,
    validate: (value, range) => {
      value = parseInt(value, 10)
      range = range.map(function(i) {
        return parseInt(i, 10)
      })
      return range[0] <= value && value <= range[1]
    },
  })
  Validator.extend('ccard', {
    getMessage: field => `The ${field} field format is invalid.`,
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

  Validator.localize('en', en)

  Vue.use(VeeValidate, {
    inject: false,
    events: 'change|input|blur',
  })
}

export default { install }
