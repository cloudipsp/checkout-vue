<template>
  <transition name="f-fade-enter">
    <div v-show="show" class="f-btn-pay-wallet">
      <div class="f-wallet-pay-button" :class="classButton" />
      <div
        v-if="showTitle"
        class="f-wallet-pay-title"
        v-text="$t('other_payment_method')"
      />
    </div>
  </transition>
</template>

<script>
import { loadCheckout } from '@/import'
import { api } from '@/utils/api'
import { mapState } from '@/utils/store'
import { idMixin, props as idProps } from '@/mixins/id'
import timeout from '@/mixins/timeout'
import { errorHandler } from '@/utils/helpers'

export default {
  mixins: [idMixin, timeout],
  inject: ['formRequest'],
  props: {
    ...idProps,
    showTitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      init: false,
    }
  },
  computed: {
    ...mapState('params', ['amount', 'email', 'custom', 'customer_data']),
    ...mapState('options', [
      'api_domain',
      'endpoint',
      'theme',
      'disable_request',
    ]),
    classButton() {
      return 'f-wallet-pay-button-' + this.safeId()
    },
    show() {
      return this.init
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

      this.timeout(this.update, 100)
    },
    email: 'changeParams',
    custom: {
      handler: 'changeParams',
      deep: true,
    },
    customer_data: {
      handler: 'changeParams',
      deep: true,
    },
  },
  mounted() {
    this.$nextTick().then(this.loadCheckout)
  },
  methods: {
    loadCheckout() {
      if (this.disable_request) return

      loadCheckout().then(this.initButton)
    },
    initButton($checkout) {
      if (this.disable_request) return

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
          this.$root.$emit('show-pay')
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
      this.formRequest(model.data).catch(errorHandler)
    },
    changeParams() {
      if (!this.show) return

      this.button.utils.extend(this.button.params, {
        data: this.store.formParams(),
      })
    },
  },
}
</script>
