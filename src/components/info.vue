<template>
  <div>
    <div class="f-block-hr f-title hidden-xs hidden-sm">Даные платежа</div>
    <div class="f-block f-block-hr">
      <h5 class="f-block-title">{{ options.title }}</h5>
      <p v-if="form.order_desc">{{ form.order_desc }}</p>
      <p v-if="options.link"><a :href="options.link" target="_blank">{{ options.link }}</a></p>
    </div>
    <div v-if="form.fee" class="f-block f-block-hr hidden-xs hidden-sm">
      <div>Сумма платежа: {{form.amount}} {{form.currency}}</div>
      <div>Комиссия: <span v-if="getFee">{{getFee}} {{form.currency}}</span> <span v-if="form.fee">({{ form.fee }} %)</span></div>
    </div>
    <div class="hidden-xs hidden-sm">
      <i class="f-icon f-icon-block security"></i>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    props: ['options'],
    data () {
      return {
        form: store.state.form
      }
    },
    computed: {
      getFee: function () {
        if (!this.form.amount) {
          return false
        }
        return this.form.amount_with_fee ? (parseFloat(this.form.amount_with_fee) - parseFloat(this.form.amount)).toFixed(2) : false
      }
    }
  }
</script>
