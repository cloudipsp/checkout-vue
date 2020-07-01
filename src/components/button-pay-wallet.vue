<template>
  <div v-show="show">
    <div class="f-wallet-pay-button" :class="classButton" />
    <div v-if="title" class="f-wallet-pay-title">
      Or use another payment method
    </div>
  </div></template
>

<script>
import $checkout from 'ipsp-js-sdk/dist/checkout'
import { api } from '@/utils/helpers'
import { mapState } from '@/utils/store'
import id from '@/mixins/id'

export default {
  mixins: [id],
  inject: ['formRequest'],
  props: {
    title: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeout: null,
      show: false,
    }
  },
  computed: {
    ...mapState(['css']),
    ...mapState('params', ['amount']),
    ...mapState('options', ['api_domain']),
    classButton() {
      return 'f-wallet-pay-button-' + this.id
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
          style: {
            type: 'short', // short long
            color: 'black', // black white
            height: 44,
          },
          data: this.store.formParams(),
        })
        .process(this.process)
        .on('show', () => {
          this.show = true
        })
        .on('hide', () => {
          this.show = false
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
