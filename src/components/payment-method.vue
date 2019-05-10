<template>
  <div>
    <fields v-if="options.fields && !store.state.need_verify_code" />
    <transition name="fade">
      <component
        :is="method"
        :key="method"
        :icons="options[method + '_icons']"
        :payment-systems="options[method]"
      />
    </transition>
    <regular v-if="regular.insert && method === 'card'" />
    <offer v-if="options.offerta_url" />
    <div class="f-block">
      <div class="f-block-sm">
        <button
          v-if="options.button"
          type="button"
          :class="[$css.btn, $css.bs, $css.btnLg, 'f-btn-block', $css.submit]"
          :disabled="disabled"
          @click="onSubmit()"
        >
          <span v-t="{ path: 'pay', args: args }" />
        </button>
        <div v-if="options.cancel" class="f-text-center">
          <a
            v-t="'cancel'"
            :class="[$css.btn, 'f-btn-link']"
            href=""
            @click.prevent="onCancel()"
          />
        </div>
        <div class="f-hidden-desktop">
          <i class="f-icon f-icon-block f-i-security" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/card'
import Emoney from '@/components/emoney'
import Ibank from '@/components/ibank'
import Trustly from '@/components/trustly'
import Cash from '@/components/cash'
import Sepa from '@/components/sepa'
import Regular from '@/components/regular'
import Offer from '@/components/offer'
import Fields from '@/components/payment-fields'

export default {
  components: {
    Card,
    Emoney,
    Ibank,
    Trustly,
    Cash,
    Sepa,
    Regular,
    Offer,
    Fields,
  },
  props: {
    disabled: {
      type: Boolean,
    },
  },
  data() {
    return {}
  },
  computed: {
    fullAmount: function() {
      let amount = parseInt(this.params.amount)
      let amountWithFee = parseInt(this.params.amount_with_fee)
      if (!amount) {
        return false
      }
      return (amountWithFee || amount) / 100
    },
    args: function() {
      return this.fullAmount
        ? [this.fullAmount, this.$t(this.params.currency)]
        : []
    },
    method: function() {
      return this.router.method
    },
  },
  methods: {
    onSubmit: function() {
      this.$emit('on-submit')
    },
    onCancel: function() {
      this.$emit('on-cancel')
    },
  },
}
</script>
