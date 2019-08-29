<template>
  <div
    v-if="show"
    class="f-wallet-pay-button"
    :class="{ 'f-block-hr': isTop, 'f-block': isTop || isMenu }"
  >
    <slot :open="open">
      <div :class="{ 'f-block-sm': !isMenu && isTop }">
        <button
          :class="[$css.btn, 'f-btn-' + theme]"
          :style="style"
          class="f-btn-block"
          @click="open"
        >
          <span v-if="text" v-t="icon"></span>
          <f-svg style="vertical-align: middle;" :name="icon" size="2x"></f-svg>
        </button>
      </div>
    </slot>
  </div>
</template>

<script>
import { sendRequest } from '@/utils/helpers'

export default {
  props: {
    position: {
      type: String,
      default: '',
    },
    tab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      icon: '',
      canMakePayment: false,
    }
  },
  computed: {
    canRequest() {
      return (
        this.position === this.options.wallet_pay_button[this.tab].position &&
        this.options.wallet_pay_button[this.tab].display
      )
    },
    show() {
      return this.canMakePayment && this.canRequest
    },
    isTop() {
      return this.position === 'top'
    },
    isBottom() {
      return this.position === 'bottom'
    },
    isMenu() {
      return this.tab === 'menu'
    },
    theme() {
      return this.options.wallet_pay_button[this.tab].theme
    },
    style() {
      return !this.isMenu && this.isBottom
        ? {
            marginTop: '20px',
          }
        : {}
    },
    text() {
      return this.options.wallet_pay_button[this.tab].text
    },
  },
  created() {
    if (!this.canRequest) return

    Promise.all([
      sendRequest('api.checkout.kkh', 'get'),
      sendRequest('api.checkout.pay', 'get', this.params),
    ]).then(([kkh, model]) => {
      this.config = model.data
      this.initRequest()
      if (!this.request) return
      this.initIcon(kkh)
      this.initCanMakePayment()
    })
  },
  methods: {
    initIcon(browser) {
      const os = browser.data.platform_os // ios android linux
      const type = browser.data.platform_type // desktop mobile
      const name = browser.data.platform_name // chrome safari
      const map = {
        safari: 'apple',
        chrome: 'google',
        ios: 'apple',
        android: 'google',
      }
      this.icon = (map[type === 'desktop' ? name : os] || 'google') + '_pay'
    },
    initRequest() {
      try {
        this.request = new PaymentRequest(
          this.config.methods,
          this.config.details,
          this.config.options
        )
        // TODO нада off ети подписки?
        this.request.addEventListener(
          'merchantvalidation',
          this.merchantValidation
        )
        this.request.addEventListener(
          'paymentmethodchange',
          this.paymentMethodChange
        )
        this.request.addEventListener(
          'shippingaddresschange',
          this.shippingAddressChange
        )
        this.request.addEventListener(
          'shippingoptionchange',
          this.shippingOptionChange
        )
      } catch (e) {}
    },
    initCanMakePayment() {
      this.request
        .canMakePayment()
        .then(result => {
          console.log('can.makePayment', result)

          this.canMakePayment = true
        })
        .catch(() => {
          console.log('can.makePayment', 'catch error', arguments)
        })
    },
    open() {
      this.request
        .show()
        .then(this.callback)
        .then(this.success)
        .then(this.close)
        .catch(this.close)
    },
    callback(response) {
      this.response = response
      return this.response.complete('success')
    },
    success() {
      return sendRequest('api.checkout.form', 'request', {
        payment_system: this.config.payment_system,
        data: this.response.details,
        transaction_id: this.transaction_id,
      })
    },
    close(...args) {
      console.log(args[0].message)
      this.initRequest()
    },
    shippingOptionChange(event) {
      var request = event.target
      console.log('fire event', event.type)
      console.log('shippingOptions', request.shippingOption)
      console.log(this.config.details)
      console.log(event)
      var option = this.config.details.shippingOptions.find(option => {
        if (option.id === request.shippingOption) {
          return option
        }
      })
      this.config.details.displayItems.push(option)
      console.log(option)
      event.updateWith(this.config.details)
    },
    merchantValidation(event) {
      console.log(event.type)
      console.log('validation url', event.validationURL)
      this.appleSession(event.validationURL).then(session => {
        this.transaction_id = session.transaction_id || null
        console.log('session options', session.data || session)
        event.complete(session.data || session)
      })
    },
    appleSession(url) {
      return sendRequest('api.checkout.pay', 'session', {
        payment_system: this.config.payment_system,
        url,
        merchant_id: '',
        domain: '',
      })
    },
    paymentMethodChange(event) {
      console.log('fire event', event.type)
      event.updateWith(this.config.details)
    },
    shippingAddressChange(event) {
      console.log('fire event', event.type, event.target)
      event.updateWith(this.config.details)
    },
  },
}
</script>
