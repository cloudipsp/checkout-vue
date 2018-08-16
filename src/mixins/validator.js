import { Validator } from 'vee-validate'

const install = (Vue) => {
  Validator.extend('customer_field', {
    getMessage: (field) => `The ${field} field format is invalid.`,
    validate: value => /^(?!\s)[0-9A-Za-z-\/\s\.,]+(?!\s)$/.test(value)
  })
  Validator.extend('phone', {
    getMessage: (field) => `The ${field} field format is invalid.`,
    validate: value => /^\+?\d{7,14}$/.test(value)
  })
  Validator.extend('numrange', {
    getMessage: (field) => `Transfer amount limit exceeded.`,
    validate: (value, range) => {
      value = parseInt(value,10);
      range = range.map(function(i){ return parseInt(i,10)})
      return range[0]<=value && value<=range[1]
    }
  })
}

export default { install }
