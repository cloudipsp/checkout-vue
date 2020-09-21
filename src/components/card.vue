<template>
  <div>
    <template v-if="isBreakpointMd && isOnlyCard">
      <f-info />
      <f-button-pay-wallet position="center" />
      <f-icons
        class="f-mb-3"
        title="or_pay_with_card"
        :type="method"
        :count="5"
        under-sticky
        position="center"
      />
    </template>
    <template v-if="isBreakpointMd && !isOnlyCard">
      <f-price />
    </template>
    <div class="f-card">
      <div class="f-card-shadow" />
      <div :class="classCardBg" />
      <div class="f-card-brand">
        <transition name="fade">
          <f-icon
            v-if="cardBrand"
            type="card_system/max"
            :name="cardBrand"
            class="f-card-brand-icon"
          />
        </transition>
      </div>
      <input-text
        ref="card_number"
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
        label-class
        @input="inputCardNumber"
      >
        <template v-if="need_verify_code" #label="{ classLabel, label_ }">
          <label :class="classLabel">
            {{ label_ }} <f-svg name="lock-alt" size="lg" />
          </label>
        </template>
        <template v-else-if="isCards" #label="{ classLabel, label_ }">
          <template v-if="isPhone">
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
              @blur="blurTooltipCard"
            >
              {{ label_ }}
              <f-svg ref="label" name="angle-down" size="lg" tabindex="0" />
            </a>
            <f-tooltip-card
              :show.sync="showTooltipCard"
              :target="() => $refs.label && $refs.label.$el"
              under-sticky
            >
              <f-card-list @input="setCardNumber" @add="addCardNumber" />
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
        label-class
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
        label-class
      >
        <template #label="{ classLabel, name_, label_ }">
          <label :class="classLabel" :for="name_">
            <span ref="label_cvv">{{ label_ }}</span>
          </label>

          <f-tooltip-default
            custom-class="f-tooltip-cvv"
            placement="top"
            :target="() => $refs.label_cvv"
            variant="light"
            under-sticky
          >
            <f-svg name="info-circle" />
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
      content-class="f-modal-content-card-list"
      header-class="f-p-0"
      body-class="f-modal-body-card-list"
      :return-focus="returnFocus"
    >
      <f-card-list @input="setCardNumber" @add="addCardNumber" />
    </f-modal-base>
  </div>
</template>

<script>
//  ['#### ### ### ###', ' #### ###### #####', '#### #### #### ####', '  ######## ##########']
import { sendRequest, errorHandler } from '@/utils/helpers'
import { mapState } from '@/utils/store'
import FRegular from '@/components/regular'
import FCardList from '@/components/card-list'
import mobile from '@/mixins/mobile'
import getCardBrand from '@/utils/card-brand'
import FIcons from '@/components/icons'
import FPrice from '@/components/price'

export default {
  inject: ['$validator'],
  components: {
    FRegular,
    FCardList,
    FIcons,
    FPrice,
  },
  mixins: [mobile],
  data() {
    return {
      maskExpiryDate: '##/##',
      maskCardNumber: 'XXXX XXXX XXXX XXXX XXX',
      maskCvv: '####',
      showModalCard: false,
      showTooltipCard: false,
      wrapper: null,
      returnFocus: null,
      cardBrand: '',
    }
  },
  computed: {
    ...mapState([
      'css',
      'read_only',
      'need_verify_code',
      'verification_type',
      'cards',
      'css_variable',
      'submited',
      'isOnlyCard',
    ]),
    ...mapState('router', ['method']),
    ...mapState('options', ['email']),
    ...mapState('params', ['card_number', 'code', 'token']),
    ...mapState('css_variable', ['card_bg_lighten']),
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
          ccard:
            !/\d{6}X/.test(this.card_number) &&
            (this.card_number.length === 16 ||
              this.card_number.length === 19 ||
              this.submited),
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
    classCardBg() {
      return [
        'f-card-bg',
        {
          'f-card-img':
            this.css_variable.card_img &&
            !this.css_variable.card_gradient_custom,
          'f-card-gradient-custom':
            this.css_variable.card_gradient_custom &&
            !this.css_variable.card_img,
          'f-card-bg-lighten': this.card_bg_lighten,
        },
      ]
    },
  },
  watch: {
    card_number(value) {
      this.cardBrand = getCardBrand(value)
      if (!value) return

      value = value.slice(0, 6)
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
        .catch(errorHandler)
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
    setCardNumber() {
      this.returnFocus = this.$refs.cvv2.$refs.input.$el
      this.hide()
    },
    addCardNumber() {
      this.returnFocus = this.$refs.card_number.$refs.input.$el
      this.hide()
    },
    hide() {
      this.showModalCard = false
      this.showTooltipCard = false
      // for focus after hiding the tooltip
      setTimeout(() => {
        this.returnFocus.focus()
      }, 100)
    },
    blurTooltipCard() {
      // TODO to volunteer the event setCardNumber addCardNumber
      setTimeout(() => {
        this.showTooltipCard = false
      }, 100)
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
      // wait for computed property validCardNumber
      this.$nextTick()
        .then(() => {
          return this.$validator.validate(name, value)
        })
        .then(valid => {
          if (!valid) return Promise.reject()
          return this.$nextTick()
        })
        .then(() => {
          this.$refs[next].$refs.input.$el.focus()
        })
        .catch(errorHandler)
    },
    scroll() {
      let activeElement = document.activeElement

      if (activeElement.tagName !== 'INPUT') return

      activeElement.blur()

      if (this.isDesktop) {
        let rectWrapper = this.wrapper.$el.getBoundingClientRect()
        let rectActiveElement = activeElement.getBoundingClientRect()

        if (rectActiveElement.top < rectWrapper.top) return
        if (rectActiveElement.bottom > rectWrapper.bottom) return
      }

      activeElement.focus()
    },
  },
}
</script>
