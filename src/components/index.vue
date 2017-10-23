<template>
  <div class="row f-wrapper">
    <div class="col-md-3 col-md-push-9">
      <info :info="options.info"></info>
    </div>
    <div class="col-sm-4 col-md-3 col-md-pull-3">
      <methods :on-change-method="changeMethod" :methods="options.methods" :active="paymentMethod"></methods>
    </div>
    <div class="f-center col-sm-8 col-md-6 col-md-pull-3">
      <fields v-if="options.fields"></fields>
      <component
        :is="paymentMethod"
        :icons="options[paymentMethod + 'Icons']"
        :payment-systems="options[paymentMethod]"
        :on-back="changeMethod"
        :valid="options.valid"
        :on-submit="submit"
      ></component>
      <regular v-if="options.regular && paymentMethod === 'card'"></regular>
      <offer v-if="options.offer"></offer>
      <payment-button :valid="options.valid" :on-submit="submit">
        Оплатить {{options.info.full_amount}} {{options.info.currency}}
      </payment-button>
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
  import Card from './card'
  import Emoney from './emoney'
  import Ibank from './ibank'
  import Cash from './cash'
  import Sepa from './sepa'
  import Regular from './regular'
  import PaymentButton from './payment-button'
  import Offer from './offer'
  import Verify from './verify'

  export default {
    data () {
      return {
        paymentMethod: 'card',
        options: {
          methods: ['card', 'emoney', 'ibank', 'cash', 'sepa'],
          ibank: ['p24', 'platba24', 'raiffeisen'],
          emoney: ['paypal', 'qiwi', 'webmoney', 'yamoney'],
          cash: ['liqpay'],
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
        loading: false
      }
    },
    components: {
      Info,
      Methods,
      Fields,
      Card,
      Emoney,
      Ibank,
      Cash,
      Sepa,
      Regular,
      PaymentButton,
      Offer,
      Verify
    },
    methods: {
      changeMethod: function (method) {
        this.paymentMethod = method
      },
      submit: function () {
        if (!this.loading) {
          this.loading = true
          setTimeout(() => {
            this.changeMethod('verify')
            this.loading = false
          }, 3000)
        }
      },
      min: function () {
        this.options = {
          methods: ['card'],
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
      }
    }
  }
</script>

<style lang="less">
  @import '../less/index.less';

  .f-loading {
    position: absolute;
    z-index: 100;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #fff;
    opacity: 0.7;

  }

  .f-loading-i {
    width: 40px;
    height: 40px;
    position: absolute;
    z-index: 101;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -20px;

    background-image: url(../assets/loading.svg);
    background-repeat: no-repeat;
    background-position: 50% 50%;
    animation: rotate 3s linear infinite;

  }

  @keyframes rotate {
    0% {
      transform-origin: center center;
      transform: rotate3d(0, 0, 1, -360deg);
    }
    100% {
      transform-origin: center center;
      transform: rotate3d(0, 0, 1, 0deg);
    }
  }

</style>
