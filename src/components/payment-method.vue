<template>
  <div>
    <component
      :is="method"
      :icons="options[method + 'Icons']"
      :payment-systems="options[method]"
      :form="form"
    ></component>
    <regular v-if="options.regular && options.regular.show && method === 'card'" :options="options.regular" :form="form.recurring_data"></regular>
    <offer v-if="options.offer" :form="form"></offer>
    <div class="f-block">
      <div class="f-block-sm">
        <button @click="onSubmit()" type="button" class="btn btn-success btn-block f-submit" :disabled="!valid">
          Оплатить {{full_amount}} {{form.currency}}
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

  export default {
    props: ['method', 'options', 'onSubmit', 'form', 'valid'],
    data () {
      return {}
    },
    computed: {
      full_amount: function () {
        return parseInt(this.form.amount) + parseInt(this.form.commision)
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
