<template>
  <div class="f-info-wrapper">
    <div class="f-block-hr f-title f-visible-desktop" v-t="'info'"></div>
    <div v-if="options.title || params.order_desc || options.link" class="f-block f-block-hr">
      <div v-if="options.title" class="f-block-title" v-t="options.title"></div>
      <div v-if="params.order_desc" v-t="params.order_desc"></div>
      <div v-if="options.link"><a :href="options.link" target="_blank">{{ options.link }}</a></div>
    </div>
    <div v-if="options.fee" class="f-block f-block-hr">
      <div><span v-t="'amount'"></span> {{ amount }} <span v-t="params.currency"></span></div>
      <div v-if="params.fee">
        <span v-t="'fee'"></span> <span v-if="amount_fee">{{amount_fee}} <span v-t="params.currency"></span></span> <span v-if="fee">({{ fee }})</span>
      </div>
    </div>
    <div class="f-visible-desktop">
      <i class="f-icon f-icon-block f-i-security"></i>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      amount_fee: function () {
        let amount = parseInt(this.params.amount)
        let amountWithFee = parseInt(this.params.amount_with_fee)
        if (!amount || amountWithFee - amount < 0) {
          return false
        }
        return amountWithFee ? (amountWithFee - amount) / 100 : false
      },
      amount: function () {
        let amount = parseInt(this.params.amount)
        return amount / 100
      },
      fee: function () {
        let current = Number(this.params.fee)
        return current ? parseFloat(String(current * 100)).toFixed(2).concat('%') : 0
      }
    }
  }
</script>
