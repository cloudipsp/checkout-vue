<template>
  <div>
    <fields v-if="options.fields"></fields>
    <component
      :is="method"
      :icons="options[method + 'Icons']"
      :payment-systems="options[method]"
      :cards="cards"
    ></component>
    <regular v-if="options.regular && options.regular.insert && method === 'card'"></regular>
    <offer v-if="options.offer"></offer>
    <div class="f-block" v-if="options.button">
      <div class="f-block-sm">
        <button @click="onSubmit()" type="button" class="f-btn f-btn-success f-btn-lg f-btn-block f-submit" :disabled="!valid">
          Оплатить <span v-if="fullAmount">{{fullAmount}} {{form.currency}}</span>
        </button>
        <div class="f-hidden-desktop">
          <i class="f-icon f-icon-block f-i-security"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Card from '@/components/card'
  import Emoney from '@/components/emoney'
  import Ibank from '@/components/ibank'
  import Cash from '@/components/cash'
  import Sepa from '@/components/sepa'
  import Regular from '@/components/regular'
  import Offer from '@/components/offer'
  import store from '@/store'
  import Fields from '@/components/payment-fields'

  export default {
    props: ['method', 'onSubmit', 'valid', 'cards'],
    data () {
      return {
        options: store.state.options,
        form: store.state.form
      }
    },
    computed: {
      fullAmount: function () {
        let amount = parseInt(this.form.amount)
        let amountWithFee = parseInt(this.form.amount_with_fee)
        if (!amount) {
          return false
        }
        return (amountWithFee || amount) / 100
      }
    },
    components: {
      Card,
      Emoney,
      Ibank,
      Cash,
      Sepa,
      Regular,
      Offer,
      Fields
    },
    methods: {}
  }
</script>
