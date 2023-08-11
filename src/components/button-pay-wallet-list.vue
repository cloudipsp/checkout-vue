<template>
  <transition name="f-fade-enter">
    <div v-if="show">
      <f-button-pay-wallet-inner
        v-for="(item, index) in list"
        :key="item"
        :method="item"
        :index="index"
        :load.sync="load"
        @click="click"
      />
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'
import FButtonPayWalletInner from '@/components/button-pay-wallet-inner'
import { mapState, mapStateGetSet } from '@/utils/store'
import { api } from '@/api'
import { captureMessage } from '@/sentry'
import { listenOnRootMixin } from '@/mixins/listen-on-root'
import { loadCheckout } from '@/import'

export default Vue.extend({
  components: {
    FButtonPayWalletInner,
  },
  mixins: [listenOnRootMixin],
  inject: ['formRequest'],
  data() {
    return {
      paymentRequest: null,
      supported: [],
      allowed: [],
      load: false,
    }
  },
  computed: {
    ...mapStateGetSet(['can_make_payment']),
    ...mapState(['pay', 'ready']),
    ...mapState('params', [
      'amount',
      'currency',
      'merchant_id',
      'promocode',
      'token',
    ]),
    show() {
      return this.list.length
    },
    list() {
      return ['apple', 'google'].filter(
        item => this.supported.includes(item) && this.allowed.includes(item)
      )
    },
  },
  watch: {
    amount: 'updateWithoutToken',
    currency: 'updateWithoutToken',
    promocode: 'update',
    ready: 'watchReady',
  },
  created() {
    loadCheckout().then($checkout => {
      this.listenOnRoot('click-wallet', this.click)
      this.paymentRequest = $checkout.get('PaymentRequestApi')
      this.events('on')
      this.paymentRequest.setApi(api)
      this.paymentRequest.getSupportedMethods()

      if (this.ready) {
        this.setPayload()
      }
    })
  },
  destroyed() {
    this.events('off')
  },
  methods: {
    events(type) {
      this.paymentRequest[type]('details', this.onDetails)
      this.paymentRequest[type]('supported', this.onSupported)
      this.paymentRequest[type]('payload', this.onPayload)
      this.paymentRequest[type]('error', this.onError)
    },
    watchReady() {
      this.setPayload()
    },
    setPayload() {
      this.paymentRequest.setMerchant(this.merchant_id)
      this.paymentRequest.setPayload(this.pay)
    },
    onSupported({ provider }) {
      this.supported = provider
    },
    onPayload({ allowed = [] }) {
      this.allowed = allowed

      if (this.list.length) {
        this.$root.$emit('show-pay')
        this.can_make_payment = this.list.join('_')
      }
    },
    onDetails(data) {
      this.formRequest(data)
    },
    onError(error) {
      let name = ['Payment Button']

      if ([20].includes(error.code)) return

      if (error.code) {
        name.push(error.code)
      }

      if (error.message) {
        name.push(error.message)
      }

      captureMessage(name.join(' '), 'error', error)
    },
    click(method = this.list[0]) {
      this.paymentRequest.pay(method)
    },
    update() {
      this.paymentRequest.update(this.store.formParams())
    },
    updateWithoutToken() {
      if (this.token) return

      this.update()
    },
  },
})
</script>
