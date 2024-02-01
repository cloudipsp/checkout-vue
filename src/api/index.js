import { loadCheckout } from '@/import'

export let api
let cache = {}

export const install = (option, cb) => {
  loadCheckout().then($checkout => {
    api = $checkout('Api', option)

    api.on('modal.close', cb)
  })
}

export const sendRequest = (
  name,
  method,
  params = {},
  { cached, params2 = params } = {},
  progress = () => {}
) =>
  loadCheckout().then(() => {
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
              delete cache[id]
            }
          )
          .progress(progress)
      })
    })
    return cache[id]
  })
