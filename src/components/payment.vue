<template>
  <div class="f-wrapper">
    <div v-if="!isMin" class="f-mobile-menu f-visible-mobile">
      <button type="button" :class="[$css.btn, $css.bd, $css.btnSm]" @click="show = !show" v-t="'other'"></button>
    </div>
    <div class="f-info" ref="info">
      <info></info>
    </div>
    <div v-if="!isMin" class="f-methods" :class="{'f-open' : show}">
      <methods @on-change-method="changeMethod"></methods>
    </div>
    <div class="f-center" ref="center">
      <component :is="router.page" :on-submit="submit" :disabled="isDisabled" :order="order"></component>
      <div v-if="store.state.loading">
        <div class="f-loading"></div>
        <div class="f-loading-i"></div>
      </div>
      <popover :title="error.code" :content="error.message" trigger="manual" :value="showError">
        <div class="f-center-error"></div>
      </popover>
    </div>
  </div>
</template>

<script>
  import Info from '@/components/info'
  import Methods from '@/components/methods'
  import Verify from '@/components/verify'
  import Popover from '@/components/popover'
  import PaymentMethod from '@/components/payment-method'
  import Success from '@/components/success'
  import Pending from '@/components/pending'
  import { sendRequest, deepMerge, validate, findGetParameter } from '@/utils/helpers'
  import { isFunction } from '@/utils/object'
  import notSet from '@/config/not-set'

  export default {
    inject: ['$validator'],
    data () {
      return {
        show: false,
        timeoutId: 0,
        order: {},
        inProgress: false
      }
    },
    watch: {
      'regular.open': 'firstResize',
      'options.email': 'firstResize',
      router: {
        handler: function () {
          this.firstResize()
        },
        deep: true
      },
      show: function (show) {
        document.querySelector('#f').style.overflow = show ? 'hidden' : 'visible'
      },
    },
    created: function () {
      this.createdEvent()

      this.form.token = findGetParameter('token') ||  this.form.token

      if (!parseInt(this.form.amount)) {
        this.form.amount = 0
        this.form.recurring_data.amount = 0
      }
      if (this.regular.insert) {
        this.form.recurring = 'y'
      }
      if (!this.router.method) {
        this.store.location('payment-method', this.options.activeTab)
      }

      sendRequest('api.checkout', 'app', this.form).then(this.appSuccess, function () {})
    },
    mounted: function () {
      window.addEventListener('resize', this.resize)
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.resize)
    },
    computed: {
      isMin: function () {
        let result = (this.options.methods.length === 1 && this.options.methods[0] === 'card') || this.inProgress
        this.$emit('on-set-min', result)
        return result
      },
      showError: function() {
        return this.error.flag && !this.show
      },
      isDisabled: function () {
        return !!this.errors.items.length && this.store.state.submit
      }
    },
    components: {
      Info,
      Methods,
      Verify,
      Popover,
      PaymentMethod,
      Success,
      Pending
    },
    methods: {
      submit: function (cb) {
        this.$validator.validateAll()
        this.$nextTick(()=>{
          this.autoFocus()
          this.store.state.submit = true;
//        console.log('errors', this.errors.items)
//        console.log('fields', this.fields)
//        this.errors.clear()
          console.log('form', this.form)

          if (this.errors.count() || this.store.state.loading) return
          this.store.formLoading(true)
          this.error.flag = false

          let form = {}
          let custom = {}
          Object.assign(form, this.form)
          for (let field in form.custom) {
            if(form.custom.hasOwnProperty(field)) {
              custom[field] = {
                value: form.custom[field],
                label: this.$t(field)
              }
            }
          }
          form.payment_system = this.router.system || this.router.method
          form.custom = custom
          form.amount = form.amount / 100
          if(this.form.recurring_data.amount){
            this.form.recurring_data.amount = this.form.recurring_data.amount / 100
          }

          sendRequest('api.checkout.form', 'request', form)
            .finally(() => {
              this.store.formLoading(false)
            })
            .then(function(model){
              if(isFunction(cb)) {
                let hash = JSON.stringify(model)
                if(JSON.stringify(cb(model)) === hash) {
                  return model
                }
              } else {
                return model
              }
//              return isFunction(cb) ? cb(model) : model;
            })
            .then(this.submitSuccess, this.submitError)
        })
      },
      submitSuccess: function (model) {
        if(!model) return;
        this.$root.$emit('success', model)

        this.location(model.instance(model.attr('order')))
      },
      submitError: function (model) {
        this.$root.$emit('error', model)
      },
      appSuccess: function(model){
        this.infoSuccess(model.instance(model.attr('info')))
        this.orderSuccess(model.instance(model.attr('order')))
      },
      infoSuccess: function (model) {
        this.options.link = model.attr('merchant_url') || this.options.link
        this.form.lang =  model.attr('lang') || this.form.lang
        this.options.activeTab = model.attr('active_tab') || this.options.activeTab
        this.options.email = model.attr('checkout_email_required') || this.options.email
        this.options.title = this.options.title || model.attr('merchant.localized_name')
        this.options.logoUrl = this.options.logoUrl || model.attr('merchant.logo_url')
        this.options.offertaUrl = this.options.offertaUrl || model.attr('merchant.offerta_url')

        this.form.fee = model.attr('client_fee') || 0
        this.options.customerFields = model.attr('customer_required_data') || []

        //this.form.amount_with_fee = parseInt(order.actual_amount * 100)
        this.form.order_desc = this.form.order_desc || model.attr('order.order_desc')
        // TODO
        this.store.showError(model.attr('order.error_code'), model.attr('order.error_description'))
      },
      orderSuccess: function(model) {
        let order_data = model.attr('order_data')

        if (!order_data) return this.store.location('payment-method', this.options.activeTab);

        this.location(model)

        this.form.amount = order_data.amount
        this.form.recurring_data.amount = order_data.amount
        this.form.currency = order_data.currency
        this.form.merchant_id = order_data.merchant_id
        this.form.email = order_data.sender_email || this.form.email
        this.form.order_id = order_data.order_id

        this.store.getAmountWithFee()
      },
      location: function(model){
//        console.warn('model.inProgress()', 'order.in_progress', model.inProgress())
//        console.warn('model.readyToSubmit()', 'order.ready_to_submit', model.readyToSubmit())
//        console.warn('model.waitForResponse()', 'order.pending', model.waitForResponse())
//        console.warn('model.needVerifyCode()', 'order.need_verify_code', model.needVerifyCode())
//        console.warn('model.submitToMerchant()', model.submitToMerchant())

        if (model.sendResponse()) return // action === 'submit' formDataSubmit() || action === 'redirect' redirectUrl()

        if (model.submitToMerchant()) return  // ready_to_submit && response_url && order_data formDataSubmit()

        if (model.needVerifyCode()) { // need_verify_code
          this.form.token = model.attr('token')
          this.store.location('verify', 'card')
        } else
        if (model.inProgress() && model.waitForResponse()) {
          this.inProgress = true
          this.locationPending()
        } else
        if (model.inProgress()) {
          this.inProgress = true
          this.order = model.attr('order_data')
          this.store.location('success')
        } else {
          this.store.location('payment-method', this.options.activeTab)
        }
      },
      locationPending: function() {
        if(this.store.state.loading) return
        this.store.formLoading(true)
        setTimeout(()=>{
          sendRequest('api.checkout.order', 'get', this.form).finally(() => {
            this.store.formLoading(false)
          }).then(this.orderSuccess)
        }, 5000)

        this.store.location('pending')
      },
      createdEvent: function() {
        this.$root.$on('submit', (cb) => {
          this.submit(cb)
        })
        this.$root.$on('location', (method, system) => {
          this.show = false
          this.store.location('payment-method', method, system)
        })
        this.$root.$on('setParams', (params) => {
          if (this.form.token || this.form.order_id) {
            console.warn('You can not change the parameters if there is a token or an order is created')
            return;
          }
          validate({params: params})
          if(!this.error.errors.length) {
            deepMerge(this.form, params, notSet)
            this.getAmountWithFee()
          }
        })
      },
      autoFocus: function () {
        if (this.errors.count()) {
          let $firstErrorField = this.$el.querySelector('[data-vv-id="' + this.errors.items[0].id + '"]')
          $firstErrorField.scrollIntoView()
          $firstErrorField.focus()
        }
      },
      changeMethod: function () {
        this.show = false
      },
      resize: function () {
        this.resizeWindow()
        this.resizeError()
      },
      resizeWindow: function () {
        let $container = document.querySelector('.f-container')
        this.$refs.center.style.minHeight = 'auto'
        $container.style.paddingTop = '0'

        let width = window.innerWidth
        let height = document.documentElement.clientHeight
        let wraperH = this.$el.offsetHeight
        let centerH = this.$refs.center.offsetHeight
        let infoH = this.$refs.info.offsetHeight
        let containerH = $container.offsetHeight

        if (this.options.fullScreen) {
          if (width >= 992) {
            this.$refs.center.style.minHeight = centerH < wraperH ? wraperH + 'px' : 'auto'
            if (containerH < height) {
              $container.style.paddingTop = (height - containerH) / 2 + 'px'
            }
          } else if (width >= 768 && !this.isMin) {
            this.$refs.center.style.minHeight = centerH < wraperH - infoH ? wraperH - infoH + 'px' : 'auto'
          }
        }
      },
      resizeError: function () {
        if (this.error.flag) {
          this.error.buffer = true
          this.error.flag = false
        }
        if (this.timeoutId > 0) {
          clearTimeout(this.timeoutId)
          this.timeoutId = 0
        }
        this.timeoutId = setTimeout(() => {
          this.error.flag = this.error.buffer
          this.error.buffer = false
        }, 150)
      },
      firstResize: function () {
//        console.log('firstResize')
        setTimeout(() => {
          this.resizeWindow()
        })
      }
    }
  }
</script>
