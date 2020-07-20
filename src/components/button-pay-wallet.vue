<template>
  <div v-show="show" class="f-btn-pay-wallet">
    <div class="f-wallet-pay-button" :class="classButton" />
    <div
      v-if="showTitle"
      v-t="'other_payment_method'"
      class="f-wallet-pay-title"
    />
  </div>
</template>

<script>
import $checkout from 'ipsp-js-sdk/dist/checkout'
import { api } from '@/utils/helpers'
import { mapState } from '@/utils/store'
import id from '@/mixins/id'
import Resize from '@/mixins/resize'

export default {
  mixins: [id, Resize],
  inject: ['formRequest'],
  props: {
    position: {
      type: String,
      required: true,
      validator: value => ['sidebar', 'center'].includes(value),
    },
  },
  data() {
    return {
      timeout: null,
      init: false,
    }
  },
  computed: {
    ...mapState(['css', 'isOnlyCard']),
    ...mapState('params', ['amount']),
    ...mapState('options', ['api_domain', 'endpoint', 'theme']),
    classButton() {
      return 'f-wallet-pay-button-' + this.id
    },
    showTitle() {
      return this.position === 'sidebar'
    },
    show() {
      return this.init
        ? this.position === 'center'
          ? this.isOnlyCard && this.isTablet
          : true
        : false
    },
    color() {
      let result = ''
      if (this.theme.type === 'light') {
        result = 'black'
      }
      if (this.theme.type === 'dark') {
        result = 'white'
      }
      return result
    },
  },
  watch: {
    amount() {
      if (!this.show) return

      clearTimeout(this.timeout)

      this.timeout = setTimeout(this.update, 100)
    },
  },
  mounted() {
    this.$nextTick(function() {
      this.initButton()
    })
  },
  methods: {
    initButton() {
      this.button = $checkout
        .get('PaymentButton', {
          api,
          element: '.' + this.classButton,
          origin: 'https://' + this.api_domain,
          endpoint: this.endpoint,
          style: {
            type: 'short', // short long
            color: this.color,
            height: 44,
          },
          data: this.store.formParams(),
        })
        .process(this.process)
        .on('show', () => {
          this.init = true
        })
        .on('hide', () => {
          this.init = false
        })
    },
    update() {
      this.button.update({ data: this.store.formParams() })
    },
    process(model) {
      this.formRequest(model.data)
    },
  },
}
</script>
