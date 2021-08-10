<template>
  <f-form
    class="f-container"
    :class="classNameContainer"
    :data-e2e-ready="ready"
  >
    <div v-if="isDemo" class="f-demo">
      <div class="f-demo-title" v-text="$t('demo-title')" />
    </div>
    <f-alert-notification-wrapper />
    <transition name="f-fade-enter">
      <router-view class="f-loyaut" />
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
import FAlertNotificationWrapper from '@/components/alert/alert-notification-wrapper'
import { errorHandler, getRouteName } from '@/utils/helpers'
import { mapState, mapStateGetSet } from '@/utils/store'
import { timeoutMixin } from '@/mixins/timeout'
import { resizeMixin } from '@/mixins/resize'
import { isError } from '@/utils/inspect'

let model3ds

export default {
  components: {
    FForm,
    FLoading,
    FModalErrorWrapper,
    FModal3ds,
    FAlertGdprWrapper,
    FAlertNotificationWrapper,
  },
  mixins: [timeoutMixin, resizeMixin],
  provide() {
    return {
      formRequest: this.formRequest,
    }
  },
  data() {
    return {
      timeoutId: 0,
      show3ds: false,
      duration3ds: 0,
      needRoute: '',
    }
  },
  computed: {
    ...mapState('options', ['disable_request']),
    ...mapState('options.theme', ['type']),
    ...mapState(['loading']),
    ...mapState('options', ['methods']),
    ...mapState('params', ['token', 'lang']),

    ...mapStateGetSet(['ready', 'cards', 'order']),
    ...mapStateGetSet('params', [
      'amount',
      'currency',
      'merchant_id',
      'order_id',
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
      this.location(model.instance(model.attr('order')))
      return Promise.reject(model)
    },
    appSuccess(model) {
      this.$root.$emit('ready', model)
      this.appFinally(model)
    },
    appError(model) {
      if (!isError(model)) {
        this.appFinally(model)
      }

      return Promise.reject(model)
    },
    appFinally(model) {
      if (!model) return

      this.needRoute = this.store.infoSuccess(
        model.instance(model.attr('info'))
      )
      this.orderSuccess(model.instance(model.attr('order')))
      this.cards = model.attr('cards')
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
      this.order = model.data
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
        this.$router.push({ name: 'verify' }).catch(() => {})
      } else if (model.inProgress() && model.waitForResponse()) {
        this.locationPending()
      } else if (model.inProgress()) {
        this.$router.push({ name: 'success' }).catch(() => {})
      } else {
        this.store
          .autoSubmit()
          .then(this.autoSubmit, this.locationMethod)
          .catch(errorHandler)
      }
    },
    locationPending() {
      this.store.formLoading(true)
      this.timeout('getOrder', 15 * 1000)
      this.timeout('getOrderClear', 60 * 1000, false)
    },
    getOrder() {
      this.store
        .sendRequest('api.checkout.order', 'get', this.store.formParams())
        .finally(() => {
          this.store.formLoading(false)
        })
        .then(this.orderSuccess)
        .catch(errorHandler)
    },
    getOrderClear() {
      this.store.formLoading(false)
      this.clearTimeout('getOrder')
      this.clearTimeout('getOrderClear')
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
      let name = getRouteName(
        this.methods,
        this.needRoute || this.$route.name || this.$route.params.method,
        this.has_fields,
        this.isBreakpointMd
      )

      this.$router.push({ name }).catch(() => {})
    },
    submit3ds() {
      model3ds.submit3dsForm()
    },
  },
}
</script>
