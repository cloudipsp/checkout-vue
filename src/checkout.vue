<template>
  <div class="f-container" :class="{'f-min': min}">
    <checkout-header></checkout-header>
    <router-view :options="validOptions" :on-set-min="setMin"></router-view>
  </div>
</template>

<script>
  import CheckoutHeader from '@/components/checkout-header'

  export default {
    name: 'f-checkout',
    props: ['options'],
    data () {
      return {
        min: true,
        defaultOptions: {
          methods: ['card'],
          ibank: [],
          emoney: [],
          cash: [],
          fast: [],
          cardIcons: ['mastercard', 'visa'],
          title: 'Test payment'
        },
        defaultParams: {
          merchant_id: '1396424',
          commision: 0,
          currency: 'UAH',
          amount: '1',
          recurring_data: {}
        },
        validOptions: {}
      }
    },
    created: function () {
      Object.assign(this.validOptions, this.defaultOptions, this.options)
      this.validOptions.params = {}
      Object.assign(this.validOptions.params, this.defaultParams, this.options.params)
      this.validOptions.fast = this.fast()
    },
    components: {
      CheckoutHeader
    },
    methods: {
      setMin: function (min) {
        this.min = min
      },
      fast: function () {
        let fast = []
        this.validOptions.fast.forEach(function (system) {
          ['emoney', 'ibank', 'cash'].forEach(function (method) {
            if (this.validOptions[method].indexOf(system) > -1) {
              fast.push({
                method: method,
                system: system
              })
            }
          }, this)
        }, this)
        return fast
      }
    }
  }
</script>

<style lang="less">
  @import './less/style.less';
</style>
