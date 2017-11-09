import $checkout from 'ipsp-js-sdk/dist/checkout'

const sendRequest = function (name, method, params) {
  console.log('params', params)
  return new Promise(function (resolve, reject) {
    $checkout('Api').scope(function () {
      this.request(name, method, params).then(
        function (model) {
          console.log('done', model)
          resolve(model)
        },
        function (model) {
          console.log('fail', model)
          reject(model)
        })
    })
  })
}

export {
  sendRequest
}
