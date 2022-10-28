<template>
  <input
    :checked="value"
    v-bind="$attrs"
    type="checkbox"
    @change="change"
    @focus="focus"
    @blur="blur"
    @keyup="keyup"
  />
</template>

<script>
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  props: {
    value: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  methods: {
    change($event) {
      this.$emit('input', $event.target.checked)
    },
    focus($event) {
      this.$emit('focus', $event)
    },
    blur($event) {
      this.$emit('blur', $event)
    },
    keyup($event) {
      this.$emit('keyup', $event)
    },
  },
}
</script>
