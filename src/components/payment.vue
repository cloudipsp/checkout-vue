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
      <methods :methods="options.methods" :fast="fast" :on-change-method="changeMethod"></methods>
    </div>
    <div class="f-center" ref="center">
      <fields v-if="options.fields" :form="form"></fields>
      <router-view :options="options" :on-submit="submit" :form="form" :valid="!this.errors.items.length" :order="order"></router-view>
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
  import Fields from './payment-fields'
  import Verify from './verify'
  import $checkout from 'ipsp-js-sdk/dist/checkout'

  export default {
    props: ['options', 'onSetMin'],
    data () {
      return {
        loading: false,
        show: false,
        form: {},
        error: {
          flag: false,
          buffer: false
        },
        timeoutId: 0,
        order: {}
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
      Object.assign(this.form, this.options.params)
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
      fast: function () {
        let fast = []
        this.options.fast.forEach(function (system) {
          ['emoney', 'ibank', 'cash'].forEach(function (method) {
            if (this.options[method].indexOf(system) > -1) {
              fast.push({
                method: method,
                system: system
              })
            }
          }, this)
        }, this)
        return fast
      },
      isMin: function () {
        let result = this.options.methods.length === 1 && this.options.methods[0] === 'card'
        this.onSetMin(result)
        return result
      }
    },
    components: {
      Info,
      Methods,
      Fields,
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
          $checkout('Api').scope(function () {
            this.request('api.checkout.form', 'request', self.form)
              .done(function (model) {
                self.loading = false
                console.log('done', model)
                model.sendResponse()
                if (model.needVerifyCode()) {
//                  self.form.token =  model.attr('order.token')
                  self.$router.push({name: 'verify', params: {system: 'verify', token: model.attr('order.token')}})
                } else if (!model.submitToMerchant()) {
                  self.order = model.attr('order.order_data')
                  self.$router.push({name: 'success'})
                }
              })
              .fail(function (model) {
                console.log('fail', model)
                self.loading = false
                self.error.flag = true
                self.error.code = String(model.data.error.code)
                self.error.message = model.data.error.message
              })
          })
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
