<template>
  <f-form-group v-model="form[name]" v-bind="attrs" />
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
    validate: {
      type: String,
      default: '',
    },
    custom: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['params']),
    attrs() {
      return {
        ...this.$attrs,
        name: this.name,
        rules: this.validate,
      }
    },
    form() {
      return this.custom ? this.params.custom : this.params
    },
  },
  created() {
    this.form[this.name] = this.form[this.name] || this.value
  },
}
</script>
