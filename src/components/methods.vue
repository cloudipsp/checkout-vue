<template>
  <div class="f-block-hr">
    <div class="f-block f-block-hr f-title hidden-xs">Методы оплаты</div>
    <div class="f-block f-title3 visible-xs">Выберите способ оплаты</div>
    <div class="f-menu">
      <transition-group>
        <router-link
          class="f-item"
          v-if="item in config"
          :class="[item]"
          v-for="item in methods"
          :key="item"
          @click="console.log(1)"
          :to="{ name: 'method', params: { method: item }}"

          router-link-active
        >
          {{ config[item].name }}
        </router-link>
      </transition-group>
    </div>
    <div class="f-fast-access">
      <router-link
        class="f-icon"
        v-for="item in fast"
        :key="item.system"
        :class="item.system"
        :to="{ name: 'method', params: { method: item.method, system: item.system }}"
      ></router-link>
    </div>
  </div>
</template>

<script>
  // TODO import config icon f-fast-access
  export default {
    props: ['methods', 'fast'],
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
  @import '../less/style.less';

  .f-menu{
    text-align: center;
    @media (min-width: @screen-sm-min) {
      text-align: left;
    }
    @media (min-width: @screen-md-min) {

    }
  }
  .f-item{
    cursor: pointer;
    color: #3D3D3D;
    transition: background ease-in-out .15s;
    background-repeat: no-repeat;
    vertical-align: top;

    .bg(card);
    .bg(emoney);
    .bg(ibank);
    .bg(cash);
    .bg(sepa);

    display: inline-block;
    height: 92px;
    width: 140px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16);
    margin: 5px;
    padding: 50px 0 0 0;
    background-position: 50% 20px;

    @media (min-width: @screen-sm-min) {
      height: auto;
      width: auto;
      display: block;
      font-size: 14px;
      font-weight: 500;
      line-height: 18px;
      padding: 13px 15px 13px 62px;
      margin: 0 -15px;
      box-shadow: none;
      background-position: 18px 50%;
    }
    @media (min-width: @screen-md-min) {

    }

    &:first-child{

      @media (min-width: @screen-sm-min) {
        margin-top: -2px;
        position: relative;
      }
      @media (min-width: @screen-md-min) {

      }
    }

    &:hover,
    &:focus{
      text-decoration: none;
      color: inherit;
      outline: none;
    }

    &.router-link-active{
      color: #62BA46;
      background-color: #FFFFFF;
      box-shadow: 0 0 16px 0 rgba(90,136,215,0.16);

      .bg(card, card_a);
      .bg(emoney, emoney_a);
      .bg(ibank, ibank_a);
      .bg(cash, cash_a);
      .bg(sepa, sepa_a);

      @media (min-width: @screen-sm-min) {
        &:after{
          content: '';
          display: inline-block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          border-width: 4px 0 4px 4px ;
          border-left-color: #62BA46;
          margin-left: 10px;
        }
      }
      @media (min-width: @screen-md-min) {

      }
    }
  }
  .f-fast-access{
    text-align: center;

    @media (min-width: @screen-sm-min) {
      text-align: left;
    }
    @media (min-width: @screen-md-min) {

    }
  }
</style>
