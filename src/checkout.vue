<template>
  <div id="f" :style="style">
    <div v-if="!error.errors.length" class="f-container" :class="className">
      <f-header />
      <payment />
    </div>
    <ul v-else>
      <li v-for="item in error.errors" :key="item.message">
        {{ item.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import Payment from '@/components/payment'
import FHeader from '@/components/header'
import { mapState, mapStateGetSet } from '@/utils/store'
import Resize from '@/mixins/resize'

export default {
  name: 'FCheckout',
  components: {
    FHeader,
    Payment,
  },
  mixins: [Resize],
  props: {
    optionsUser: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['isOnlyCard']),
    ...mapStateGetSet(['showModalMethods']),
    ...mapState(['error']),
    className() {
      return {
        'f-only-card': this.isOnlyCard,
        'f-open': this.showModalMethods,
      }
    },
    style() {
      return {
        // .f-sidebar transform: translateX(0);
        overflow: this.showModalMethods && this.isTablet ? 'hidden' : 'visible',
      }
    },
  },
  created: function() {
    this.store.setOptions(this.optionsUser)
  },
  methods: {
    resize() {
      this.showModalMethods = false
    },
  },
}
</script>
