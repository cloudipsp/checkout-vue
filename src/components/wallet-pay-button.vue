<template>
  <div v-show="show" class="f-wallet-pay-button" :class="classWrapper">
    <div :class="classWrapperSm">
      <slot :open="open" :classButton="classButton">
        <div :class="classButton"></div>
      </slot>
    </div>
  </div>
</template>

<script>
import $checkout from 'ipsp-js-sdk/dist/checkout'

export default {
  inject: ['formRequest'],
  props: {
    position: {
      type: String,
      default: '',
    },
    tab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      timeout: null,
      id: null,
      show: false,
    }
  },
  computed: {
    isInit() {
      return (
        this.position === this.options.wallet_pay_button[this.tab].position &&
        this.options.wallet_pay_button[this.tab].display
      )
    },
    isTop() {
      return this.position === 'top'
    },
    isBottom() {
      return this.position === 'bottom'
    },
    isMenu() {
      return this.tab === 'menu'
    },
    isWallets() {
      return this.tab === 'wallets'
    },
    theme() {
      return this.options.wallet_pay_button[this.tab].theme
    },
    text() {
      return this.options.wallet_pay_button[this.tab].text
    },
    amount() {
      return this.store.state.params.amount
    },
    color() {
      let result = ''
      if (this.theme === 'dark') {
        result = 'black'
      }
      if (this.theme === 'light') {
        result = 'white'
      }
      return result
    },
    type() {
      return this.text ? 'long' : 'short'
    },
    classWrapper() {
      return {
        'f-block-hr': this.isTop,
        'f-block': this.isTop || this.isMenu,
        'f-mt-20': !(this.isMenu || this.isWallets) && this.isBottom,
      }
    },
    classWrapperSm() {
      return {
        'f-block-sm': !this.isMenu && this.isTop,
      }
    },
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
    if (!this.isInit) return

    this.id = this._uid

    this.$nextTick(function() {
      this.initButton()
    })
  },
  methods: {
    initButton() {
      this.button = $checkout
        .get('PaymentButton', {
          element: '.' + this.classButton,
          origin: 'https://' + this.store.state.options.api_domain,
          style: {
            type: this.type,
            color: this.color,
            height: 55,
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
    open() {
      this.button.click()
    },
    process(model) {
      this.formRequest(model.data)
    },
  },
}
</script>
