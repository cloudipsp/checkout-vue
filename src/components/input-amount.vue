<template>
  <f-form-group v-model="form[name]" v-bind="attrs">
    <template #default="{ id }">
      <slot :id="id" />
      <span class="f-form-group-currency" v-text="$t(currency)" />
    </template>
  </f-form-group>
</template>

<script>
import { mapState } from '@/utils/store'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  inheritAttrs: false,
  props: {
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    value: makeProp(PROP_TYPE_STRING),
    recurring: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      hasLastDot: false,
    }
  },
  computed: {
    ...mapState(['params']),
    ...mapState('params', ['currency']),
    attrs() {
      return {
        ...this.$attrs,
        name: this.name,
        value: this.value,
        rules: 'required|decimal:2',
        type: 'tel',
        inputmode: 'numeric',
        autocomplete: 'off',
        format: this.format,
        parse: this.parse,
      }
    },
    form() {
      return this.recurring ? this.params.recurring_data : this.params
    },
  },
  created() {
    this.form[this.name] = this.form[this.name] || this.value
  },
  methods: {
    format(value) {
      value = parseInt(value)

      let result = ''
      if (value) {
        result = String(value / 100)
      }
      if (this.hasLastDot) {
        result += '.'
      }
      return result
    },
    parse(value) {
      this.hasLastDot = value.slice(-1) === '.'
      return Math.round(parseFloat(value).toFixed(2) * 100) || 0
    },
  },
}
</script>
