<template>
  <div id="f" ref="f">
    <div v-if="!error.errors.length" class="f-container" :class="{'f-min': min}">
      <checkout-header></checkout-header>
      <payment @on-set-min="setMin"></payment>
    </div>
    <ul v-else>
      <li v-for="error in error.errors">{{ error.message }}</li>
    </ul>
  </div>
</template>

<script>
  import CheckoutHeader from '@/components/checkout-header'
  import Tooltip from '@/components/tooltip'
  import Payment from '@/components/payment'

  export default {
    name: 'f-checkout',
    props: ['optionsUser'],
    data () {
      return {
        min: true,
      }
    },
    created: function () {
      this.store.setOptions(this.optionsUser, this.$i18n)
//      require('./less/style.less')
      if (this.options.full_screen) {
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
