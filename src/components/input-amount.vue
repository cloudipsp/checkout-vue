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

export default {
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    recurring: {
      type: Boolean,
      default: false,
    },
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
