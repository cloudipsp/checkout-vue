<template>
  <div id="f" ref="f">
    <div class="f-container" :class="{'f-min': min}">
      <checkout-header></checkout-header>
      <payment :on-set-min="setMin"></payment>
    </div>
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
      store.setOptions(this.options, this.$i18n)
      require('./less/style.less')
      if (store.state.options.fullScreen) {
        require('./less/style-sm.less')
        require('./less/style-md.less')
        setTimeout(() => {
          this.$refs.f.style.height = '100%'
        })
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
