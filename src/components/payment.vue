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
      <component
        :is="router.page"
        @on-submit="submit"
        @on-cancel="cancel"
        :disabled="isDisabled"
        :order="order"
      ></component>
      <div v-if="store.state.loading">
        <div class="f-loading"></div>
        <div class="f-loading-i"></div>
      </div>
      <popover :title="error.code" :content="error.message" trigger="manual" :value="showError">
        <div class="f-center-error"></div>
      </popover>
      <submit3ds v-model="show3ds" :duration.sync="duration3ds" @submit3ds="submit3ds"></submit3ds>
    </div>
  </div>
</template>

<script>
  import Info from '@/components/info'
  import Methods from '@/components/methods'
  import Popover from '@/components/popover'
  import PaymentMethod from '@/components/payment-method'
  import Success from '@/components/success'
  import Pending from '@/components/pending'
  import { sendRequest, deepMerge, validate, findGetParameter } from '@/utils/helpers'
  import { isFunction } from '@/utils/object'
  import notSet from '@/config/not-set'
  import Submit3ds from '@/components/submit3ds'

  let model3ds

  export default {
    inject: ['$validator'],
    data () {
      return {
        show: false,
        timeoutId: 0,
        order: {},
        inProgress: false,
        show3ds: false,
        duration3ds: 0
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
//      'store.server': {
//        handler: function () {
//          this.store.mergeServer()
//        },
//        deep: true
//      }
      'params.amount' () {
        this.store.getAmountWithFee()
      }
    },
    created: function () {
      this.createdEvent()

      this.params.token = findGetParameter('token') ||  this.params.token

      if (!this.router.method) {
        this.store.location('payment-method', this.options.active_tab)
      }

      sendRequest('api.checkout', 'app', this.params).then(this.appSuccess, function () {})
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
      Popover,
      PaymentMethod,
      Success,
      Pending,
      Submit3ds
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

          if (this.errors.count() || this.store.state.loading) return
          this.store.formLoading(true)
          this.error.flag = false

          let params = {}
          let custom = {}
          Object.assign(params, this.params)
          for (let field in params.custom) {
            if(params.custom.hasOwnProperty(field)) {
              custom[field] = {
                value: params.custom[field],
                label: this.$t(field)
              }
            }
          }
          params.payment_system = this.router.system || this.router.method
          params.custom = custom
          if(this.store.state.need_verify_code){
            delete params.custom
          }
          params.amount = params.amount / 100
          if(this.params.recurring_data.amount){
            this.params.recurring_data.amount = this.params.recurring_data.amount / 100
          }

          sendRequest('api.checkout.form', 'request', params)
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
      cancel: function(){
        if(this.store.state.loading) return
        this.store.formLoading(true)
        sendRequest('api.checkout.order', 'get', this.params).finally(() => {
          this.store.formLoading(false)
        }).then(this.cancelLocation, this.cancelLocation)
      },
      cancelLocation: function(model){
        if (!model.submitToMerchant()){
          location.assign(this.options.link)
        }
      },
      submitSuccess: function (model) {
        if(!model) return;
        this.$root.$emit('success', model)

        this.location(model.instance(model.attr('order')))
        this.submit3dsSuccess(model)
      },
      submitError: function (model) {
        this.$root.$emit('error', model)
      },
      appSuccess: function(model){
        this.$root.$emit('ready')
        this.infoSuccess(model.instance(model.attr('info')))
        this.orderSuccess(model.instance(model.attr('order')))
        this.cardsSuccess(model.instance(model.attr('cards')))
      },
      cardsSuccess: function (model) {
        if(this.store.state.need_verify_code || !Array.isArray(model.data)) return

        this.store.state.cards = model.data

        if (this.store.state.cards.length) {
//          this.$validator.detach('f-card_number')
          this.store.setCardNumber(this.store.state.cards[0])
          this.$nextTick(() => {
            this.$validator.validateAll()
          })
        }
      },
      infoSuccess: function (model) {
//        deepMerge(this.store.server, {
//          options: {
//            link: model.attr('merchant_url'),
//            email: model.attr('checkout_email_required'),
//            title: model.attr('merchant.localized_name'),
//            logo_url: model.attr('merchant.logo_url'),
//            offerta_url: model.attr('merchant.offerta_url'),
//            methods: model.attr('tabs_order'),
//            customer_fields: model.attr('customer_required_data'),
//          },
//          params: {
//            lang: model.attr('lang'),
//            fee: model.attr('client_fee'),
//            order_desc: model.attr('order.order_desc'),
//          },
//          regular: {
//            insert: model.attr('order.subscription'),
//          },
//        })
        this.options.link = model.attr('merchant_url') || this.options.link
        this.params.lang =  model.attr('lang') || this.params.lang
        this.options.email = model.attr('checkout_email_required') || this.options.email
        this.options.title = this.options.title || model.attr('merchant.localized_name')
        this.options.logo_url = this.options.logo_url || model.attr('merchant.logo_url')
        this.options.offerta_url = this.options.offerta_url || model.attr('merchant.offerta_url')

        this.options.methods = this.options.methods.concat(model.attr('tabs_order') || []).filter(function(item, pos, self) {
          return self.indexOf(item) === pos;
        })
        this.options.tabs = model.attr('tabs')
        this.options.default_country = model.attr('default_country')

        this.params.fee = model.attr('client_fee') || 0
        this.options.customer_fields = model.attr('customer_required_data') || []

        this.params.order_desc = this.params.order_desc || model.attr('order.order_desc')

//        this.regular.insert = model.attr('order.subscription')

        if(model.attr('order.verification')){
          this.store.state.verification_type = model.attr('verification_type')
          this.options.title = 'verification_t'
          this.params.order_desc = 'verification_' + this.store.state.verification_type + '_d'
        }

        let recurring_data = model.attr('order.recurring_data')
        if(recurring_data){
          Object.assign(this.params.recurring_data, recurring_data)
          this.regular.insert = true
        }

        this.store.showError(model.attr('order.error_code'), model.attr('order.error_description'))
      },
      orderSuccess: function(model) {
        let order_data = model.attr('order_data')

        if (!order_data) return

//        deepMerge(this.store.server, {
//          params: {
//            amount: order_data.amount,
//            recurring_data: {
//              amount: order_data.amount,
//            },
//            currency: order_data.currency,
//            merchant_id: order_data.merchant_id,
//            email: order_data.sender_email,
//            order_id: order_data.order_id,
//          }
//        })

        this.location(model)

        this.params.amount = order_data.amount
        this.params.currency = order_data.currency
        this.params.merchant_id = order_data.merchant_id
        this.params.email = order_data.sender_email || this.params.email
        this.params.order_id = order_data.order_id
      },
      submit3dsSuccess: function(model) {
        if(!model.waitOn3dsDecline()) return

        this.show3ds = true
        this.duration3ds = model.waitOn3dsDecline()
        model3ds = model
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
          this.store.state.need_verify_code = true
          this.params.card_number = model.attr('order_data.masked_card')
          this.params.expiry_date =  model.attr('order_data.expiry_date')
          this.params.cvv2 = ''
          this.store.location('payment-method', 'card')
        } else
        if (model.inProgress() && model.waitForResponse()) {
          this.inProgress = true
          this.locationPending()
        } else
        if (model.inProgress()) {
          this.inProgress = true
          this.order = model.attr('order_data')
          this.store.location('success')
        }
      },
      locationPending: function() {
        if(this.store.state.loading) return
        this.store.formLoading(true)
        this.processingTimeout = setTimeout(() => {
          sendRequest('api.checkout.order', 'get', this.params).finally(() => {
            this.store.formLoading(false)
          }).then(this.orderSuccess)
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

        this.$root.$on('submit', (cb) => {
          this.submit(cb)
        })
        this.$root.$on('location', (method, system) => {
          this.show = false
          this.store.location('payment-method', method, system)
        })
        this.$root.$on('setParams', (params) => {
          if (this.params.token || this.params.order_id) {
            console.warn('You can not change the parameters if there is a token or an order is created')
            return;
          }
          validate({params: params})
          if(!this.error.errors.length) {
            deepMerge(this.params, params, notSet.params)
          }
        })
        this.$root.$on('resize', () => {
          this.resizeWindow()
        })
      },
      autoFocus: function () {
        if (this.errors.count()) {
          let $firstErrorField = this.$el.querySelector('#'+ this.errors.items[0].field)
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

        if (this.options.full_screen) {
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
      },
      submit3ds: function () {
        model3ds.submit3dsForm()
      }
    }
  }
</script>
