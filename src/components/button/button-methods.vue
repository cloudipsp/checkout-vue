<template>
  <f-btn-link class="f-btn-methods" @click="toggleMenu">
    <f-svg name="back" size="lg" />
  </f-btn-link>
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
