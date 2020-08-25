import $checkout from 'ipsp-js-sdk/dist/checkout'
import store from '@/store'
import config from '@/config/config'
import Schema from 'async-validator'
import i18n from '@/i18n/index'

export let api
let cache = {}

export const initApi = option => {
  api = $checkout('Api', option)

  api.on('modal.close', function() {
    store.formLoading(false)
  })
}

export const sendRequest = (name, method, params = {}, cached = {}) => {
  let id = [name, method, JSON.stringify(cached.params || params)].join('_')
  if (cached.cached && cache[id]) return cache[id]
  cache[id] = new Promise(function(resolve, reject) {
    api.scope(function() {
      this.request(name, method, params)
        .then(
          function(model) {
            console.log('done', { name, method, params, model })
            resolve(model)
            if (cached.clear || !cached.cached) delete cache[id]
          },
          function(model) {
            console.log('fail', { name, method, params, model })
            store.showError(
              String(model.attr('error.code')),
              model.attr('error.message')
            )
            reject(model)
            if (cached.clear || !cached.cached) delete cache[id]
          }
        )
        .progress(function(model) {
          resolve(model)
          if (cached.clear || !cached.cached) delete cache[id]
        })
    })
  })
  return cache[id]
}

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

export const setCookie = (name, value, options) => {
  options = options || {}

  let expires = options.expires

  if (typeof expires === 'number' && expires) {
    let d = new Date()
    d.setTime(d.getTime() + expires * 1000)
    expires = options.expires = d
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString()
  }

  value = encodeURIComponent(value)

  let updatedCookie = name + '=' + value

  for (let propName in options) {
    updatedCookie += '; ' + propName
    let propValue = options[propName]
    if (propValue !== true) {
      updatedCookie += '=' + propValue
    }
  }

  document.cookie = updatedCookie
}

export const deleteCookie = name => {
  setCookie(name, '', {
    expires: -1,
  })
}

// TODO https://github.com/TehShrike/deepmerge

export const deepMerge = (...args) => {
  let extended = args[0]

  let merge = function(obj) {
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

export const validate = options => {
  new Schema(config).validate(options, errors => {
    if (!errors) return
    store.setError(errors)
  })
}

export const findGetParameter = parameterName => {
  let result = null
  let tmp = []
  location.search
    .substr(1)
    .split('&')
    .forEach(function(item) {
      tmp = item.split('=')
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
    })
  return result
}

export const sort = (arr, field, reverse) => {
  reverse = reverse ? -1 : 1
  return arr.sort((a, b) => {
    if (String.prototype.localeCompare) {
      return a[field].localeCompare(b[field], i18n.locale) * reverse
    } else {
      return (a[field] < b[field] ? -1 : 1) * reverse
    }
  })
}

export const isMobile = window.matchMedia('only screen and (max-width: 768px)')
  .matches

export const loadStyle = css => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}
