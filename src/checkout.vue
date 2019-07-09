<template>
  <div id="f" ref="f">
    <div
      v-if="!error.errors.length"
      class="f-container"
      :class="{ 'f-min': min }"
    >
      <checkout-header />
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
import CheckoutHeader from '@/components/checkout-header'
import Payment from '@/components/payment'

export default {
  name: 'FCheckout',
  components: {
    CheckoutHeader,
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
  },
  methods: {
    setMin: function(min) {
      this.min = min
    },
  },
}
</script>
