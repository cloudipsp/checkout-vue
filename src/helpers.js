import $checkout from 'ipsp-js-sdk/dist/checkout'
import store from '@/store'

let api = $checkout('Api')
// api.setOrigin('https://api.fondy.eu')
api.setOrigin('https://api.dev.fondy.eu')

let cache = {}
let cacheError = {}

const setError = function (model) {
  let code
  let message
  if (typeof model.data.error === 'string') {
    code = String(model.data.code)
    message = model.data.error
  } else if (model.data.error) {
    code = String(model.data.error.code)
    message = model.data.error.message
  } else if (model.data.message) {
    message = model.data.message
  }
  if (code || message) {
    store.state.error.flag = true
    store.state.error.code = code
    store.state.error.message = message
  }
}

const sendRequest = function (name, method, params, cacheName) {
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
            setError(model)
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

export {
  sendRequest
}
