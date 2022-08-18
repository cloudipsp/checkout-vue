export default class Model {
  attr(...args) {
    let [name = '', value] = args
    name = name.split('.')
    let data = this
    let prop = name.pop()
    let len = args.length

    name.forEach(item => {
      if (data && item in data) {
        data = data[item]
      } else if (len === 2) {
        data = data[item] = {}
      }
    })
    if (len === 1) {
      return data ? data[prop] : null
    }
    if (len === 2) {
      data[prop] = value
    }
  }
}
