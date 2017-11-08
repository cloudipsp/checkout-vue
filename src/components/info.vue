<template>
  <div>
    <div class="f-block-hr f-title hidden-xs hidden-sm">Даные платежа</div>
    <div class="f-block f-block-hr">
      <h5 class="f-block-title">{{ options.title }}</h5>
      <p v-if="options.params.order_desc">{{ options.params.order_desc }}</p>
      <p v-if="options.link"><a :href="options.link" target="_blank">{{ options.link }}</a></p>
    </div>
    <div v-if="options.params.commision" class="f-block f-block-hr hidden-xs hidden-sm">
      <div>Сумма платежа: {{options.params.amount}} {{options.params.currency}}</div>
      <div>Комиссия: {{options.params.commision}} {{options.params.currency}}</div>
    </div>
    <div class="hidden-xs hidden-sm">
      <i class="f-icon f-icon-block security"></i>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['options'],
    data () {
      return {}
    }
  }
</script>
