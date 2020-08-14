<template>
  <f-btn-link class="f-btn-methods" @click="toggleModalMethods">
    <f-svg name="back" size="lg" />
  </f-btn-link>
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
