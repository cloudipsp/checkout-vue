export default {
  methods: {
    attr(name, value) {
      name = (name || '').split('.')
      let data = this
      let prop = name.pop()
      let len = arguments.length

      name.forEach(item => {
        if (data) {
          data = data[item]
        } else if (len === 2) {
          data = data[item] = {}
        }
      })
      if (len === 1) {
        return data ? data[prop] : null
      }
      if (len === 2) {
        data[prop] = value
      }
    },
  },
}
