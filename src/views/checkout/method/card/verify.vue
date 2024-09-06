<template>
  <div>
    <div class="f-card">
      <div class="f-card-shadow" />
      <f-card-bg />
      <f-card-brand :number="card_number" />
      <f-form-group
        :value="card_number"
        class="f-form-group-card f-form-group-card-number"
        name="card_number"
        placeholder="____ ____ ____ ____"
        mask="XXXX XXXX XXXX XXXX XXX"
        :disabled="true"
        no-label-floating
        dynamic-placeholder
      >
        <template #label="{ label }">
          <label class="f-card_label">
            {{ label }} <f-svg name="lock-alt" size="lg" />
          </label>
        </template>
      </f-form-group>

      <f-form-group
        :value="expiry_date"
        class="f-form-group-card"
        label-class="f-card_label"
        input-class="f-form-control-expiry-date"
        name="expiry_date"
        placeholder="__/__"
        mask="##/##"
        :disabled="true"
        no-label-floating
        dynamic-placeholder
      />
      <f-form-group
        :value="cvv2"
        class="f-form-group-card"
        label-class="f-card_label"
        input-class="f-form-control-cvv2"
        name="cvv2"
        placeholder="___"
        mask="####"
        :disabled="true"
        no-label-floating
        dynamic-placeholder
      />
    </div>
    <f-field-email />
    <f-form-group
      v-if="isCode"
      v-model="code"
      name="verification_code"
      :rules="validCode"
      type="tel"
      :maxlength="4"
    />
    <f-form-group
      v-if="isAmount"
      v-model="code"
      name="verification_amount"
      :rules="validAmount"
      type="text"
    />
    <f-subscription-wrapper />
    <f-offer />
    <f-button-pay :no-amount="isAmount" />
  </div>
</template>

<script>
import FCardBg from '@/components/card-bg'
import FCardBrand from '@/components/card-brand'
import FSvg from '@/components/svg'
import FFieldEmail from '@/components/fields/email'
import FSubscriptionWrapper from '@/components/subscription-wrapper'
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  components: {
    FCardBg,
    FCardBrand,
    FSvg,
    FFieldEmail,
    FSubscriptionWrapper,
    FOffer,
    FButtonPay,
  },
  computed: {
    ...mapState(['order']),
    ...mapStateGetSet('params', [
      'card_number',
      'expiry_date',
      'cvv2',
      'code',
      'verification_type',
    ]),
    validCode() {
      return /EURT/.test(this.code) ? 'required' : 'required|digits:4'
    },
    validAmount() {
      return {
        required: true,
        numrange: [0, 9999999.99],
        regex: '^\\d{1,7}([,.]\\d{1,2})?$',
      }
    },
    isCode() {
      return this.verification_type !== 'amount'
    },
    isAmount() {
      return this.verification_type === 'amount'
    },
  },
  created() {
    this.card_number = this.order.order_data.masked_card
    this.expiry_date = this.order.order_data.expiry_date || ''
    this.cvv2 = ''
  },
}
</script>
