<template>
  <div>
    <div class="f-card">
      <div class="f-card-shadow" />
      <f-card-bg />
      <f-card-brand :number="card_number" />
      <f-form-group
        ref="card_number"
        v-model="card_number"
        class="f-form-group-card f-form-group-card-number"
        name="card_number"
        placeholder="card_number_p"
        :rules="validCardNumber"
        mask="XXXX XXXX XXXX XXXX XXX"
        :masked="false"
        :maxlength="23"
        :disabled="read_only"
        type="tel"
        inputmode="numeric"
        tooltip
        label-class
        autocomplete="cc-number"
        @input="inputCardNumber"
      >
        <template v-if="isCards" #label="{ classLabel, label }">
          <f-card-list-wrapper :class-label="classLabel" :label="label" />
        </template>
      </f-form-group>

      <f-form-group
        ref="expiry_date"
        v-model="expiry_date"
        class="f-form-group-card"
        name="expiry_date"
        placeholder="expiry_date_p"
        :rules="read_only ? '' : validExpiryDate"
        mask="##/##"
        :masked="true"
        :disabled="read_only"
        type="tel"
        inputmode="numeric"
        tooltip
        label-class
        autocomplete="cc-exp"
        :format="format"
        @input="inputExpiryDate"
      />
      <f-form-group
        ref="cvv2"
        v-model="cvv2"
        class="f-form-group-card"
        name="cvv2"
        placeholder="cvv2_p"
        :rules="validCvv"
        type="tel"
        inputmode="numeric"
        mask="####"
        :maxlength="digitsCvv"
        tooltip
        label-class
        autocomplete="cc-csc"
      >
        <template #label="{ classLabel, id, label }">
          <label :class="classLabel" :for="id">
            <span ref="label_cvv">{{ label }}</span>
          </label>

          <f-tooltip-default
            custom-class="f-tooltip-cvv"
            placement="top"
            :target="() => $refs.label_cvv"
            variant="secondary"
            under-sticky
          >
            <f-svg name="info-circle" size="md" />
            <span v-text="$t('cvv2_help', [digitsCvv])" />
          </f-tooltip-default>
        </template>
      </f-form-group>
    </div>
    <f-field-email />
    <f-fields-customer />
    <f-fields-button />
    <f-fields-user />
    <f-subscription-wrapper />
    <f-offer />
    <f-button-pay />
  </div>
</template>

<script>
import FCardBg from '@/components/card-bg'
import FCardBrand from '@/components/card-brand'
import { FCardListWrapper } from '@/import'
import FSvg from '@/components/svg'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import FFieldEmail from '@/components/fields/email'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsButton from '@/components/fields/button'
import FFieldsUser from '@/components/fields/user'
import FSubscriptionWrapper from '@/components/subscription-wrapper'
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import { isMountedMixin } from '@/mixins/is-mounted'
import { errorHandler } from '@/utils/helpers'
import { mapState, mapStateGetSet } from '@/utils/store'
import { createDate, formatMMYY } from '@/utils/date'

export default {
  components: {
    FCardBg,
    FCardBrand,
    FCardListWrapper,
    FSvg,
    FTooltipDefault,
    FFieldEmail,
    FFieldsCustomer,
    FFieldsButton,
    FFieldsUser,
    FSubscriptionWrapper,
    FOffer,
    FButtonPay,
  },
  mixins: [isMountedMixin],
  computed: {
    ...mapState(['read_only', 'cards', 'submited']),
    ...mapState('params', ['token']),
    ...mapStateGetSet('params', [
      'cvv2',
      'expiry_date',
      'card_number',
      'code',
      'hash',
    ]),
    validExpiryDate() {
      let minDate = this.store.state.validate_expdate
        ? formatMMYY(createDate())
        : '01/19'

      return `required|date_format:MM/yy|after:${minDate},true,MM/yy`
    },
    validCardNumber() {
      let needValidCard =
        !this.hash &&
        (this.card_number.length === 16 ||
          this.card_number.length === 19 ||
          this.submited)

      return needValidCard ? 'required|ccard' : 'required'
    },
    validCvv() {
      return 'required|digits:' + this.digitsCvv
    },
    digitsCvv() {
      return this.card_number.match('^3(?:2|3|4|7)') ? 4 : 3
    },
    isCards() {
      return this.cards.length
    },
  },
  watch: {
    card_number(value) {
      if (!value) return

      value = value.slice(0, 6)
      let card_bin = value.length === 6 ? value : value[0]

      this.store
        .sendRequest(
          'api.checkout.card_type_fee',
          'get',
          {
            token: this.token,
            card_bin,
          },
          { cached: true }
        )
        .then(this.cardTypeFeeSuccess)
        .catch(errorHandler)
    },
  },
  methods: {
    cardTypeFeeSuccess() {},
    inputCardNumber(value) {
      if (value.length === 16 || value.length === 19) {
        this.focus('card_number', value, 'expiry_date')
      } else {
        this.hash = ''
      }
    },
    inputExpiryDate(value) {
      this.focus('expiry_date', value, 'cvv2')
    },
    focus(name, value, next) {
      if (!this.isMounted) return
      // wait for computed property validCardNumber
      this.$nextTick()
        .then(() =>
          this.$refs[name].$children[0].$children[0].$refs.validation.validate()
        )
        .then(({ valid }) => {
          if (!valid) return Promise.reject()
          return this.$nextTick()
        })
        .then(() => {
          this.$refs[next].$children[0].$children[0].$refs.input.$el.focus()
        })
        .catch(errorHandler)
    },
    format(value) {
      let [month, year] = value.split('/')

      if (year && year.length === 4) {
        year = year.slice(-2)
        value = `${month}/${year}`
      }

      return value
    },
  },
}
</script>
