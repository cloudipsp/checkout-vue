<template>
  <alert v-bind="attrs" v-on="$listeners">
    <slot />
  </alert>
</template>

<script>
import Alert from './helpers/alert'

export default {
  components: {
    Alert,
  },
  inheritAttrs: false,
  model: {
    prop: 'show',
    event: 'input',
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
      }
    },
  },
}
</script>
