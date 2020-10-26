<template>
  <ValidationObserver ref="observer" tag="div">
    <slot />
  </ValidationObserver>
</template>

<script>
export default {
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
