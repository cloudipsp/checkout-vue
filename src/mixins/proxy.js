import { isString } from '@/utils/typeof'

export default {
  methods: {
    proxy(fn) {
      return ((cx, cb) => (...args) => cb.apply(cx, args))(
        this,
        isString(fn) ? this[fn] : fn
      )
    },
  },
}
