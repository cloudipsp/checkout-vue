import $checkout from 'ipsp-js-sdk/dist/checkout'
import store from '@/store'
import config from '@/config/config'
import Schema from 'async-validator'
import { i18n } from '@/i18n'

let api = $checkout('Api')
let cache = {}

api.on('modal.close', function() {
  store.formLoading(false)
})

export function iframeCreate(apiDomain) {
  if (apiDomain) {
    api.setOrigin('https://' + apiDomain)
  }
  api.create()
}

export function sendRequest(name, method, params, cached = true) {
  let id = name + method
  if (cached && cache[id]) return cache[id]
  cache[id] = new Promise(function(resolve, reject) {
    api.scope(function() {
      this.request(name, method, params)
        .then(
          function(model) {
            console.log('done', { name, method, params, model })
            resolve(model)
            delete cache[id]
          },
          function(model) {
            console.log('fail', { name, method, params, model })
            store.showError(
              String(model.attr('error.code')),
              model.attr('error.message')
            )
            reject(model)
            delete cache[id]
          }
        )
        .progress(function(model) {
          resolve(model)
        })
    })
  })
  return cache[id]
}

export function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie(name, value, options) {
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

export function deleteCookie(name) {
  setCookie(name, '', {
    expires: -1,
  })
}

// TODO https://github.com/TehShrike/deepmerge

export function deepMerge() {
  let extended = arguments[0]

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

  for (let i = 1; i < arguments.length; i++) {
    merge(arguments[i])
  }

  return extended
}

export function validate(options) {
  new Schema(config).validate(options, (errors, fields) => {
    if (!errors) return
    store.setError(errors)
  })
}

export function findGetParameter(parameterName) {
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

export function sort(arr, field, reverse) {
  reverse = reverse ? -1 : 1
  return arr.sort((a, b) => {
    if (String.prototype.localeCompare) {
      return a[field].localeCompare(b[field], i18n.locale) * reverse
    } else {
      return (a[field] < b[field] ? -1 : 1) * reverse
    }
  })
}
