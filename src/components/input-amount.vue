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
import {
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_NUMBER,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { isNumber } from '@/utils/inspect'

export default {
  inheritAttrs: false,
  props: {
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    value: makeProp(PROP_TYPE_NUMBER, 0),
    subscription: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState(['params']),
    ...mapState('params', ['currency', 'verification_type', 'recurring']),
    attrs() {
      return {
        ...this.$attrs,
        name: this.name,
        value: this.value,
        rules: {
          required: true,
          decimal: 2,
          on_zero: !(this.verification_type || this.recurring === 'y'),
        },
        type: 'tel',
        inputmode: 'numeric',
        autocomplete: 'off',
        format: this.format,
        parse: this.parse,
        last: '',
      }
    },
    form() {
      return this.subscription ? this.params.recurring_data : this.params
    },
  },
  created() {
    this.form[this.name] = this.form[this.name] || this.value
  },
  methods: {
    format(value) {
      if (/^(0|\d*\.0?)$/.test(this.last)) return this.last

      value = parseInt(value, 10)

      return isNumber(value) ? String(value / 100) : ''
    },
    parse(value) {
      value = value.replace(',', '.')
      this.last = value

      return Math.round(parseFloat(value).toFixed(2) * 100) || 0
    },
  },
}
</script>
