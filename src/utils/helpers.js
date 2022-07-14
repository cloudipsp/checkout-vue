import { isError, isPlainObject } from '@/utils/inspect'
import { arrayIncludes } from '@/utils/array'
import { captureMessage } from '@/sentry'
import { isIOS } from '@/utils/mobile'
import { memoize } from '@/utils/memoize'

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
        if (isPlainObject(obj[prop])) {
          extended[prop] = extended[prop] || {}
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
  if (isError(error)) {
    console.log(error)
    captureMessage('error', 'error', error)
  }
}

export const clearEmptyValue = object => {
  return Object.fromEntries(
    Object.entries(object).filter(([, v]) => v !== '' && v !== null)
  )
}

export const generateValidateMessage = translation =>
  Object.fromEntries(
    Object.entries(translation)
      .filter(([k]) => /^rule_/.test(k))
      .map(([k, v]) => [k.replace('rule_', ''), v])
  )

export const removeDuplicate = (item, key, self) => self.indexOf(item) === key

export const removeWallets = item => item !== 'wallets'

export const includes = list => item => list.includes(item)

export const excludes = list => item => !list.includes(item)

export const createConfig = (names, values) =>
  values.reduce((result, value, key) => {
    result[names[key].join('_')] = value
    return result
  }, {})

export const key = (...arr) => arr.join('_')

export const getRouteName = (
  methods,
  active,
  has_fields,
  isBreakpointDownLg = false
) => {
  let name = arrayIncludes(methods, active) ? active : methods[0]

  if (methods.length === 1 && methods[0] === 'wallets' && !has_fields) {
    name = 'blank-' + name
  } else if (active === 'menu' && isBreakpointDownLg) {
    name = active
  }

  return name
}

export const windowWidth = () => (isIOS ? screen.width : window.innerWidth)

export const windowHeight = () => (isIOS ? screen.height : window.innerHeight)

export const fib = memoize(x => (x <= 1 ? x : fib(x - 1) + fib(x - 2)))
