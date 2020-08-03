<template>
  <div v-if="show" class="f-btn-methods">
    <a href="#" @click.prevent="toggleModalMethods">
      <f-svg name="angle-left" />
      <span v-t="'back_to_payment_methods'" />
    </a>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import Resize from '@/mixins/resize'

export default {
  mixins: [Resize],
  computed: {
    ...mapState(['isOnlyCard', 'showModalMethods']),
    ...mapState('router', ['method', 'page']),
    show() {
      return !this.isOnlyCard && !this.showModalMethods && this.isTablet
    },
  },
  methods: {
    toggleModalMethods() {
      if (this.page === 'success' && this.method === 'approved') return

      this.store.toggleModalMethods()
    },
  },
}
</script>
