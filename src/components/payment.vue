<template>
  <div class="f-wrapper">
    <div v-if="!isMin" class="f-mobile-menu visible-xs">
      <button class="btn btn-default btn-sm" @click="show = !show"><i class="glyphicon glyphicon-th-large"></i>
        Другие способы
      </button>
    </div>
    <div class="f-info" ref="info">
      <info :options="options"></info>
    </div>
    <div v-if="!isMin" class="f-methods" :class="{open : show}">
      <methods :methods="options.methods" :fast="options.fast" :on-change-method="changeMethod"></methods>
    </div>
    <div class="f-center" ref="center">
      <router-view :options="options" :on-submit="submit" :valid="!this.errors.items.length" :order="order" :cards="cards"></router-view>
      <div v-if="loading">
        <div class="f-loading"></div>
        <div class="f-loading-i"></div>
      </div>
      <popover :title="error.code" trigger="manual" v-model="error.flag">
        <div class="f-center-error"></div>
        <div slot="popover">
          {{ error.message }}
        </div>
      </popover>
    </div>
  </div>
</template>

<script>
  import Info from './info'
  import Methods from './methods'
  import Verify from './verify'
  import { sendRequest } from '@/helpers'
  import store from '@/store'

  export default {
    props: ['options', 'onSetMin'],
    data () {
      return {
        loading: false,
        show: false,
        form: store.state.form,
        error: store.state.error,
        timeoutId: 0,
        order: {},
        cards: []
      }
    },
    watch: {
      options: {
        handler: function () {
          this.firstResize()
        },
        deep: true,
        immediate: true
      },
      '$route': 'firstResize'
    },
    created: function () {
      let self = this
      Object.assign(this.form, this.options.params)
      Object.assign(this.form.recurring_data, this.options.recurring_data)

      if (!parseInt(this.form.amount)) {
        this.form.amount = 0
        this.form.recurring_data.amount = 0
      }
      if (this.options.regular.insert) {
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

//          self.form.fee = 0.055
          if (self.form.fee) {
            return sendRequest('api.checkout.fee', 'get', self.form, String(self.form.amount) + String(self.form.fee)).then(
              function (model) {
                self.form.amount_with_fee = parseInt(model.data.amount_with_fee)
              }, function () {})
          }
        }, function () {})
      if (!this.$route.params.method) {
        this.$router.push({name: 'payment-method', params: {method: this.options.methods[0]}})
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
      }
    },
    components: {
      Info,
      Methods,
      Verify
    },
    $_veeValidate: {
      validator: 'new'
    },
    methods: {
      submit: function () {
        this.$validator.validateAll()
        this.autoFocus()
//        console.log('errors', this.errors.items)
//        console.log('fields', this.fields)
        console.log('form', this.form)
//      this.errors.clear()
        if (!(!this.errors.items.length && !this.loading)) {} else {
          this.loading = true
          this.error.flag = false
          this.form.payment_system = this.$route.params.system || this.$route.params.method
          this.form.token = this.$route.params.token
          let self = this
          sendRequest('api.checkout.form', 'request', self.form).finally(function () {
            self.loading = false
          }).then(
            function (model) {
              model.sendResponse()
              if (model.needVerifyCode()) {
                self.$router.push({name: 'verify', params: {system: 'verify', token: model.attr('order.token')}})
              } else if (!model.submitToMerchant()) {
                self.order = model.attr('order.order_data')
                self.$router.push({name: 'success'})
              }
            }, function () {})
        }
      },
      autoFocus: function () {
        if (this.errors.items.length) {
          let $firstErrorField = this.$el.querySelector('[data-vv-id=' + this.$validator.errors.items[0].id + ']')
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

        if (width >= 992) {
          this.$refs.center.style.minHeight = centerH < wraperH ? wraperH + 'px' : 'auto'
          if (containerH < height) {
            $container.style.paddingTop = (height - containerH) / 2 + 'px'
          }
        } else if (width >= 768 && !this.isMin) {
          this.$refs.center.style.minHeight = centerH < wraperH - infoH ? wraperH - infoH + 'px' : 'auto'
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
