<template>
  <div id="f">
    <div
      v-if="!error.errors.length"
      class="f-container"
      :class="{ 'f-min': min }"
    >
      <f-header :min="min" />
      <payment :min="min" />
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
import EventBus from '@/event-bus'
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
  data() {
    return {
      min: true,
    }
  },
  computed: {
    ...mapState(['error']),
  },
  created: function() {
    this.store.setOptions(this.optionsUser)

    EventBus.$on('checkout-min', this.setMin)
  },
  methods: {
    setMin: function(min) {
      this.min = min
    },
  },
}
</script>
