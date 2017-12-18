import $checkout from 'ipsp-js-sdk/dist/checkout'
import store from '@/store'

let api = $checkout('Api')
let cache = {}
let cacheError = {}

api.on('modal.close', function () {
  store.state.loading = false
})

const setError = function (model) {
  let code = String(model.attr('error.code'))
  let message = model.attr('error.message')

  if (code || message) {
    store.state.error.code = code
    store.state.error.message = message
    setTimeout(() => {
      store.state.error.flag = true
    })
  }
}

export function setOrigin () {
  api.setOrigin('https://' + store.state.options.apiDomain)
}

export function sendRequest (name, method, params, cacheName) {
  return new Promise(function (resolve, reject) {
    let id = name + cacheName
    if (cacheName && cache[id]) {
      resolve(cache[id])
    } else if (cacheName && cacheError[id]) {
      reject(cacheError[id])
    } else {
      api.scope(function () {
        this.request(name, method, params).then(
          function (model) {
            console.log(name, method, params)
            console.log('done', model)
            // setError(model)
            if (cacheName) {
              cache[id] = model
            }
            resolve(model)
          },
          function (model) {
            console.log(name, method, params)
            console.log('fail', model)
            setError(model)
            // if (cacheName) {
            //   cacheError[id] = model
            // }
            reject(model)
          })
      })
    }
  })
}

export function getCookie (name) {
  let matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie (name, value, options) {
  options = options || {}

  let expires = options.expires

  if (typeof expires === 'number' && expires) {
    let d = new Date()
    d.setTime(d.getTime() + expires * 1000)
    expires = options.expires = d
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
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

export function deleteCookie (name) {
  setCookie(name, '', {
    expires: -1
  })
}
