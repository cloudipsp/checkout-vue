export const getCookie = name => {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

// TODO https://github.com/TehShrike/deepmerge

export const deepMerge = (...args) => {
  let extended = args[0]

  let merge = function (obj) {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = deepMerge(extended[prop], obj[prop])
        } else {
          extended[prop] = obj[prop]
        }
      }
    }
  }

  for (let i = 1; i < args.length; i++) {
    merge(args[i])
  }

  return extended
}

export const findGetParameter = parameterName => {
  let result = null
  let tmp = []
  location.search
    .substr(1)
    .split('&')
    .forEach(function (item) {
      tmp = item.split('=')
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
    })
  return result
}

export const loadStyle = css => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}

export const errorHandler = error => {
  if (error instanceof Error) console.log(error)
}

export const clearEmptyValue = object => {
  return Object.fromEntries(
    // eslint-disable-next-line no-unused-vars
    Object.entries(object).filter(([k, v]) => v !== '' && v !== null)
  )
}

export const generateValidateMessage = translation =>
  Object.fromEntries(
    Object.entries(translation)
      .filter(([k]) => /^rule_/.test(k))
      .map(([k, v]) => [
        k.replace('rule_', ''),
        (field, params) => {
          return v
            .replace(/({_field_})/, field)
            .replace(/({_\w+_})/, (params && params[0]) || '')
        },
      ])
  )

export const removeDuplicate = (item, key, self) => self.indexOf(item) === key

export const getId = url => url.replace(/\W/g, '_')

export const removeWallets = item => item !== 'wallets'

export const includes = list => item => list.includes(item)

export const excludes = list => item => !list.includes(item)
