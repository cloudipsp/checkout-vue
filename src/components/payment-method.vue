<template>
  <div>
    <fields v-if="options.fields"></fields>
    <transition name="fade">
    <component
      :is="method"
      :key="method"
      :icons="options[method + 'Icons']"
      :payment-systems="options[method]"
    ></component>
    </transition>
    <regular v-if="regular.insert && method === 'card'"></regular>
    <offer v-if="options.offer"></offer>
    <div class="f-block" v-if="options.button">
      <div class="f-block-sm">
        <button @click="onSubmit()" type="button" :class="[$css.btn, $css.bs, $css.btnLg, 'f-btn-block', $css.submit]" :disabled="disabled">
          <span v-t="{path: 'pay', args: args}"></span>
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
  import Fields from '@/components/payment-fields'

  export default {
    props: ['onSubmit', 'disabled'],
    data () {
      return {
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
      },
      args: function () {
        return this.fullAmount ? [this.fullAmount, this.$t(this.form.currency)] : []
      },
      method: function () {
        return this.router.method
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
