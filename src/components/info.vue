<template>
  <div>
    <div class="f-block-hr f-title f-visible-desktop">Даные платежа</div>
    <div class="f-block f-block-hr">
      <h5 class="f-block-title">{{ options.title }}</h5>
      <p v-if="form.order_desc">{{ form.order_desc }}</p>
      <p v-if="options.link"><a :href="options.link" target="_blank">{{ options.link }}</a></p>
    </div>
    <div v-if="form.fee" class="f-block f-block-hr f-visible-desktop">
      <div>Сумма платежа: {{ minAmount }} {{form.currency}}</div>
      <div>Комиссия: <span v-if="minFee">{{minFee}} {{form.currency}}</span> <span v-if="fee">({{ fee }})</span></div>
    </div>
    <div class="f-visible-desktop">
      <i class="f-icon f-icon-block security"></i>
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
