<template>
  <div>
    <div class="f-card">
      <input-text
        class="f-form-group-card f-form-group-card-number"
        name="card_number"
        :validate="validCardNumber"
        :mask="maskCardNumber"
        :masked="false"
        :maxlength="23"
        :readonly="readonly"
        type="tel"
        inputmode="numeric"
        tooltip
        @input="inputCardNumber"
      >
        <template v-if="need_verify_code" #label="{ classLabel, label_ }">
          <label :class="classLabel">
            {{ label_ }} <f-svg name="lock" size="lg" />
          </label>
        </template>
        <template v-else-if="isCards" #label="{ classLabel, label_ }">
          <template v-if="isMobile">
            <a
              href="#"
              :class="[classLabel, 'f-control-label-card-list']"
              @click.prevent="showModalCard = true"
            >
              {{ label_ }} <f-svg name="angle-down" size="lg" />
            </a>
          </template>
          <template v-else>
            <a
              ref="tooltip"
              href="#"
              :class="[classLabel, 'f-control-label-card-list']"
              tabindex="-1"
              @click.prevent="showTooltipCard = true"
              @blur="showTooltipCard = false"
            >
              {{ label_ }}
              <f-svg ref="label" name="angle-down" size="lg" tabindex="0" />
            </a>
            <f-tooltip-card
              :show.sync="showTooltipCard"
              :target="() => $refs.label && $refs.label.$el"
              under-sticky
            >
              <a
                v-for="item in cards"
                :key="item.card_number"
                href="#"
                :class="['f-card-list-item', { active: hasActive(item) }]"
                @click.prevent="setCardNumber(item)"
              >
                <div class="f-card-list-number">{{ item.card_number }}</div>
                <div class="f-card-list-expiry-date">
                  <span v-t="'expires_on'" /> {{ item.expiry_date }}
                </div>
              </a>
            </f-tooltip-card>
          </template>
        </template>
      </input-text>
      <input-text
        ref="expiry_date"
        class="f-form-group-card"
        name="expiry_date"
        :validate="validExpiryDate"
        :mask="maskExpiryDate"
        :masked="true"
        :readonly="readonly"
        type="tel"
        inputmode="numeric"
        tooltip
        @input="inputExpiryDate"
      />
      <input-text
        ref="cvv2"
        class="f-form-group-card"
        name="cvv2"
        :validate="validCvv"
        type="tel"
        inputmode="numeric"
        :mask="maskCvv"
        :readonly="need_verify_code"
        :maxlength="digitsCvv"
        tooltip
      >
        <template v-if="isCards" #label="{ classLabel, name_, label_ }">
          <label :class="classLabel" :for="name_">
            <span ref="label_cvv">{{ label_ }}</span>
          </label>

          <f-tooltip-default
            placement="top"
            :target="() => $refs.label_cvv"
            under-sticky
          >
            <span v-t="{ path: 'cvv2_question', args: [digitsCvv] }" />
          </f-tooltip-default>
        </template>
      </input-text>
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
    />
    <input-text
      v-if="isVerificationAmount"
      name="code"
      :validate="validAmount"
      type="text"
      label="verification_amount"
    />
    <f-customer-fields />
    <f-fields />
    <f-regular />
    <f-offer />
    <f-button-pay />
    <f-modal-base
      v-model="showModalCard"
      header-class="f-modal-header-card-list"
      body-class="f-modal-body-card-list"
    >
      <a
        v-for="item in cards"
        :key="item.card_number"
        href="#"
        :class="['f-card-list-item', { active: hasActive(item) }]"
        @click.prevent="setCardNumber(item)"
      >
        <div class="f-card-list-number">{{ item.card_number }}</div>
        <div class="f-card-list-expiry-date">
          <span v-t="'expires_on'" /> {{ item.expiry_date }}
        </div>
      </a>
    </f-modal-base>
  </div>
</template>

<script>
//  ['#### ### ### ###', ' #### ###### #####', '#### #### #### ####', '  ######## ##########']
import { sendRequest } from '@/utils/helpers'
import { mapState } from '@/utils/store'
import FRegular from '@/components/regular'
import Resize from '@/mixins/resize'
import timeout from '@/mixins/timeout'

export default {
  inject: ['$validator'],
  components: {
    FRegular,
  },
  mixins: [Resize, timeout],
  data() {
    return {
      maskExpiryDate: '##/##',
      maskCardNumber: 'XXXX XXXX XXXX XXXX XXX',
      maskCvv: '####',
      showModalCard: false,
      showTooltipCard: false,
      wrapper: null,
      activeElement: null,
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
    ...mapState('router', ['method']),
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
    card_number(value) {
      if (!value) return

      value = value.replace(/ /g, '').slice(0, 6)
      let card_bin = value.length === 6 ? value : value[0]

      sendRequest(
        'api.checkout.card_type_fee',
        'get',
        {
          token: this.token,
          card_bin,
        },
        { cached: true }
      )
        .then(this.cardTypeFeeSuccess)
        .catch(e => {
          if (e instanceof Error) console.log(e)
        })
    },
  },
  mounted() {
    this.wrapper = this.$parent.$parent
    this.wrapper.$on('scroll', this.scroll)
  },
  destroyed() {
    this.wrapper.$off('scroll', this.scroll)
  },
  methods: {
    cardTypeFeeSuccess() {},
    hasActive(card) {
      return card.card_number.replace(/ /g, '') === this.card_number
    },
    setCardNumber(card) {
      this.showModalCard = false
      this.showTooltipCard = false
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
      this.$validator
        .validate(name, value)
        .then(valid => {
          if (!valid) return Promise.reject()
          return this.$nextTick()
        })
        .then(() => {
          this.$refs[next].$refs.input.$el.focus()
        })
        .catch(e => {
          if (e instanceof Error) console.log(e)
        })
    },
    scroll() {
      if (!this.activeElement) {
        this.activeElement = document.activeElement

        this.activeElement.blur()
      }

      this.timeout('focusActiveElement', 200)
    },
    focusActiveElement() {
      if (this.activeElement.tagName !== 'INPUT')
        return (this.activeElement = null)

      let rectWrapper = this.wrapper.$el.getBoundingClientRect()
      let rectActiveElement = this.activeElement.getBoundingClientRect()

      if (rectActiveElement.top < rectWrapper.top)
        return (this.activeElement = null)
      if (rectActiveElement.bottom > rectWrapper.bottom)
        return (this.activeElement = null)

      this.activeElement.focus()
      this.activeElement = null
    },
  },
}
</script>
