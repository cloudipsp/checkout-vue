<template>
  <div class="f-wrapper">
    <div v-if="!isMin" class="f-mobile-menu f-visible-mobile">
      <button :class="[css.btn, css.bd, css.btnSm]" @click="show = !show" v-t="'other'"></button>
    </div>
    <div class="f-info" ref="info">
      <info></info>
    </div>
    <div v-if="!isMin" class="f-methods" :class="{'f-open' : show}">
      <methods :on-change-method="changeMethod"></methods>
    </div>
    <div class="f-center" ref="center">
      <component :is="router.page" :method="router.method" :on-submit="submit" :valid="!errors.items.length" :order="order" :cards="cards"></component>
      <div v-if="loading">
        <div class="f-loading"></div>
        <div class="f-loading-i"></div>
      </div>
      <popover :title="error.code" :content="error.message" trigger="manual" v-model="showError">
        <div class="f-center-error"></div>
      </popover>
    </div>
  </div>
</template>

<script>
  import Info from '@/components/info'
  import Methods from '@/components/methods'
  import Verify from '@/components/verify'
  import { sendRequest } from '@/utils/helpers'
  import store from '@/store'
  import Popover from '@/components/popover'
  import PaymentMethod from '@/components/payment-method'
  import Success from '@/components/success'

  export default {
    inject: ['$validator'],
    props: ['onSetMin'],
    data () {
      return {
        loading: false,
        show: false,
        options: store.state.options,
        form: store.state.form,
        error: store.state.error,
        router: store.state.router,
        css: store.state.css,
        regular: store.state.regular,
        timeoutId: 0,
        order: {},
        cards: []
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
      }
    },
    created: function () {
      this.$root.$on('submit', () => {
        this.submit()
      })
      this.$root.$on('location', (method, system) => {
        this.show = false
        this.router.page = 'payment-method'
        this.router.method = method
        this.router.system = system
      })
      let self = this
      if (!parseInt(this.form.amount)) {
        this.form.amount = 0
        this.form.recurring_data.amount = 0
      }
      if (this.regular.insert) {
        this.form.recurring = 'y'
      }

      sendRequest('api.checkout.cards', 'get', {}).then(
        function (model) {
          self.cards = Object.values(model.data)
//          self.cards = [{
//            card_number: '4444 55XX XXXX 6666',
//            expiry_date: '11 / 17',
//            email: 'asd@asd.asd',
//            hash: '725272f6b133a2a9357f413fed91138bb0bf1893'
//          },
//          {
//            card_number: '4444 55XX XXXX 1111',
//            expiry_date: '11 / 19',
//            email: 'test@asd.asd',
//            hash: '4e1ec8228e78bd2900774d61ca63eaa0ffd3c'
//          }]
        }, function () {})
      sendRequest('api.checkout.info', 'get', self.form).then(
        function (model) {
          let info = model.data
          let order = model.data.order_data
          if (order) {
            self.form.amount = order.amount
            self.form.recurring_data.amount = order.amount
            self.form.currency = order.currency
            self.form.merchant_id = order.merchant_id
            self.form.fee = info.order.fee || 0
          } else {
            self.form.fee = info.client_fee || 0
          }
          self.options.email = info.checkout_email_required

//          self.form.fee = 0.055
          if (self.form.fee) {
            return sendRequest('api.checkout.fee', 'get', self.form, String(self.form.amount) + String(self.form.fee)).then(
              function (model) {
                self.form.amount_with_fee = parseInt(model.data.amount_with_fee)
              }, function () {})
          }
        }, function () {})
      if (!this.router.method) {
        this.router.page = 'payment-method'
        this.router.method = this.options.methods[0]
      }
    },
    mounted: function () {
      window.addEventListener('resize', this.resize)
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.resize)
    },
    computed: {
      isMin: function () {
        let result = this.options.methods.length === 1 && this.options.methods[0] === 'card'
        this.onSetMin(result)
        return result
      },
      showError: {
        get: function () {
          return this.error.flag && !this.show
        },
        set: function () {}
      }
    },
    components: {
      Info,
      Methods,
      Verify,
      Popover,
      PaymentMethod,
      Success
    },
    methods: {
      submit: function () {
        this.$validator.validateAll()
        this.$nextTick(function () {
          this.autoFocus()
//        console.log('errors', this.errors.items)
//        console.log('fields', this.fields)
          console.log('form', this.form)
//      this.errors.clear()
          if (!this.errors.items.length && !this.loading) {
            this.loading = true
            this.error.flag = false
            this.form.payment_system = this.router.system || this.router.method
            let self = this
            sendRequest('api.checkout.form', 'request', self.form).finally(function () {
              self.loading = false
            }).then(
              function (model) {
                model.sendResponse()
                if (model.needVerifyCode()) {
                  self.router.page = 'verify'
                  self.router.method = 'card'
                  self.router.system = 'verify'
                  self.form.token = model.attr('order.token')
                } else if (!model.submitToMerchant()) {
                  self.order = model.attr('order.order_data')
                  self.router.page = 'success'
                }
              }, function () {})
          }
        })
      },
      autoFocus: function () {
        if (this.errors.items.length) {
          let $firstErrorField = this.$el.querySelector('[data-vv-id="' + this.$validator.errors.items[0].id + '"]')
          $firstErrorField.scrollIntoView()
          $firstErrorField.focus()
        }
      },
      changeMethod: function () {
        this.show = false
      },
      resize () {
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

        this.resizeError()
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
          this.resize()
        })
      }
    }
  }
</script>
