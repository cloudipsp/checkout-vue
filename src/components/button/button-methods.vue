<template>
  <f-button-link class="f-btn-methods" @click="toggleMenu">
    <f-svg name="back" size="lg" />
  </f-button-link>
</template>

<script>
export default {
  methods: {
    toggleMenu() {
      this.store.toggleMenu()
    },
  },
}
</script>
