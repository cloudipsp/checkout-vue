<template>
  <div class="f-wrapper">
    <div class="f-mobile-menu visible-xs">
      <button class="btn btn-default btn-sm" @click="show = !show"><i class="glyphicon glyphicon-th-large"></i> Другие способы</button>
    </div>
    <div class="f-info">
      <info :info="options.info"></info>
    </div>
    <div class="f-methods" :class="{open : show}">
      <methods :methods="options.methods" :fast="fast"></methods>
    </div>
    <div class="f-center">
      <fields v-if="options.fields"></fields>
      <router-view :options="options" :on-submit="submit"></router-view>
      <div v-if="loading">
        <div class="f-loading"></div>
        <div class="f-loading-i"></div>
      </div>
    </div>
    <options v-model="options">
      <button class="btn btn-default" @click="min()">min</button>
    </options>
  </div>
</template>

<script>
  import Info from './info'
  import Methods from './methods'
  import Fields from './payment-fields'
  import Verify from './verify'

  export default {
    props: ['onSetMin'],
    data () {
      return {
        options: {
          methods: ['card', 'emoney', 'ibank', 'cash', 'sepa'],
          ibank: ['p24', 'platba24', 'raiffeisen'],
          emoney: ['paypal', 'qiwi', 'webmoney', 'yamoney'],
          cash: ['liqpay'],
          fast: ['p24', 'platba24', 'paypal', 'liqpay', 'qiwi'],
          cardIcons: ['mastercard', 'visa', 'mir', 'prostir', 'diners-club', 'american-express'],
          fields: true,
          regular: true,
          offer: true,
          valid: false,
          info: {
            title: 'Назначение платежа',
            desc: 'Благотворительная помощь (ребенку или отделению гематологии, или отделению плановой хирургии с онкологическими койками днепропетровской областной детской клинической больницы)',
            link: 'https://fondy.eu',
            amount: 500,
            full_amount: 510,
            commision: 10,
            currency: 'UAH'
          }
        },
        loading: false,
        show: false
      }
    },
    created: function () {
      this.setMin(this.options.methods)
    },
    computed: {
      fast: function () {
        let fast = []
        this.options.fast.forEach(function (system) {
          ['emoney', 'ibank', 'cash'].forEach(function (method) {
            if (this.options[method].indexOf(system) > -1) {
              fast.push({
                method: method,
                system: system
              })
            }
          }, this)
        }, this)
        return fast
      }
    },
    components: {
      Info,
      Methods,
      Fields,
      Verify
    },
    watch: {
      '$route' (to, from) {
        this.show = false
      },
      'options.methods': function (val) {
        this.setMin(val)
      }
    },
    methods: {
      min: function () {
        this.options = {
          methods: ['card'],
          fast: [],
          cardIcons: ['mastercard', 'visa'],
          valid: false,
          info: {
            title: 'Назначение платежа',
            desc: 'Благотворительная помощь',
            amount: 500,
            full_amount: 500,
            currency: 'UAH'
          }
        }
        this.$router.push({name: 'method', params: { method: 'card' }})
      },
      submit: function () {
        if (!this.loading) {
          this.loading = true
          setTimeout(() => {
            this.$router.push({name: 'verify'})
            this.loading = false
          }, 3000)
        }
      },
      setMin: function (val, oldVal) {
        this.onSetMin(val.length === 1 && val[0] === 'card')
      }
    }
  }
</script>

<style lang="less">
  @import '../less/style.less';

  @f-sm-width: 33%;
  @f-md-width: 26%;
  @f-min-width: 35%;

  .f-wrapper{
    background-color: #FCFEFF;
    &:extend(.clearfix all);

    @media (min-width: @screen-sm-min) {

    }
    @media (min-width: @screen-md-min) {
      border: 1px solid #E0E8EF;
      border-radius: 8px;
      box-shadow: 0 16px 16px 0 rgba(0,0,0,0.04);
    }
  }
  .f-mobile-menu{
    .f-min &{
      display: none!important;
    }
    position: absolute;
    top: 8px;
    right: 23px;

  }
  .f-info,
  .f-methods,
  .f-center{
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .f-info{ // col-md-3 col-md-push-9
    color: #A9A9A9;

    border-top: 2px solid #EAF1F6;
    border-bottom: 2px solid #EAF1F6;

    @media (min-width: @screen-sm-min) {
      border-top: none;
      border-bottom: 2px solid #E0E8EF;
      box-shadow: inset 0 -10px 40px -8px rgba(72, 133, 149, 0.24);
    }
    @media (min-width: @screen-md-min) {
      .f-min &{
        width: @f-min-width;
        left: 100% - @f-min-width;
      }
      float: left;
      width: @f-md-width; // col-md-3
      left: 100% - @f-md-width; // col-md-push-9

      border: none;
      box-shadow: none;
    }

    @media (max-width: @screen-sm-max) {
      .f-block-hr {
        border: none;
      }
    }
  }
  .f-methods{ // col-sm-4 col-md-3 col-md-pull-3
    .f-min &{
      display: none;
    }
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background: #fff;
    padding: 0;
    overflow-y: auto;

    transition: transform .3s cubic-bezier(.25,.8,.25,1);
    transform: translate3d(-100%,0,0);

    &.open{
      transform: translate3d(0,0,0);
    }

    @media (min-width: @screen-sm-min) {
      position: relative;
      top: auto;
      right: auto;
      bottom: auto;
      left: auto;
      background: inherit;
      padding-left: 15px;
      padding-right: 15px;
      transform: translate3d(0,0,0);

      float: left;
      width: @f-sm-width; // col-sm-4
    }
    @media (min-width: @screen-md-min) {
      width: @f-md-width; // col-md-3
      right: @f-md-width; // col-md-pull-3
    }

    @media (max-width: @screen-xs-max) {
      .f-block-hr {
        border: none;
      }
    }
  }
  .f-center { // col-sm-8 col-md-6 col-md-pull-3
    background: #fff;

    @media (min-width: @screen-sm-min) {
      .f-min &{
        width: 100%;
      }
      float: left;
      width: 100% - @f-sm-width; // col-sm-8

      border-left: 2px solid rgba(61,61,61,0.06);
    }
    @media (min-width: @screen-md-min) {
      .f-min &{
        width: 100% - @f-min-width;
        right: @f-min-width
      }
      width: 100% - @f-md-width*2; // col-md-6
      right: @f-md-width; // col-md-pull-3

      border-right: 2px solid rgba(61,61,61,0.06);
    }
  }
</style>
