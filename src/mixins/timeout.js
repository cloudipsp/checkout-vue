import { proxyMixin } from '@/mixins/proxy'

// @vue/component
export const timeoutMixin = {
  mixins: [proxyMixin],
  beforeDestroy() {
    if (!this.timeout.data) return
    Object.keys(this.timeout.data).forEach(id => {
      clearTimeout(this.timeout.data[id])
      delete this.timeout.data[id]
    })
  },
  methods: {
    timeout(callback, time) {
      if (!this.timeout.data) this.timeout.data = {}
      this.clearTimeout(callback)
      delete this.timeout.data[callback]
      this.timeout.data[callback] = setTimeout(this.proxy(callback), time)
      return this
    },
    clearTimeout(callback) {
      clearTimeout(this.timeout.data[callback])
    },
  },
}
