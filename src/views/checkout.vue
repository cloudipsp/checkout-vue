<template>
  <f-form
    class="f-container"
    :class="classNameContainer"
    :data-e2e-ready="ready"
  >
    <div v-if="isDemo" class="f-demo">
      <div class="f-demo-title" v-text="$t('demo-title')" />
    </div>
    <transition name="f-fade-enter">
      <router-view class="f-loyaut" :order="order" />
    </transition>
    <f-loading v-if="loading" backdrop />
    <f-modal-error-wrapper />
    <f-modal-3ds
      v-model="show3ds"
      :duration.sync="duration3ds"
      @submit3ds="submit3ds"
    />
    <f-alert-gdpr-wrapper />
  </f-form>
</template>

<script>
import FForm from '@/components/form/form'
import FLoading from '@/components/loading'
import FModalErrorWrapper from '@/components/modal/modal-error-wrapper'
import FModal3ds from '@/components/modal/modal-3ds'
import FAlertGdprWrapper from '@/components/alert/alert-gdpr-wrapper'
import { errorHandler, getRouteName } from '@/utils/helpers'
import { mapState, mapStateGetSet } from '@/utils/store'
import { cardsParse } from '@/utils/card-brand'

let model3ds

export default {
  components: {
    FForm,
    FLoading,
    FModalErrorWrapper,
    FModal3ds,
    FAlertGdprWrapper,
  },
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
    }
  },
  computed: {
    ...mapState('options', ['disable_request']),
    ...mapState('options.theme', ['type']),
    ...mapState(['loading']),
    ...mapState('options', ['methods']),
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
    ...mapState(['has_fields']),
    classNameContainer() {
      return [`f-page-${this.$route.name}`, `f-theme-${this.type}`]
    },
    isDemo() {
      return this.disable_request
    },
    createdFormParams() {
      let result = this.token ? { token: this.token } : this.store.formParams()

      if (this.store.user.params?.lang) {
        result.lang = this.lang
      }

      return result
    },
  },
  created() {
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
      this.orderSuccess(model.instance(model.attr('order')))
      this.cardsSuccess(model.instance(model.attr('cards')))
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
      this.location(model)

      let order_data = model.attr('order_data')

      if (!order_data) return

      this.amount = parseInt(order_data.amount)
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
        this.need_verify_code = true
        this.verification_type = model.attr('verification_type')
        this.title = 'verification_t'
        this.order_desc = 'verification_' + this.verification_type + '_d'
        this.card_number = model.attr('order_data.masked_card')
        this.expiry_date = model.attr('order_data.expiry_date') || ''
        this.cvv2 = ''
        this.$router.push({ name: 'card-verify' }).catch(() => {})
      } else if (model.inProgress() && model.waitForResponse()) {
        this.locationPending()
      } else if (model.inProgress()) {
        this.order = model.attr('order_data')
        this.$router.push({ name: 'success' }).catch(() => {})
      } else {
        this.store
          .autoSubmit()
          .then(this.autoSubmit, this.locationMethod)
          .catch(errorHandler)
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
    autoSubmit({ method, system }) {
      this.$router
        .push({
          name: 'system',
          params: { method, system },
          query: { autoSubmit: true },
        })
        .catch(() => {})
    },
    locationMethod() {
      if (this.$route.name === 'menu') return

      let name = getRouteName(
        this.methods,
        this.$route.name || this.$route.params.method,
        this.has_fields
      )

      this.$router.push({ name }).catch(() => {})
    },
    submit3ds() {
      model3ds.submit3dsForm()
    },
  },
}
</script>
