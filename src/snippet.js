const cdn = 'https://checkout-vue.web.app/'
const version = Date.now()

class F {
  constructor() {
    this._on = []
    this._emit = []
  }
  init(el, optionsUser) {
    this._init = true
    if (optionsUser && optionsUser.options && optionsUser.options.locales) {
      let locales = optionsUser.options.locales
      let index = locales.indexOf('en')
      if (index > -1) {
        locales.splice(index, 1)
      }
      locales.forEach(locale => {
        loadScript(`${cdn}i18n/${locale}.js`)
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
    this.$emit('setParams', ...args)
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
let count = 0
let load = 0

function loadScript(src) {
  const el = document.createElement('script')
  load += 1
  el.type = 'text/javascript'
  el.src = `${src}?${version}`
  el.async = false
  el.addEventListener('load', function() {
    count += 1
    if (load === count && fondy._init) {
      fondy.run()
    }
  })
  document.getElementsByTagName('head')[0].appendChild(el)
}

loadScript(`${cdn}checkout.js`)

window.fondy = fondy.init.bind(fondy)
