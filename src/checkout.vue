<template>
  <div id="f" ref="f">
    <div
      v-if="!error.errors.length"
      class="f-container"
      :class="{ 'f-min': min }"
    >
      <f-header :min="min" />
      <payment @on-set-min="setMin" />
    </div>
    <ul v-else>
      <li v-for="error in error.errors" :key="error.message">
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import Payment from '@/components/payment'
import EventBus from '@/event-bus'

export default {
  name: 'FCheckout',
  components: {
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
  created: function() {
    this.store.setOptions(this.optionsUser)
    //      require('./less/style.less')
    if (this.options.full_screen) {
      require('./less/style-sm.less')
      require('./less/style-md.less')
      setTimeout(() => {
        this.$refs.f.style.height = '100%'
      })
    }

    EventBus.$on('checkout-min', this.setMin)
  },
  methods: {
    setMin: function(min) {
      this.min = min
    },
  },
}
</script>
