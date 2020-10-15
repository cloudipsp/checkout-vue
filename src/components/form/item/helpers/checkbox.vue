<template>
  <input
    :checked="value"
    v-bind="$attrs"
    type="checkbox"
    @input="input"
    @focus="focus"
    @blur="blur"
    @keyup="keyup"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
    },
  },
  methods: {
    input($event) {
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
