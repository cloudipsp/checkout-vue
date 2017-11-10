import $checkout from 'ipsp-js-sdk/dist/checkout'
import store from '@/store'

let api = $checkout('Api')
// api.setOrigin('https://api.fondy.eu')
api.setOrigin('https://api.dev.fondy.eu')

const setError = function (model) {
  if (model.data.error || model.data.message) {
    store.state.error.flag = true
    store.state.error.code = model.data.error && String(model.data.error.code)
    store.state.error.message = (model.data.error && model.data.error.message) || model.data.message
  }
}

const sendRequest = function (name, method, params) {
  return new Promise(function (resolve, reject) {
    api.scope(function () {
      this.request(name, method, params).then(
        function (model) {
          console.log(name, method, params)
          console.log('done', model)
          setError(model)
          resolve(model)
        },
        function (model) {
          console.log(name, method, params)
          console.log('fail', model)
          setError(model)
          reject(model)
        })
    })
  })
}

export {
  sendRequest
}
