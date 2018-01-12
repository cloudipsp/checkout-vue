<template>
  <div class="f-info-wrapper">
    <div class="f-block-hr f-title f-visible-desktop" v-t="'info'"></div>
    <div v-if="options.title || form.order_desc || options.link" class="f-block f-block-hr">
      <div v-if="options.title" class="f-block-title" v-t="options.title"></div>
      <div v-if="form.order_desc" v-t="form.order_desc"></div>
      <div v-if="options.link"><a :href="options.link" target="_blank">{{ options.link }}</a></div>
    </div>
    <div v-if="options.fee" class="f-block f-block-hr">
      <div><span v-t="'amount'"></span> {{ minAmount }} <span v-t="form.currency"></span></div>
      <div v-if="form.fee"><span v-t="'fee'"></span> <span v-if="minFee">{{minFee}} <span v-t="form.currency"></span></span> <span v-if="fee">({{ fee }})</span></div>
    </div>
    <div class="f-visible-desktop">
      <i class="f-icon f-icon-block f-i-security"></i>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    data () {
      return {
        options: store.state.options,
        form: store.state.form
      }
    },
    computed: {
      minFee: function () {
        let amount = parseInt(this.form.amount)
        let amountWithFee = parseInt(this.form.amount_with_fee)
        if (!amount) {
          return false
        }
        return amountWithFee ? (amountWithFee - amount) / 100 : false
      },
      minAmount: function () {
        let amount = parseInt(this.form.amount)
        return amount / 100
      },
      fee: function () {
        let current = Number(this.form.fee)
        return current ? parseFloat(String(current * 100)).toFixed(2).concat('%') : 0
      }
    }
  }
</script>
