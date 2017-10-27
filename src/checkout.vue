<template>
  <div class="f-container" :class="{'f-min': min}">
    <checkout-header></checkout-header>
    <router-view :options2="options" :on-set-min="setMin"></router-view>
  </div>
</template>

<script>
  import CheckoutHeader from '@/components/checkout-header'

  export default {
    name: 'f-checkout',
    props: ['options'],
    data () {
      return {
        min: true
      }
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

  .f-container{
    height: 100%;
    @media (min-width: @screen-sm-min) {

    }
    @media (min-width: @screen-md-min) {
      .f-min&{
        width: 668px;
      }
      margin: auto;
      width: 902px;
    }
  }
</style>
