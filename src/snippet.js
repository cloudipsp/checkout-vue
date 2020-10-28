const cdn = 'https://pay.fondy.eu/latest/'
const version = '1.6.0'

class F {
  constructor() {
    this._on = []
    this._emit = []
  }
  init(el, optionsUser) {
    this.isInit = true
    if (optionsUser && optionsUser.options && optionsUser.options.locales) {
      let locales = optionsUser.options.locales
      let index = locales.indexOf('en')
      if (index > -1) {
        locales.splice(index, 1)
      }
      locales.forEach(locale => {
        loadScript(`i18n/${locale}.js`)
      })
    }
    this.element = el
    this.options = optionsUser
    return this
  }
  $on(event, cb) {
    this._on.push({ event, cb })
    return this
  }
  $emit(...args) {
    if (this.app) {
      this.app.$emit.apply(this.app, args)
    } else {
      this._emit.push(args)
    }
    return this
  }
  submit(...args) {
    this.$emit('submit', ...args)
    return this
  }
  location(...args) {
    this.$emit('location', ...args)
    return this
  }
  setParams(...args) {
    this.$emit('set-params', ...args)
    return this
  }
  destroy(...args) {
    this.$emit('destroy', ...args)
    return this
  }
  run() {
    this.app = window.fondy(this.element, this.options)
    this._on.forEach(item => {
      this.app.$on(item.event, item.cb)
    })
    this._emit.forEach(args => {
      this.app.$emit.apply(this.app, args)
    })
  }
}

let fondy = new F()
let load = 0
let loaded = 0

function loadScript(src) {
  const el = document.createElement('script')
  load += 1
  el.type = 'text/javascript'
  el.src = `${cdn}${src}?${version}`
  el.async = false
  el.addEventListener('load', function () {
    loaded += 1
    if (load === loaded && fondy.isInit) {
      fondy.run()
    }
  })
  document.head.appendChild(el)
}

function loadStyle(src) {
  const el = document.createElement('link')
  el.rel = 'stylesheet'
  el.type = 'text/css'
  el.href = `${cdn}${src}?${version}`
  document.head.appendChild(el)
}

loadStyle(`checkout.css`)
loadScript(`checkout.js`)

window.fondy = fondy.init.bind(fondy)
