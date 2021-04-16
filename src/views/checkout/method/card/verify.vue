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
    <f-preloader :condition="showEmail" class="f-mb-3">
      <f-form-group
        v-model.trim="email"
        input-class="f-checkout-email"
        name="email"
        rules="required|email"
        autocomplete="email"
      />
    </f-preloader>
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
    <f-button-pay />
  </div>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'
import FSubscriptionWrapper from '@/components/subscription-wrapper'
import FCardBg from '@/components/card-bg'
import FCardBrand from '@/components/card-brand'

export default {
  components: {
    FSubscriptionWrapper,
    FCardBg,
    FCardBrand,
  },
  computed: {
    ...mapState(['verification_type']),
    ...mapState('options', {
      showEmail: 'email',
    }),
    ...mapState('params', ['cvv2', 'expiry_date', 'card_number']),
    ...mapStateGetSet('params', ['email', 'code']),
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
}
</script>
