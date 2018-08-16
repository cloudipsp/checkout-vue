export default class Model {
  constructor(data) {
    this.data = data
  }

  attr (name, value) {
    let i = 0,
      data = this.data,
      prop = name.pop(),
      len = arguments.length;
    name = (name || '').split('.')
    for (; i < name.length; i++) {
      if (data && data.hasOwnProperty(name[i])) {
        data = data[name[i]];
      }
      else {
        if (len === 2) {
          data = (data[name[i]] = {});
        }
        else {
          break;
        }
      }
    }
    if (len === 1) {
      return data ? data[prop] : null;
    }
    if (len === 2) {
      data[prop] = value;
    }
    return this;
  }

  instance (data) {
    return new Model(data);
  }
}
