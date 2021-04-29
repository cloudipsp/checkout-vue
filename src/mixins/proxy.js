import { isString } from '@/utils/inspect'

// @vue/component
export const proxyMixin = {
  methods: {
    proxy(fn) {
      return ((cx, cb) => (...args) => cb.apply(cx, args))(
        this,
        isString(fn) ? this[fn] : fn
      )
    },
  },
}
