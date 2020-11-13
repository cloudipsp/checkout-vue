export default class Model {
  attr(name, value) {
    name = (name || '').split('.')
    let data = this
    let prop = name.pop()
    let len = arguments.length
    for (let i = 0; i < name.length; i++) {
      if (data && Object.prototype.hasOwnProperty.call(data, name[i])) {
        data = data[name[i]]
      } else {
        if (len === 2) {
          data = data[name[i]] = {}
        } else {
          break
        }
      }
    }
    if (len === 1) {
      return data ? data[prop] : null
    }
    if (len === 2) {
      data[prop] = value
    }
  }
}
