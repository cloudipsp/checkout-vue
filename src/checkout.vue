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
          title: 'Test payment',
          regular: {
            insert: false
          },
          button: true
        },
        validOptions: {}
      }
    },
    created: function () {
      console.log('test')
      Object.assign(this.validOptions, this.defaultOptions, this.options)
      this.validOptions.fast = this.fast()

      setTimeout(() => {
        if (this.validOptions.fullScreen) {
          this.$root.$el.style.height = '100%'
        }
      })
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
