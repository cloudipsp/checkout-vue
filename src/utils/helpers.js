import $checkout from 'ipsp-js-sdk/dist/checkout'
import store from '@/store'
import config from '@/config/config'
import Schema from 'async-validator'

let api = $checkout('Api')
let cache = {}
let cacheError = {}

api.on('modal.close', function () {
  store.state.loading = false
})

export function setOrigin () {
  api.setOrigin('https://' + store.state.options.api_domain)
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
            // store.showError(String(model.attr('error.code')), model.attr('error.message'))
            if (cacheName) {
              cache[id] = model
            }
            resolve(model)
          },
          function (model) {
            console.log(name, method, params)
            console.log('fail', model)
            store.showError(String(model.attr('error.code')), model.attr('error.message'))
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

export function deepMerge () {
  let extended = arguments[0];

  let merge = function ( obj ) {
    for ( let prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        if ( Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = deepMerge( extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  for (let i = 1; i < arguments.length; i++ ) {
    merge(arguments[i]);
  }

  return extended;
}

export function validate (options) {
  new Schema(config).validate(options, (errors, fields) => {
    if (errors) {
      console.log(errors, fields)
      store.state.error.errors = errors
    }
  })
}

export function findGetParameter (parameterName) {
  let result = null,
    tmp = []
  location.search
    .substr(1)
    .split('&')
    .forEach(function (item) {
      tmp = item.split('=')
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
    })
  return result
}
