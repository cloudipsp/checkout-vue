<template>
  <div class="f-container" :class="{'f-min': min}">
    <checkout-header></checkout-header>
    <router-view :options="defaultOptions" :on-set-min="setMin"></router-view>
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
        params: {
          commision: 0,
          currency: 'UAH',
          amount: '1',
          recurring_data: {}
        }
      }
    },
    created: function () {
      Object.assign(this.defaultOptions, this.options)
      this.defaultOptions.params = {}
      Object.assign(this.defaultOptions.params, this.params, this.options.params)
    },
    components: {
      CheckoutHeader
    },
    methods: {
      setMin: function (min) {
        this.min = min
      }
    }
  }
</script>

<style lang="less">
  @import './less/style.less';
</style>
