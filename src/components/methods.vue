<template>
  <div class="f-methods">
    <div class="f-block f-block-hr f-title">Методы оплаты</div>
    <transition-group>
    <div
      class="f-menu"
      v-if="item in config"
      :class="[item, { active: item === active }]"
      v-for="item in methods"
      :key="item"
      @click="onChangeMethod(item)"
    >
      {{ config[item].name }}
    </div>
    </transition-group>
  </div>
</template>

<script>
  export default {
    props: ['onChangeMethod', 'methods', 'active'],
    data () {
      return {
        config: {
          card: {
            name: 'Оплата картой'
          },
          emoney: {
            name: 'Электроные деньги'
          },
          ibank: {
            name: 'Интернет–банки'
          },
          cash: {
            name: 'Наличные'
          },
          sepa: {
            name: 'Международные платежи'
          }
        }
      }
    }
  }
</script>

<style lang="less">
  @import '../less/mixins.less';

  .f-menu{
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    padding: 13px 15px 13px 62px;
    margin: 0 -15px;
    cursor: pointer;
    color: #3D3D3D;
    transition: background ease-in-out .15s;
    background-repeat: no-repeat;
    background-position: 18px 50%;

    .bg(card);
    .bg(emoney);
    .bg(ibank);
    .bg(cash);
    .bg(sepa);

    &.active{
      color: #62BA46;
      background-color: #FFFFFF;
      box-shadow: 0 0 16px 0 rgba(90,136,215,0.16);

      .bg(card, card_a);
      .bg(emoney, emoney_a);
      .bg(ibank, ibank_a);
      .bg(cash, cash_a);
      .bg(sepa, sepa_a);
    }
  }
  .f-methods{
    border-bottom: 2px solid rgba(61,61,61,0.06);
  }
</style>
