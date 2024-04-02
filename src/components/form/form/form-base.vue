<template>
  <ValidationObserver ref="observer" tag="div">
    <slot />
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'

export default {
  components: {
    ValidationObserver,
  },
  provide() {
    return {
      submit: this.submit,
    }
  },
  methods: {
    submit() {
      return Promise.resolve()
    },
  },
}
</script>
