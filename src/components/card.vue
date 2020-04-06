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
          :group="isCards"
          :readonly="readonly"
          type="tel"
          inputmode="numeric"
          @input="inputCardNumber"
        >
          <span
            v-if="!isCards"
            :class="[css.fcf, 'f-icon', 'f-i-card-empty']"
          />
          <template #group>
            <f-dropdown :class="[css.igb]">
              <button
                type="button"
                :class="[css.btn, css.bd, 'f-dropdown-toggle']"
                data-role="trigger"
              >
                <span class="f-caret" />
              </button>
              <template #dropdown>
                <li
                  v-for="card in cards"
                  :key="card.card_number"
                  :class="{ active: hasActive(card) }"
                >
                  <a role="button" @click="setCardNumber(card)">{{
                    card.card_number
                  }}</a>
                </li>
              </template>
            </f-dropdown>
          </template>
        </input-text>
        <div class="f-row">
          <div class="f-col-xs-7">
            <input-text
              ref="expiry_date"
              name="expiry_date"
              :validate="validExpiryDate"
              :mask="maskExpiryDate"
              :masked="true"
              :readonly="readonly"
              type="tel"
              inputmode="numeric"
              placement="top"
              @input="inputExpiryDate"
            />
          </div>
          <div class="f-col-xs-5">
            <input-text
              ref="cvv2"
              name="cvv2"
              :validate="validCvv"
              type="tel"
              inputmode="numeric"
              :mask="maskCvv"
              :readonly="need_verify_code"
              :maxlength="digitsCvv"
            >
              <span :class="[css.fcf, 'f-icon', 'f-i-question']" />
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
          v-if="email"
          name="checkout-email"
          field="email"
          label="email"
          validate="required|email"
          autocomplete="email"
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
        <f-customer-fields />
        <f-regular />
      </div>
    </div>
  </div>
</template>

<script>
//  ['#### ### ### ###', ' #### ###### #####', '#### #### #### ####', '  ######## ##########']
import { sendRequest } from '@/utils/helpers'
import { mapState } from '@/utils/store'
import FCustomerFields from '@/components/customer-fields'
import FRegular from '@/components/regular'

export default {
  inject: ['$validator'],
  components: {
    FCustomerFields,
    FRegular,
  },
  data() {
    return {
      maskExpiryDate: '##/##',
      maskCardNumber: 'XXXX XXXX XXXX XXXX XXX',
      maskCvv: '####',
    }
  },
  computed: {
    ...mapState([
      'css',
      'read_only',
      'need_verify_code',
      'verification_type',
      'cards',
    ]),
    ...mapState('options', ['email']),
    ...mapState('params', ['card_number', 'code', 'token']),
    readonly() {
      return this.read_only || this.need_verify_code
    },
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
          ccard: !/\d{6}X/.test(this.card_number),
        },
      }
    },
    validCvv() {
      return 'required|digits:' + this.digitsCvv
    },
    digitsCvv() {
      return this.card_number.match('^3(?:2|3|4|7)') ? 4 : 3
    },
    isCards() {
      return !!this.cards.length
    },
    validCode() {
      return {
        rules: {
          required: true,
          digits: /EURT/.test(this.code) ? false : '4',
        },
      }
    },
    validAmount() {
      return {
        rules: {
          required: true,
          numrange: [0, 9999999.99],
          regex: '^\\d{1,7}([,\\.]\\d{1,2})?$',
        },
      }
    },
    isVerificationAmount() {
      return this.need_verify_code && this.verification_type === 'amount'
    },
    isVerificationCode() {
      return this.need_verify_code && this.verification_type !== 'amount'
    },
  },
  watch: {
    card_number(newVal, oldVal) {
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
            token: this.token,
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
            token: this.token,
            card_bin: newBin,
          },
          { cached: true }
        )
      }
    },
  },
  methods: {
    hasActive(card) {
      return card.card_number.replace(/ /g, '') === this.card_number
    },
    setCardNumber(card) {
      this.store.setCardNumber(card)
      this.$nextTick(() => {
        this.$validator.validateAll()
      })
    },
    inputCardNumber(value) {
      if (value.length !== 16 && value.length !== 19) return
      this.focus('f-card_number', value, 'expiry_date')
    },
    inputExpiryDate(value) {
      this.focus('f-expiry_date', value, 'cvv2')
    },
    focus(name, value, next) {
      if (!this.fields[name]) return
      this.$validator.validate(name, value).then(valid => {
        if (!valid) return
        this.$refs[next].$refs.input.$el.focus()
      })
    },
  },
}
</script>
