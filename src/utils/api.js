import $checkout from 'ipsp-js-sdk/dist/checkout'

export let api
let cache = {}

export const initApi = (option, cb) => {
  api = $checkout('Api', option)

  api.on('modal.close', cb)
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
