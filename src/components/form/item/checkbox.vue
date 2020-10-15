<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <checkbox
      v-model="innerValue"
      :class="classInput"
      v-bind="attrs"
      v-on="$listeners"
      @keyup.enter="onEnter"
    />
    <label class="f-checkbox-label" :for="_id"><slot /></label>
  </ValidationProvider>
</template>

<script>
import item from '@/mixins/item'
import Checkbox from './helpers/checkbox'

export default {
  components: {
    Checkbox,
  },
  mixins: [item],
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'secondary'].includes(value),
    },
  },
  computed: {
    classInput() {
      return ['f-checkbox', `f-checkbox-${this.variant}`, this.inputClass]
    },
  },
}
</script>
