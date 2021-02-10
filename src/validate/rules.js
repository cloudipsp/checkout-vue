import { date, isAfter, isEqual, isValid } from '@/utils/date'

const REGEX_RTRIM = /\S+$/

export const decimal = {
  validate: (value, { decimals = '*', separator = '.' } = {}) => {
    if (value === null || value === undefined || value === '') {
      return false
    }
    if (Number(decimals) === 0) {
      return /^-?\d*$/.test(value)
    }
    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`
    const regex = new RegExp(
      `^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`
    )

    return regex.test(value)
  },
  params: ['decimals', 'separator'],
}

export const date_format = {
  validate: (value, { format }) => {
    return isValid(date(value, format))
  },
  params: ['format'],
}

export const after = {
  validate(value, { target, inclusion = false, format }) {
    value = date(value, format)
    target = date(target, format)

    if (!isValid(value) || !isValid(target)) {
      return false
    }

    return isAfter(value, target) || (inclusion && isEqual(value, target))
  },
  params: ['target', 'inclusion', 'format'],
}

export const customer_field = {
  validate: value =>
    /^(?!\s)[0-9A-Za-z-\/.,\s]+$/.test(value) && REGEX_RTRIM.test(value),
}

export const customer_name = {
  validate: value =>
    /^([a-zA-Z]+(\s|$)){2,}$/.test(value) && REGEX_RTRIM.test(value),
}

export const customer_field_utf8 = {
  validate: value =>
    /^(?!\s+)[\u00BF-\u1FFF\u2C00-\uD7FF\w`\s]+$/.test(value) &&
    REGEX_RTRIM.test(value),
}

export const phone = {
  validate: value => /^\+?\d{7,14}$/.test(value),
}

export const numrange = {
  validate: (value, range) => {
    value = parseInt(value, 10)
    range = range.map(function (i) {
      return parseInt(i, 10)
    })
    return range[0] <= value && value <= range[1]
  },
}

export const ccard = {
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
}

export const one = {
  validate: value => {
    return parseInt(value, 10) > 0
  },
}
