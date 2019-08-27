<template>
  <div
    v-if="show"
    class="f-wallet-pay-button"
    :class="{ 'f-block-hr': isTop, 'f-block': isTop || isMenu }"
  >
    <div :class="{ 'f-block-sm': !isMenu && isTop }">
      <button :class="[$css.btn]" class="f-btn-block f-btn-dark" @click="click">
        {{ position }} {{ tab }}
      </button>
    </div>
  </div>
</template>

<script>
import { sendRequest } from '@/utils/helpers'

export default {
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
    return {}
  },
  computed: {
    show() {
      return (
        this.position === this.options.wallet_pay_button[this.tab].position &&
        this.options.wallet_pay_button[this.tab].display
      )
    },
    isTop() {
      return this.position === 'top'
    },
    isMenu() {
      return this.tab === 'menu'
    },
  },
  created() {
    if (!this.show) return

    sendRequest('api.checkout.kkh', 'get').then(model => {
      // console.log(model.attr('data.platform_os'))
      // console.log(model.attr('data.platform_type'))
      // console.log(model.attr('data.platform_name'))
    })
  },
  methods: {
    click() {
      console.log(1)
    },
  },
}
</script>
