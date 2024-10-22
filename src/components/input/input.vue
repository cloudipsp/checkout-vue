<template>
  <f-form-input v-bind="attrs" v-on="$listeners" />
</template>

<script>
import { FFormInput } from '@/components/form/item/helpers/form-input'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_ANY,
  PROP_TYPE_STRING,
  PROP_TYPE_ARRAY_OBJECT_STRING,
} from '@/constants/props'
import { attemptFocus, isActiveElement } from '@/utils/dom'

export default {
  components: {
    FFormInput,
  },
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    invalid: makeProp(PROP_TYPE_BOOLEAN),
    value: makeProp(PROP_TYPE_ANY),
    inputClass: makeProp(PROP_TYPE_ARRAY_OBJECT_STRING),
    size: makeProp(PROP_TYPE_STRING, '56', value =>
      ['44', '48', '56'].includes(value)
    ),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      ['default', 'secondary'].includes(value)
    ),
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        ref: 'input',
        value: this.value,
        class: this.className,
      }
    },
    className() {
      return [
        this.style.input,
        this.style[this.variant],
        this.style[`size_${this.size}`],
        this.inputClass,
        {
          [this.style.error]: this.invalid,
        },
      ]
    },
  },
  methods: {
    focused() {
      if (isActiveElement(this.$refs.input.$el)) return

      attemptFocus(this.$refs.input.$el)
    },
  },
}
</script>

<style lang="scss" module="style">
@import 'src/scss/core/input.module';
</style>
