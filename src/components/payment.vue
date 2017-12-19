<template>
  <div class="f-wrapper">
    <div v-if="!isMin" class="f-mobile-menu f-visible-mobile">
      <button type="button" :class="[css.btn, css.bd, css.btnSm]" @click="show = !show" v-t="'other'"></button>
    </div>
    <div class="f-info" ref="info">
      <info></info>
    </div>
    <div v-if="!isMin" class="f-methods" :class="{'f-open' : show}">
      <methods :on-change-method="changeMethod"></methods>
    </div>
    <div class="f-center" ref="center">
      <component :is="router.page" :method="router.method" :on-submit="submit" :valid="!errors.items.length" :order="order"></component>
      <div v-if="state.loading">
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
        show: false,
        store: store,
        state: store.state,
        options: store.state.options,
        form: store.state.form,
        error: store.state.error,
        router: store.state.router,
        css: store.state.css,
        regular: store.state.regular,
        timeoutId: 0,
        order: {}
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

      if (!parseInt(this.form.amount)) {
        this.form.amount = 0
        this.form.recurring_data.amount = 0
      }
      if (this.regular.insert) {
        this.form.recurring = 'y'
      }
      if (!this.router.method) {
        this.router.page = 'payment-method'
        this.router.method = this.options.methods[0]
      }

      let self = this
      sendRequest('api.checkout.cards', 'get', {}).then(self.cardsSuccess, function () {})
      sendRequest('api.checkout.info', 'get', self.form).then(self.infoSuccess, function () {})
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
//        this.errors.clear()
          console.log('form', this.form)

          if (!this.errors.count() && !this.state.loading) {
            this.state.loading = true
            this.error.flag = false
            this.form.payment_system = this.router.system || this.router.method

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
            form.custom = custom

            let self = this
            sendRequest('api.checkout.form', 'request', form).finally(function () {
              self.state.loading = false
            }).then(self.submitSuccess, self.submitError)
          }
        })
      },
      submitSuccess: function (model) {
        let order = model.attr('order');
        if (!order) return;
        if (model.sendResponse()) return;
        if (model.needVerifyCode()) {
          this.router.page = 'verify'
          this.router.method = 'card'
          this.router.system = 'verify'
          this.form.token = order.token
        } else
        if (!model.submitToMerchant()) {
          this.order = order.order_data
          this.router.page = 'success'
        }
      },
      submitError: function () {},
      cardsSuccess: function (model) {
        this.state.cards = Object.values(model.data)
//        this.state.cards = [{
//          card_number: '4444 55XX XXXX 6666',
//          expiry_date: '12 / 17',
//          email: 'asd@asd.asd',
//          hash: '725272f6b133a2a9357f413fed91138bb0bf1893'
//        },
//        {
//          card_number: '4444 55XX XXXX 1111',
//          expiry_date: '11 / 19',
//          email: 'test@asd.asd',
//          hash: '4e1ec8228e78bd2900774d61ca63eaa0ffd3c'
//        }]
        if (this.state.cards.length) {
          store.setCardNumber(this.state.cards[0])
        }
      },
      infoSuccess: function (model) {
        let info = model.data
        let order = model.attr('order_data')
        if (order) {
          this.form.amount = order.amount
          this.form.recurring_data.amount = order.amount
          this.form.currency = order.currency
          this.form.merchant_id = order.merchant_id
          this.form.fee = info.order.fee || 0
        } else {
          this.form.fee = info.client_fee || 0
        }
        this.options.email = info.checkout_email_required

        if (this.form.fee) {
          let self = this
          return sendRequest('api.checkout.fee', 'get', self.form, String(self.form.amount) + String(self.form.fee)).then(
            function (model) {
              self.form.amount_with_fee = parseInt(model.attr('amount_with_fee'))
            }, function () {})
        }

        this.options.title = this.options.title || model.attr('merchant.localized_name')
        this.options.offer = model.attr('merchant.offerta_url')
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
