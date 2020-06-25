import proxy from '@/mixins/proxy'

export default {
  mixins: [proxy],
  methods: {
    timeout(callback, time) {
      if (!this.timeout.data) this.timeout.data = {}
      clearTimeout(this.timeout.data[callback])
      delete this.timeout.data[callback]
      this.timeout.data[callback] = setTimeout(this.proxy(callback), time)
      return this
    },
  },
  beforeDestroy() {
    if (!this.timeout.data) return
    Object.keys(this.timeout.data).forEach(id => {
      clearTimeout(this.timeout.data[id])
      delete this.timeout.data[id]
    })
  },
}
