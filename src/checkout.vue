<template>
  <div class="f-container" :class="{'f-min': min}">
    <checkout-header></checkout-header>
    <payment :on-set-min="setMin"></payment>
  </div>
</template>

<script>
  import CheckoutHeader from '@/components/checkout-header'
  import store from '@/store'
  import Tooltip from '@/components/tooltip'
  import Payment from '@/components/payment'

  export default {
    name: 'f-checkout',
    props: ['options'],
    data () {
      return {
        min: true
      }
    },
    created: function () {
      store.setOptions(this.options)

      if (store.state.options.fullScreen) {
        require('./less/style.less')
        require('./less/style-sm.less')
        require('./less/style-md.less')
        setTimeout(() => {
          this.$root.$el.style.height = '100%'
        })
      } else {
        require('./less/style.less')
      }
    },
    components: {
      CheckoutHeader,
      Tooltip,
      Payment
    },
    methods: {
      setMin: function (min) {
        this.min = min
      }
    }
  }
</script>
