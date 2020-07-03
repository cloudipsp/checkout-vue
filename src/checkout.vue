<template>
  <div id="f">
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
import { mapState } from '@/utils/store'

export default {
  name: 'FCheckout',
  components: {
    FHeader,
    Payment,
  },
  props: {
    optionsUser: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['isOnlyCard']),
    ...mapState(['showModalMethods']),
    ...mapState(['error']),
    className() {
      return {
        'f-only-card': this.isOnlyCard,
        'f-open': this.showModalMethods,
      }
    },
  },
  created: function() {
    this.store.setOptions(this.optionsUser)
  },
}
</script>
