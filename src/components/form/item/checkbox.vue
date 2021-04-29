<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <checkbox
      v-model="innerValue"
      :class="classInput"
      v-bind="attrs"
      v-on="$listeners"
      @keyup.enter="onEnter"
    />
    <label :class="classLabel" :for="attrs.id"><slot /></label>
  </ValidationProvider>
</template>

<script>
import { itemMixin } from '@/mixins/item'
import Checkbox from '@/components/form/item/helpers/checkbox'

export default {
  components: {
    Checkbox,
  },
  mixins: [itemMixin],
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'secondary'].includes(value),
    },
    switch: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classInput() {
      return [
        {
          'f-switch': this.switch,
          'f-checkbox': !this.switch,
          [`f-checkbox-${this.variant}`]: !this.switch,
        },
        this.inputClass,
      ]
    },
    classLabel() {
      return {
        'f-switch-label': this.switch,
        'f-checkbox-label': !this.switch,
      }
    },
  },
}
</script>
