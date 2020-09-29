<template>
  <div class="f-wrapper" :data-e2e-ready="ready">
    <info ref="info" />
    <f-methods :in-progress="inProgress" />
    <div ref="center" class="f-center">
      <!--payment-method success pending-->
      <component :is="page" :order="order" />
      <div v-if="loading">
        <div class="f-loading" />
        <div class="f-loading-i" />
      </div>
      <f-error />
      <submit3ds
        v-model="show3ds"
        :duration.sync="duration3ds"
        @submit3ds="submit3ds"
      />
    </div>
  </div>
</template>

<script>
import Success from '@/components/success'
import Pending from '@/components/pending'
import PaymentMethod from '@/components/payment-method'
import FMethods from '@/components/methods'
import FError from '@/components/error'

import Info from '@/components/info'
import { sendRequest } from '@/utils/helpers'
import { isExist } from '@/utils/typeof'
import Submit3ds from '@/components/submit3ds'
import Resize from '@/mixins/resize'
import { mapState, mapStateGetSet } from '@/utils/store'
import loadButton from '@/store/button'

let model3ds

export default {
  provide() {
    return {
      formRequest: this.formRequest,
    }
  },
  components: {
    Success,
    Pending,
    PaymentMethod,
    FMethods,
    Info,
    Submit3ds,
    FError,
  },
  mixins: [Resize],
  inject: ['$validator'],
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
  computed: {
    ...mapState(['loading']),
    ...mapState('router', ['page']),
    ...mapState('options', ['full_screen']),
    ...mapState('params', ['token']),

    ...mapStateGetSet([
      'ready',
      'cards',
      'tabs',
      'verification_type',
      'need_verify_code',
      'validate_expdate',
    ]),
    ...mapStateGetSet('options', [
      'email',
      'link',
      'title',
      'logo_url',
      'offerta_url',
      'methods',
      'default_country',
      'customer_fields',
    ]),
    ...mapStateGetSet('params', [
      'lang',
      'fee',
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
      return this.token ? { token: this.token } : this.store.formParams()
    },
  },
  watch: {
    'store.state.regular.open': 'nextResize',
    email: 'nextResize',
    router: {
      handler: 'nextResize',
      deep: true,
    },
  },
  created() {
    this.createdEvent()

    if (this.token) {
      this.store.formLoading(true)
    }

    loadButton()
      .then(
        response => {
          this.store.setButtonParams(response)
        },
        () => {}
      )
      .then(() => {
        return sendRequest('api.checkout', 'app', this.createdFormParams)
      })
      .finally(() => {
        this.store.formLoading(false)
      })
      .then(this.appSuccess)
      .catch(e => {
        if (e instanceof Error) console.log(e)
      })
  },
  mounted() {
    this.nextResize()
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(isValid => {
        this.store.state.submit = true
        // this.errors.items this.fields this.errors.clear() this.errors.count()

        if (!isValid) return this.autoFocus()

        this.formRequest()
      })
    },
    formRequest(data) {
      if (this.loading) return
      this.store.formLoading(true)

      return sendRequest(
        'api.checkout.form',
        'request',
        Object.assign(this.store.formParams(), data)
      )
        .finally(() => {
          this.store.formLoading(false)
        })
        .then(this.submitSuccess, this.submitError)
        .catch(e => {
          if (e instanceof Error) console.log(e)
        })
    },
    submitSuccess(model) {
      if (!model) return
      this.$root.$emit('success', model)

      this.location(model.instance(model.alt('order', model.data)))
      this.submit3dsSuccess(model)
    },
    submitError(model) {
      this.$root.$emit('error', model)
    },
    appSuccess(model) {
      this.ready = true
      this.$root.$emit('ready', model)
      this.infoSuccess(model.instance(model.attr('info')))
      this.orderSuccess(model.instance(model.attr('order')))
      this.cardsSuccess(model.instance(model.attr('cards')))
    },
    cardsSuccess(model) {
      if (this.need_verify_code || !Array.isArray(model.data)) return

      if (!model.data.length) return

      this.cards = this.cardsParse(model.data)

      this.store.setCardNumber(this.cards[0])
    },
    cardsParse(data) {
      return data.map(item => {
        let card_number = item.card_number.replace(/ /g, '')
        let expiry_date = item.expiry_date.replace(/ /g, '')

        return {
          ...item,
          card_number,
          expiry_date,
        }
      })
    },
    infoSuccess(model) {
      if (isExist(model.attr('validate_expdate'))) {
        this.validate_expdate = model.attr('validate_expdate')
      }
      this.link = model.attr('merchant_url') || this.link
      this.email = model.attr('checkout_email_required') || this.email
      this.title = this.title || model.attr('merchant.localized_name')
      this.logo_url = this.logo_url || model.attr('merchant.logo_url')
      this.offerta_url = this.offerta_url || model.attr('merchant.offerta_url')

      if (
        !this.store.attr('user.options.methods.length') &&
        model.attr('tabs_order') &&
        model.attr('tabs_order').length
      ) {
        this.methods = model.attr('tabs_order')
        this.store.initLocation()
      }
      this.tabs = model.attr('tabs')
      this.default_country =
        this.store.attr('user.options.default_country') ||
        model.attr('default_country')

      this.fee = model.attr('client_fee') || 0
      this.customer_fields = model.attr('customer_required_data') || []

      this.order_desc = this.order_desc || model.attr('order.order_desc')

      if (model.attr('order.verification')) {
        this.verification_type = model.attr('verification_type')
        this.title = 'verification_t'
        this.order_desc = 'verification_' + this.verification_type + '_d'
      }

      this.store.setRecurringData(model.attr('order.recurring_data'))

      this.store.showError(
        model.attr('order.error_code'),
        model.attr('order.error_description')
      )
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
        this.card_number = model.attr('order_data.masked_card')
        this.expiry_date = model.attr('order_data.expiry_date')
        this.cvv2 = ''
        this.store.location('payment-method', 'card')
      } else if (model.inProgress() && model.waitForResponse()) {
        this.inProgress = true
        this.locationPending()
      } else if (model.inProgress()) {
        this.inProgress = true
        this.order = model.attr('order_data')
        this.store.location('success')
      }
    },
    locationPending() {
      if (this.loading) return
      this.store.formLoading(true)
      this.processingTimeout = setTimeout(() => {
        sendRequest('api.checkout.order', 'get', this.store.formParams())
          .finally(() => {
            this.store.formLoading(false)
          })
          .then(this.orderSuccess)
          .catch(e => {
            if (e instanceof Error) console.log(e)
          })
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
    createdEvent() {
      this.$root.$on('submit', this.submit)
      this.$root.$on('location', (method, system) => {
        this.store.location('payment-method', method, system)
      })
      this.$root.$on('setParams', this.store.setParams)
    },
    autoFocus() {
      let $firstErrorField = this.$el.querySelector(
        '#' + this.errors.items[0].field
      )

      if (this.full_screen) {
        $firstErrorField.scrollIntoView()
      }

      setTimeout(() => {
        $firstErrorField.focus()
      })
    },
    resize() {
      if (!this.full_screen) return

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
    nextResize() {
      this.$nextTick(this.resize)
    },
    submit3ds() {
      model3ds.submit3dsForm()
    },
  },
}
</script>
