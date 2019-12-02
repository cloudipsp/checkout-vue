<template>
  <div class="f-card">
    <div class="f-block">
      <div class="f-block-sm">
        <input-text
          name="card_number"
          :validate="validCardNumber"
          :mask="maskCardNumber"
          :masked="false"
          :maxlength="23"
          :group="!!cardsLen"
          :readonly="store.state.read_only || store.state.need_verify_code"
          type="tel"
          inputmode="numeric"
          placeholder="card_number_p"
        >
          <span
            v-if="!cardsLen"
            :class="[$css.fcf, 'f-icon', 'f-i-card-empty']"
          />
          <f-dropdown slot="group" :class="[$css.igb]">
            <button
              type="button"
              :class="[$css.btn, $css.bd, 'f-dropdown-toggle']"
              data-role="trigger"
            >
              <span class="f-caret" />
            </button>
            <template slot="dropdown">
              <li
                v-for="card in store.state.cards"
                :key="card.card_number"
                :class="{ active: hasActive(card) }"
              >
                <a role="button" @click="setCardNumber(card)">{{
                  card.card_number
                }}</a>
              </li>
            </template>
          </f-dropdown>
        </input-text>
        <div class="f-row">
          <div class="f-col-xs-7">
            <input-text
              name="expiry_date"
              :validate="validExpiryDate"
              :mask="maskExpiryDate"
              :masked="true"
              :readonly="store.state.read_only || store.state.need_verify_code"
              type="tel"
              inputmode="numeric"
              placeholder="expiry_date_p"
              placement="top"
            />
          </div>
          <div class="f-col-xs-5">
            <input-text
              name="cvv2"
              :validate="validCvv"
              type="tel"
              inputmode="numeric"
              :mask="maskCvv"
              :readonly="store.state.need_verify_code"
              :maxlength="digitsCvv"
              placeholder="cvv2_p"
            >
              <span :class="[$css.fcf, 'f-icon', 'f-i-question']" />
              <f-tooltip
                :text="$t('cvv2_question', [digitsCvv])"
                trigger="hover"
                theme="default"
                target=".f-i-question"
              />
            </input-text>
          </div>
        </div>
        <input-text
          v-if="options.email"
          name="checkout-email"
          field="email"
          label="email"
          validate="required|email"
          placeholder="email_p"
        />
        <input-text
          v-if="isVerificationCode"
          name="code"
          :validate="validCode"
          type="tel"
          :maxlength="4"
          label="verification_code"
          placeholder="verification_code_p"
        />
        <input-text
          v-if="isVerificationAmount"
          name="code"
          :validate="validAmount"
          type="text"
          label="verification_amount"
          placeholder="verification_amount_p"
        />
        <customer-fields v-if="options.customer_fields.length" />
      </div>
    </div>
  </div>
</template>

<script>
//  ['#### ### ### ###', ' #### ###### #####', '#### #### #### ####', '  ######## ##########']
import { sendRequest } from '@/utils/helpers'
import CustomerFields from '@/components/customer-fields'

export default {
  inject: ['$validator'],
  components: {
    CustomerFields,
  },
  data() {
    return {
      maskExpiryDate: '##/##',
      maskCardNumber: 'XXXX XXXX XXXX XXXX XXX',
      maskCvv: '####',
    }
  },
  computed: {
    validExpiryDate() {
      let minDate
      if (this.store.state.validate_expdate) {
        let date = new Date()
        let year = String(date.getFullYear()).slice(-2)
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        minDate = `${month}/${year}`
      } else {
        minDate = '01/19'
      }

      return `required|date_format:MM/yy|after:${minDate},true`
    },
    validCardNumber() {
      return {
        rules: {
          required: true,
          ccard: !/\d{6}X/.test(this.params.card_number),
        },
      }
    },
    validCvv() {
      return 'required|digits:' + this.digitsCvv
    },
    digitsCvv() {
      return this.params.card_number.match('^3(?:2|3|4|7)') ? 4 : 3
    },
    cardsLen() {
      return this.store.state.cards.length
    },
    validCode() {
      return {
        rules: {
          required: true,
          digits: /EURT/.test(this.params.code) ? false : '4',
        },
      }
    },
    validAmount() {
      return {
        rules: {
          required: true,
          numrange: [0, 9999999.99],
          regex: /^\d{1,7}([,\.]\d{1,2})?$/,
        },
      }
    },
    isVerificationAmount() {
      return (
        this.store.state.need_verify_code &&
        this.store.state.verification_type === 'amount'
      )
    },
    isVerificationCode() {
      return (
        this.store.state.need_verify_code &&
        this.store.state.verification_type !== 'amount'
      )
    },
  },
  watch: {
    'params.card_number': function(newVal, oldVal) {
      newVal = newVal.replace(/ /g, '')
      oldVal = oldVal.replace(/ /g, '')
      let newFirst = newVal && newVal[0]
      let oldFirst = oldVal && oldVal[0]
      let newBin = newVal && newVal.slice(0, 6)
      let oldBin = oldVal && oldVal.slice(0, 6)
      if (newFirst && newFirst !== oldFirst) {
        sendRequest(
          'api.checkout.card_type_fee',
          'get',
          {
            token: this.params.token,
            first_card_digit: newFirst,
          },
          { cached: true }
        )
      }
      if (newBin.length === 6 && newBin !== oldBin) {
        sendRequest(
          'api.checkout.card_bin',
          'get',
          {
            token: this.params.token,
            card_bin: newBin,
          },
          { cached: true }
        )
      }
    },
  },
  methods: {
    hasActive(card) {
      return card.card_number.replace(/ /g, '') === this.params.card_number
    },
    setCardNumber(card) {
      this.store.setCardNumber(card)
      this.$nextTick(() => {
        this.$validator.validateAll()
      })
    },
  },
}
</script>
