<template>
  <div>
    <component
      :is="method"
      :icons="options[method + 'Icons']"
      :payment-systems="options[method]"
      :cards="cards"
    ></component>
    <regular v-if="options.regular && options.regular.show && method === 'card'" :options="options.regular"></regular>
    <offer v-if="options.offer"></offer>
    <div class="f-block">
      <div class="f-block-sm">
        <button @click="onSubmit()" type="button" class="btn btn-success btn-lg btn-block f-submit" :disabled="!valid">
          Оплатить <span v-if="full_amount">{{full_amount}} {{form.currency}}</span>
        </button>
        <div class="hidden-md hidden-lg">
          <i class="f-icon f-icon-block security"></i>
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
  import Regular from './regular'
  import Offer from './offer'
  import store from '@/store'

  export default {
    props: ['method', 'options', 'onSubmit', 'valid', 'cards'],
    data () {
      return {
        form: store.state.form
      }
    },
    computed: {
      full_amount: function () {
        if (!this.form.amount) {
          return false
        }
        return this.form.amount_with_fee || this.form.amount
      }
    },
    components: {
      Card,
      Emoney,
      Ibank,
      Cash,
      Sepa,
      Regular,
      Offer
    },
    methods: {}
  }
</script>
