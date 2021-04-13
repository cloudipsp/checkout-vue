<template>
  <f-form
    class="f-wrapper"
    :style="style"
    :data-e2e-ready="ready"
    :form-request="formRequest"
  >
    <f-sidebar />
    <div ref="center" class="f-center">
      <f-scrollbar-vertical wrap-class="f-center-wrap">
        <div v-if="full_screen" class="f-top"><div class="f-top-inner" /></div>
        <router-view :order="order" />
        <f-loading v-if="loading" backdrop />
        <f-modal-error />
        <f-modal-3ds
          v-model="show3ds"
          :duration.sync="duration3ds"
          @submit3ds="submit3ds"
        />
        <f-alert-gdpr-wrapper />
      </f-scrollbar-vertical>
    </div>
  </f-form>
</template>

<script>
import FSidebar from '@/components/sidebar'
import FModalError from '@/components/modal/modal-error'
import FAlertGdprWrapper from '@/components/alert/alert-gdpr-wrapper'

import { errorHandler } from '@/utils/helpers'
import FModal3ds from '@/components/modal/modal-3ds'
import { mapState, mapStateGetSet } from '@/utils/store'
import { cardsParse } from '@/utils/card-brand'
import Resize from '@/mixins/resize'

let model3ds

export default {
  components: {
    FSidebar,
    FModal3ds,
    FModalError,
    FAlertGdprWrapper,
  },
  mixins: [Resize],
  provide() {
    return {
      formRequest: this.formRequest,
    }
  },
  data() {
    return {
      timeoutId: 0,
      order: {},
      show3ds: false,
      duration3ds: 0,
      height: null,
    }
  },
  computed: {
    ...mapState(['loading']),
    ...mapState('options', ['full_screen', 'methods']),
    ...mapState('params', ['token', 'lang']),

    ...mapStateGetSet([
      'ready',
      'cards',
      'verification_type',
      'need_verify_code',
    ]),
    ...mapStateGetSet('options', ['title']),
    ...mapStateGetSet('params', [
      'order_desc',
      'amount',
      'currency',
      'merchant_id',
      'order_id',
      'card_number',
      'expiry_date',
      'cvv2',
    ]),
    createdFormParams() {
      let result = this.token ? { token: this.token } : this.store.formParams()

      if (this.store.user.params?.lang) {
        result.lang = this.lang
      }

      return result
    },
    style() {
      return {
        height: this.height,
      }
    },
  },
  created() {
    this.initHeight()

    if (this.token) {
      this.store.formLoading(true)
    }

    this.store
      .sendRequest('api.checkout', 'app', this.createdFormParams, {
        cached: this.token,
      })
      .finally(() => {
        this.store.formLoading(false)
        this.ready = true
      })
      .then(this.appSuccess)
      .catch(this.appError)
      .catch(errorHandler)
  },
  methods: {
    initHeight() {
      this.height =
        this.full_screen && this.isWidthLg
          ? `calc(${window.innerHeight}px - 4.625rem)`
          : 'calc(100% - 4.625rem)'
    },
    resize() {
      this.initHeight()
    },
    formRequest(data) {
      if (this.loading) return Promise.reject()
      this.store.formLoading(true)

      return this.store
        .sendRequest(
          'api.checkout.form',
          'request',
          this.store.formParams(data),
          {},
          this.submitProgress
        )
        .finally(() => {
          this.store.formLoading(false)
        })
        .then(this.submitSuccess, this.submitError)
    },
    submitProgress(model) {
      if (!model) return

      this.location(model.instance(model.alt('order', model.data)))
      this.submit3dsSuccess(model)

      return model
    },
    submitSuccess(model) {
      this.$root.$emit('success', model)

      this.submitProgress(model)

      return model
    },
    submitError(model) {
      this.$root.$emit('error', model)
      return Promise.reject(model)
    },
    appSuccess(model) {
      this.$root.$emit('ready', model)
      this.appFinally(model)
    },
    appError(model) {
      this.appFinally(model)
      return Promise.reject(model)
    },
    appFinally(model) {
      if (!model) return

      this.store.infoSuccess(model.instance(model.attr('info')))
      this.initLocation()
      this.orderSuccess(model.instance(model.attr('order')))
      this.cardsSuccess(model.instance(model.attr('cards')))
    },
    initLocation() {
      let method_route = this.$route.name || this.$route.params.method
      let name = this.methods.includes(method_route)
        ? method_route
        : this.methods[0]

      this.$router.push({ name, query: { init: true } }).catch(() => {})
    },
    cardsSuccess(model) {
      if (this.need_verify_code) return
      if (!Array.isArray(model.data)) return
      if (!model.data.length) return

      cardsParse(model.data).then(cards => {
        this.cards = cards
        this.store.setCardNumber(this.cards[0])
      })
    },
    orderSuccess(model) {
      let order_data = model.attr('order_data')

      if (!order_data) return

      this.location(model)

      this.amount = order_data.amount
      this.currency = order_data.currency
      this.merchant_id = order_data.merchant_id
      this.store.state.params.email =
        order_data.sender_email || this.store.state.params.email
      this.order_id = order_data.order_id
    },
    submit3dsSuccess(model) {
      if (!model.waitOn3dsDecline()) return

      this.show3ds = true
      this.duration3ds = model.waitOn3dsDecline()
      model3ds = model
    },
    location(model) {
      //        console.warn('model.inProgress()', 'order.in_progress', model.inProgress())
      //        console.warn('model.readyToSubmit()', 'order.ready_to_submit', model.readyToSubmit())
      //        console.warn('model.waitForResponse()', 'order.pending', model.waitForResponse())
      //        console.warn('model.needVerifyCode()', 'order.need_verify_code', model.needVerifyCode())
      //        console.warn('model.submitToMerchant()', model.submitToMerchant())

      if (model.sendResponse()) return // action === 'submit' formDataSubmit() || action === 'redirect' redirectUrl()

      if (
        this.$root._events.callback &&
        this.$root._events.callback.length &&
        model.attr('ready_to_submit')
      )
        return this.$root.$emit('callback', model)

      if (model.submitToMerchant()) return // ready_to_submit && response_url && order_data formDataSubmit()

      if (model.needVerifyCode()) {
        // need_verify_code
        this.need_verify_code = true
        this.verification_type = model.attr('verification_type')
        this.title = 'verification_t'
        this.order_desc = 'verification_' + this.verification_type + '_d'
        this.card_number = model.attr('order_data.masked_card')
        this.expiry_date = model.attr('order_data.expiry_date') || ''
        this.cvv2 = ''
        this.$router.push({ name: 'card' }).catch(() => {})
      } else if (model.inProgress() && model.waitForResponse()) {
        this.locationPending()
      } else if (model.inProgress()) {
        this.order = model.attr('order_data')
        this.$router.push({ name: 'success' }).catch(() => {})
      } else {
        this.store.autoSubmit().then(this.formRequest).catch(errorHandler)
      }
    },
    locationPending() {
      if (this.loading) return
      this.store.formLoading(true)
      this.processingTimeout = setTimeout(() => {
        this.store
          .sendRequest('api.checkout.order', 'get', this.store.formParams())
          .finally(() => {
            this.store.formLoading(false)
          })
          .then(this.orderSuccess)
          .catch(errorHandler)
      }, 15 * 1000)
      if (!this.processingClear) {
        this.processingClear = setTimeout(() => {
          this.processingClear = null
          this.store.formLoading(false)
          clearTimeout(this.processingTimeout)
        }, 2 * 30 * 1000)
      }
    },
    submit3ds() {
      model3ds.submit3dsForm()
    },
  },
}
</script>
