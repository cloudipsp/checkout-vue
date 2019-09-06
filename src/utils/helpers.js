import $checkout from 'ipsp-js-sdk/dist/checkout'
import store from '@/store'
import config from '@/config/config'
import Schema from 'async-validator'
import { i18n } from '@/i18n'

let api = $checkout('Api')
let cache = {}

api.on('modal.close', function() {
  store.state.loading = false
})

export function iframeCreate(apiDomain) {
  if (apiDomain) {
    api.setOrigin('https://' + apiDomain)
  }
  api.create()
}

export function sendRequest(name, method, params, cacheName) {
  let id = name + cacheName
  if (cache[id]) return cache[id]
  cache[id] = new Promise(function(resolve, reject) {
    if (cacheName && cache[id]) {
      resolve(cache[id])
    } else {
      api.scope(function() {
        this.request(name, method, params)
          .then(
            function(model) {
              console.log(name, method, params)
              console.log('done', model)
              resolve(model)
              delete cache[id]
            },
            function(model) {
              console.log(name, method, params)
              console.log('fail', model)
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
    }
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
    if (errors) {
      console.log(errors, fields)
      store.state.error.errors = errors
    }
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
