function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(function (key) {
        return { key: key, val: key }
      })
    : Object.keys(map).map(function (key) {
        return { key: key, val: map[key] }
      })
}

function normalizeNamespace(fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    }
    return fn(namespace, map)
  }
}

function getState(namespace) {
  let state = this.store.attr('state')
  if (namespace) {
    state = this.store.attr('state.' + namespace)
  }
  return state
}

export const mapState = normalizeNamespace(function (namespace, states) {
  let res = {}

  normalizeMap(states).forEach(function ({ key, val }) {
    res[key] = function mappedState() {
      let state = getState.call(this, namespace)

      return typeof val === 'function' ? val.call(this, state) : state[val]
    }
  })
  return res
})

export const mapStateGetSet = normalizeNamespace(function (namespace, states) {
  let res = {}

  normalizeMap(states).forEach(function ({ key, val }) {
    res[key] = {
      get() {
        let state = getState.call(this, namespace)
        return state[val]
      },
      set(value) {
        getState.call(this, namespace)[val] = value
      },
    }
  })
  return res
})

class backupStorage {
  constructor() {
    this.data = {}
  }
  getItem(id) {
    return this.data[id]
  }
  setItem(id, val) {
    this.data[id] = String(val)
  }
  removeItem(id) {
    delete this.data[id]
  }
  clear() {
    this.data = {}
  }
}

function getStorage(storage) {
  try {
    window[storage].setItem('test', new Array(10000).join('0'))
    window[storage].removeItem('test')
    return window[storage]
  } catch (e) {
    return new backupStorage()
  }
}

function key(name) {
  return ['fondy', name].join(':')
}

class Storage {
  constructor(storage) {
    this.storage = getStorage(storage)
  }
  set(name, data) {
    this.storage.setItem(key(name), JSON.stringify(data))
  }
  get(name) {
    return JSON.parse(this.storage.getItem(key(name)))
  }
  expire(name) {
    this.storage.removeItem(key(name))
  }
}

export const localStorage = new Storage('localStorage')
export const sessionStorage = new Storage('sessionStorage')
