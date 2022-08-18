<template>
  <div>
    <slot :input="input" />
  </div>
</template>

<script>
import { makeProp } from '@/utils/props'
import { PROP_TYPE_ARRAY, PROP_TYPE_STRING } from '@/constants/props'
import { sessionStorage, mapState } from '@/utils/store'

export default {
  props: {
    includes: makeProp(PROP_TYPE_ARRAY, []),
    name: makeProp(PROP_TYPE_STRING, undefined, true),
  },
  computed: {
    ...mapState(['params']),
  },
  created() {
    this.setForm()
  },
  methods: {
    setForm() {
      const form = sessionStorage.get(this.name)

      if (!form) return

      Object.entries(form).forEach(([name, value]) => {
        if (!this.includes.includes(name)) return
        if (this.attr(`${this.name}.${name}`)) return

        this.attr(`${this.name}.${name}`, value)
      })
    },
    input(name, value) {
      let form = sessionStorage.get(this.name) || {}

      form[name] = value

      sessionStorage.set(this.name, form)
    },
    attr(...args) {
      let [name = '', value] = args
      name = name.split('.')
      let data = this
      let prop = name.pop()
      let len = args.length

      name.forEach(item => {
        if (data && item in data) {
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
</script>
