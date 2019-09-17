<template>
  <div class="f-wrapper">
    <info ref="info" />
    <f-methods :in-progress="inProgress" />
    <div ref="center" class="f-center">
      <!--payment-method success pending-->
      <component :is="router.page" :order="order" />
      <div v-if="store.state.loading">
        <div class="f-loading" />
        <div class="f-loading-i" />
      </div>
      <f-error></f-error>
      <submit3ds
        v-model="show3ds"
        :duration.sync="duration3ds"
        @submit3ds="submit3ds"
      />
    </div>
  </div>
</template>

<script>
import Info from '@/components/info'
import Success from '@/components/success'
import Pending from '@/components/pending'
import { deepMerge, sendRequest } from '@/utils/helpers'
import Submit3ds from '@/components/submit3ds'
import Resize from '@/mixins/resize'

let model3ds

export default {
  mixins: [Resize],
  inject: ['$validator'],
  components: {
    Info,
    Success,
    Pending,
    Submit3ds,
  },
  props: {
    min: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeoutId: 0,
      order: {},
      inProgress: false,
      show3ds: false,
      duration3ds: 0,
    }
  },
  watch: {
    'store.state.regular.open': 'nextResize',
    'options.email': 'nextResize',
    router: {
      handler: 'nextResize',
      deep: true,
    },
    'params.amount'() {
      this.store.getAmountWithFee()
    },
  },
  created: function() {
    this.createdEvent()

    sendRequest('api.checkout', 'app', this.store.formParams())
      .finally(() => {
        this.store.formLoading(false)
      })
      .then(this.appSuccess)
      .catch(() => {})
  },
  mounted() {
    this.nextResize()
  },
  methods: {
    submit: function() {
      this.$validator.validateAll().then(isValid => {
        this.store.state.submit = true
        // this.errors.items this.fields this.errors.clear() this.errors.count()

        if (!isValid || this.store.state.loading) return this.autoFocus()
        this.store.formLoading(true)

        sendRequest(
          'api.checkout.form',
          'request',
          this.store.formParams(),
          false
        )
          .finally(() => {
            this.store.formLoading(false)
          })
          .then(this.submitSuccess, this.submitError)
      })
    },
    submitSuccess: function(model) {
      if (!model) return
      this.$root.$emit('success', model)

      // TODO уточнить у Степана
      this.location(model.instance(model.alt('order', model.data)))
      this.submit3dsSuccess(model)
    },
    submitError: function(model) {
      this.$root.$emit('error', model)
    },
    appSuccess: function(model) {
      this.store.state.ready = true
      this.$root.$emit('ready', model)
      this.infoSuccess(model.instance(model.attr('info')))
      this.orderSuccess(model.instance(model.attr('order')))
      this.cardsSuccess(model.instance(model.attr('cards')))
    },
    cardsSuccess: function(model) {
      if (this.store.state.need_verify_code || !Array.isArray(model.data))
        return

      this.store.state.cards = model.data

      if (this.store.state.cards.length) {
        //          this.$validator.detach('f-card_number')
        this.store.setCardNumber(this.store.state.cards[0])
        this.$nextTick(() => {
          this.$validator.validateAll()
        })
      }
    },
    infoSuccess: function(model) {
      this.options.link = model.attr('merchant_url') || this.options.link
      this.params.lang = model.attr('lang') || this.params.lang
      this.options.email =
        model.attr('checkout_email_required') || this.options.email
      this.options.title =
        this.options.title || model.attr('merchant.localized_name')
      this.options.logo_url =
        this.options.logo_url || model.attr('merchant.logo_url')
      this.options.offerta_url =
        this.options.offerta_url || model.attr('merchant.offerta_url')

      if (
        (!this.store.user.options.methods ||
          !this.store.user.options.methods.length) &&
        model.attr('tabs_order') &&
        model.attr('tabs_order').length
      ) {
        this.options.methods = model.attr('tabs_order')
        this.store.initLocation()
      }
      this.state.tabs = model.attr('tabs')
      this.options.default_country =
        this.store.user.options.default_country || model.attr('default_country')

      this.params.fee = model.attr('client_fee') || 0
      this.options.customer_fields = model.attr('customer_required_data') || []

      this.params.order_desc =
        this.params.order_desc || model.attr('order.order_desc')

      if (model.attr('order.verification')) {
        this.store.state.verification_type = model.attr('verification_type')
        this.options.title = 'verification_t'
        this.params.order_desc =
          'verification_' + this.store.state.verification_type + '_d'
      }

      this.store.setRecurringData(model.attr('order.recurring_data'))

      this.store.showError(
        model.attr('order.error_code'),
        model.attr('order.error_description')
      )
    },
    orderSuccess: function(model) {
      let order_data = model.attr('order_data')

      if (!order_data) return

      this.location(model)

      this.params.amount = order_data.amount
      this.params.currency = order_data.currency
      this.params.merchant_id = order_data.merchant_id
      this.params.email = order_data.sender_email || this.params.email
      this.params.order_id = order_data.order_id
    },
    submit3dsSuccess: function(model) {
      if (!model.waitOn3dsDecline()) return

      this.show3ds = true
      this.duration3ds = model.waitOn3dsDecline()
      model3ds = model
    },
    location: function(model) {
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
        this.store.state.need_verify_code = true
        this.params.card_number = model.attr('order_data.masked_card')
        this.params.expiry_date = model.attr('order_data.expiry_date')
        this.params.cvv2 = ''
        this.store.location('f-payment-method', 'card')
      } else if (model.inProgress() && model.waitForResponse()) {
        this.inProgress = true
        this.locationPending()
      } else if (model.inProgress()) {
        this.inProgress = true
        this.order = model.attr('order_data')
        this.store.location('success')
      }
    },
    locationPending: function() {
      if (this.store.state.loading) return
      this.store.formLoading(true)
      this.processingTimeout = setTimeout(() => {
        sendRequest('api.checkout.order', 'get', this.params)
          .finally(() => {
            this.store.formLoading(false)
          })
          .then(this.orderSuccess)
      }, 15 * 1000)
      if (!this.processingClear) {
        this.processingClear = setTimeout(() => {
          this.processingClear = null
          this.store.formLoading(false)
          clearTimeout(this.processingTimeout)
        }, 2 * 30 * 1000)
      }

      this.store.location('pending')
    },
    createdEvent: function() {
      this.$root.$on('submit', this.submit)
      this.$root.$on('location', (method, system) => {
        this.store.location('f-payment-method', method, system)
      })
      this.$root.$on('setParams', this.store.setParams)
    },
    autoFocus: function() {
      let $firstErrorField = this.$el.querySelector(
        '#' + this.errors.items[0].field
      )
      $firstErrorField.scrollIntoView()
      setTimeout(() => {
        $firstErrorField.focus()
      })
    },
    resize: function() {
      if (!this.options.full_screen) return

      let $container = document.querySelector('.f-container')
      this.$refs.center.style.minHeight = 'auto'
      $container.style.paddingTop = '0'

      let width = window.innerWidth
      let height = document.documentElement.clientHeight
      let wraperH = this.$el.offsetHeight
      let centerH = this.$refs.center.offsetHeight
      let infoH = this.$refs.info.$el.offsetHeight
      let containerH = $container.offsetHeight

      if (width >= 992) {
        this.$refs.center.style.minHeight =
          centerH < wraperH ? wraperH + 'px' : 'auto'
        if (containerH < height) {
          $container.style.paddingTop = (height - containerH) / 2 + 'px'
        }
      } else if (width >= 768 && !this.min) {
        this.$refs.center.style.minHeight =
          centerH < wraperH - infoH ? wraperH - infoH + 'px' : 'auto'
      }
    },
    nextResize: function() {
      this.$nextTick(this.resize)
    },
    submit3ds: function() {
      model3ds.submit3dsForm()
    },
  },
}
</script>
