import $checkout from 'ipsp-js-sdk/dist/checkout'

export let api
let cache = {}

export const initApi = (option, cb) => {
  api = $checkout('Api', option)

  api.on('modal.close', cb)
}

export const sendRequest = (
  name,
  method,
  params = {},
  { cached, params2 = params } = {},
  progress = () => {}
) => {
  let id = JSON.stringify([name, method, params2 || params])
  if (cached && cache[id]) return cache[id]
  cache[id] = new Promise(function (resolve, reject) {
    api.scope(function () {
      this.request(name, method, params)
        .then(
          function (model) {
            console.log('done', { name, method, params, model })
            resolve(model)
            if (!cached) delete cache[id]
          },
          function (model) {
            console.log('fail', { name, method, params, model })
            reject(model)
            if (!cached) delete cache[id]
          }
        )
        .progress(progress)
    })
  })
  return cache[id]
}
