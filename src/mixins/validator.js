import { Validator } from 'vee-validate'

const install = Vue => {
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
}

export default { install }
