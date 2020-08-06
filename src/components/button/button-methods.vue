<template>
  <button
    class="f-btn-methods f-btn f-btn-link f-btn-block"
    type="button"
    @click="toggleModalMethods"
  >
    <f-svg name="back" size="lg" />
  </button>
</template>

<script>
export default {
  methods: {
    toggleModalMethods() {
      this.store.toggleModalMethods()
    },
  },
}
</script>
