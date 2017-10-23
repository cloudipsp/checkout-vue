<template>
  <div class="f-ibank">
    <div class="f-block f-title2">Выберите ваш банк:</div>
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
          p24: {
            name: 'Приват 24'
          },
          platba24: {
            name: 'Платба 24'
          },
          raiffeisen: {
            name: 'Райффайзен Банк Аваль'
          }
        }
      }
    }
  }
</script>

<style lang="less">
  @import '../less/mixins.less';

  .f-icon{
    .bg(p24);
    .bg(platba24);
    .bg(raiffeisen);
  }
</style>
