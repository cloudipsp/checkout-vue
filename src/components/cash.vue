<template>
  <div class="f-cash">
    <div class="f-block f-title2">Чем платить будете?</div>
    <div class="f-block text-center">
      <div
        class="f-payment-system"
        v-if="item in config"
        v-for="item in paymentSystems"
        :key="item"
      >
        <div class="f-icon" :class="item"></div>
        <div>{{ config[item].name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['paymentSystems'],
    data () {
      return {
        config: {
          liqpay: {
            name: 'LiqPay'
          }
        }
      }
    }
  }
</script>

<style lang="less">
  @import '../less/mixins.less';

  .f-icon{
    .bg(liqpay);
  }
</style>
