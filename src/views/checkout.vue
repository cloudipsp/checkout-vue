<template>
  <div class="f-container" :class="classNameContainer">
    <div v-if="isDemo" class="f-demo">
      <div class="f-demo-title" v-text="$t('demo-title')" />
    </div>
    <f-header />
    <payment />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import Payment from '@/components/payment'
import FHeader from '@/components/header'

export default {
  components: {
    FHeader,
    Payment,
  },
  computed: {
    ...mapState(['isOnlyCard']),
    ...mapState('options', ['show_menu_first', 'disable_request']),
    ...mapState('options.theme', ['type']),
    classNameContainer() {
      return [
        {
          'f-only-card': this.isOnlyCard,
          'f-open': this.show_menu_first,
        },
        `f-page-${this.$route.name}`,
        `f-theme-${this.type}`,
      ]
    },
    isDemo() {
      return this.disable_request
    },
  },
}
</script>
