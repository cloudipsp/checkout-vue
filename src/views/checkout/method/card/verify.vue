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
        placeholder="card_number_p"
        mask="XXXX XXXX XXXX XXXX XXX"
        :disabled="true"
        label-class
      >
        <template #label="{ classLabel, label }">
          <label :class="classLabel">
            {{ label }} <f-svg name="lock-alt" size="lg" />
          </label>
        </template>
      </f-form-group>

      <f-form-group
        :value="expiry_date"
        class="f-form-group-card"
        name="expiry_date"
        placeholder="expiry_date_p"
        mask="##/##"
        :disabled="true"
        label-class
      />
      <f-form-group
        :value="cvv2"
        class="f-form-group-card"
        name="cvv2"
        placeholder="cvv2_p"
        mask="####"
        :disabled="true"
        label-class
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
    <f-button-pay :no-amount="type === 'amount'" />
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
    ...mapStateGetSet('options', ['title']),
    ...mapStateGetSet('params', [
      'card_number',
      'expiry_date',
      'cvv2',
      'order_desc',
      'code',
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
    type() {
      return this.order.verification_type
    },
    isCode() {
      return this.type !== 'amount'
    },
    isAmount() {
      return this.type === 'amount'
    },
  },
  created() {
    this.title = 'verification_t'
    this.order_desc = 'verification_' + this.type + '_d'
    this.card_number = this.order.order_data.masked_card
    this.expiry_date = this.order.order_data.expiry_date || ''
    this.cvv2 = ''
  },
}
</script>
