<template>
  <transition name="f-fade-enter">
    <f-button
      v-show="show"
      :class="classButton"
      :variant="variant"
      block
      @click="click"
    />
  </transition>
</template>

<script>
import FButton from '@/components/button/button'
import { loadCheckout } from '@/import'
import { api } from '@/utils/api'
import { mapState, mapStateGetSet } from '@/utils/store'
import { idMixin, props as idProps } from '@/mixins/id'
import { timeoutMixin } from '@/mixins/timeout'
import { errorHandler, key } from '@/utils/helpers'
import { btn, pay, wallet, variant } from '@/config/const'
import { setAttr, setStyle } from '@/utils/dom'

export default {
  components: {
    FButton,
  },
  mixins: [idMixin, timeoutMixin],
  inject: ['formRequest', 'validate'],
  props: {
    ...idProps,
  },
  data() {
    return {
      init: false,
    }
  },
  computed: {
    ...mapState('css_class', {
      variant: key(btn, pay, wallet, variant),
    }),
    ...mapState('params', ['amount']),
    ...mapState('options', ['api_domain', 'endpoint', 'disable_request']),
    ...mapStateGetSet(['can_make_payment', 'need_validate_card']),
    ...mapState(['has_fields', 'params']),
    ...mapStateGetSet('options', ['wallets_icons']),
    classButton() {
      return [
        'f-wallet-pay-button',
        `f-wallet-pay-button-${this.can_make_payment}-${this.variant}`,
      ]
    },
    show() {
      return this.init
    },
  },
  watch: {
    amount: 'update',
    params: {
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

      const div = document.createElement('div')
      setAttr(div, 'id', this.safeId())
      setStyle(div, 'display', 'none')
      this.$root.$el.appendChild(div)

      loadCheckout().then(this.initButton)
    },
    initButton($checkout) {
      if (this.disable_request) return

      this.button = $checkout
        .get('PaymentButton', {
          api,
          element: '#' + this.safeId(),
          origin: 'https://' + this.api_domain,
          endpoint: this.endpoint,
          data: this.store.formParams(),
        })
        .process(this.process)
        .on('show', () => {
          this.$root.$emit('show-pay')
          this.can_make_payment = this.button.method
          this.wallets_icons = [this.button.method]
          this.init = true
        })
        .on('hide', () => {
          this.init = false
        })
    },
    update(newValue, oldValue) {
      if (!newValue && !oldValue) return

      this.timeout(() => {
        this.button.update({ data: this.store.formParams() })
      }, 100)
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
    click() {
      if (this.has_fields) {
        this.need_validate_card = false
        this.$nextTick()
          .then(() => this.validate(false))
          .then(() => {
            this.button.click()
          })
          .finally(() => {
            this.need_validate_card = true
          })
          .catch(errorHandler)
      } else {
        this.button.click()
      }
    },
  },
}
</script>
