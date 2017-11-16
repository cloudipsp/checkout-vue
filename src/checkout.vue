<template>
  <div class="f-container" :class="{'f-min': min}">
    <checkout-header></checkout-header>
    <router-view :on-set-min="setMin"></router-view>
  </div>
</template>

<script>
  import CheckoutHeader from '@/components/checkout-header'
  import store from '@/store'

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

      setTimeout(() => {
        if (this.options.fullScreen) {
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
      }
    }
  }
</script>

<style lang="less">
  @import './less/style.less';
</style>
