import {
  Vue,
  App,
  installValidate,
  installSentry,
  installApi,
  store,
  router,
  i18n,
  configDefault,
  inspect,
  loadCheckout,
  loadAsyncValidator,
} from '@/import'

import '@/scss/fonts.scss'

loadCheckout()
loadAsyncValidator()

const load = Promise.all([
  Vue(),
  App(),
  installValidate(),
  installSentry(),
  installApi(),
  store(),
  router(),
  i18n(),
  configDefault(),
  inspect(),
])

let instance = {}

class F {
  constructor() {
    this._on = []
    this._emit = []
  }
  $on(...args) {
    if (this.app) {
      this.app.$on.apply(this.app, args)
    } else {
      this._on.push(args)
    }
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
  $destroy() {
    if (this.app) {
      this.app.$destroy()
    }
    return this
  }
  $nextTick(...args) {
    if (this.app) {
      this.app.$nextTick.apply(this.app, args)
    }
    return this
  }
  get $el() {
    return this.app?.$el
  }
  get store() {
    return this.app?.store
  }
  run(app) {
    this.app = app
    this._on.forEach(args => {
      this.app.$on.apply(this.app, args)
    })
    this._emit.forEach(args => {
      this.app.$emit.apply(this.app, args)
    })
  }
}

window.checkout = window.fondy = function (el, optionsUser = {}) {
  let app = new F()

  load.then(
    ([
      Vue,
      App,
      installValidate,
      installSentry,
      installApi,
      { createStore },
      { createRouter },
      { i18n },
      { configDefault },
      { isString, isPlainObject },
    ]) => {
      if (!isString(el)) return console.error('Selector not a string')
      if (!isPlainObject(optionsUser))
        return console.error('Options not an object')
      let node = document.querySelector(el)
      if (!node) return console.error(['Selector', el, 'not found'].join(' '))

      let store = createStore(el)
      let router = createRouter(el)

      Vue.use(installValidate)
      Vue.use(installSentry(router))

      let origin =
        'https://' +
        (optionsUser.options?.api_domain ||
          optionsUser.options?.apiDomain ||
          optionsUser.button?.host ||
          configDefault.options.api_domain)
      let endpoint =
        optionsUser.options?.endpoint || configDefault.options.endpoint
      installApi(
        {
          origin,
          endpoint,
        },
        () => {
          store.formLoading(false)
        }
      )

      if (instance[el]) instance[el].$destroy()

      instance[el] = new Vue({
        store,
        router,
        i18n,
        data: {
          optionsUser,
        },
        methods: {
          submit() {
            this.$emit('submit')
          },
          location(args) {
            this.$emit('location', ...args)
          },
          setParams(args) {
            this.$emit('setParams', ...args)
          },
        },
        render(h) {
          return h(App, {
            props: {
              optionsUser,
            },
          })
        },
      }).$mount()

      while (node.firstChild) {
        node.removeChild(node.firstChild)
      }
      node.appendChild(instance[el].$el)

      app.run(instance[el])

      return instance[el]
    }
  )

  return app
}
