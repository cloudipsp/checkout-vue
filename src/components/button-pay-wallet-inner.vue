<template>
  <div v-show="show" class="f-wallet-pay-button" :class="classWrapper">
    <div :class="classWrapperSm">
      <slot :open="open" :classButton="classButton">
        <div :class="classButton" />
      </slot>
    </div>
  </div>
</template>

<script>
import $checkout from 'ipsp-js-sdk/dist/checkout'
import { api } from '@/utils/helpers'
import { mapState } from '@/utils/store'
import id from '@/mixins/id'
import timeout from '@/mixins/timeout'

export default {
  mixins: [id, timeout],
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
      init: false,
    }
  },
  computed: {
    ...mapState('params', ['amount']),
    ...mapState('options', ['api_domain']),
    ...mapState('options.wallet_pay_button', {
      text(state) {
        return state[this.tab].text
      },
      display(state) {
        return state[this.tab].display
      },
      theme(state) {
        return state[this.tab].theme
      },
      positionConfig(state) {
        return state[this.tab].position
      },
    }),
    isInit() {
      return this.position === this.positionConfig && this.display
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
    classButton() {
      return 'f-wallet-pay-button-' + this.id
    },
    show() {
      return this.init
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
  },
  watch: {
    amount() {
      if (!this.show) return

      this.timeout(this.update, 100)
    },
  },
  mounted() {
    if (!this.isInit) return

    this.$nextTick().then(this.initButton)
  },
  methods: {
    initButton() {
      this.button = $checkout
        .get('PaymentButton', {
          api,
          element: '.' + this.classButton,
          origin: 'https://' + this.api_domain,
          style: {
            type: this.type,
            color: this.color,
            height: 55,
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
    open() {
      this.button.click()
    },
    process(model) {
      this.formRequest(model.data)
    },
  },
}
</script>
