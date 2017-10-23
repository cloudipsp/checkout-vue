<template>
  <div class="f-dates">
    <div class="f-block f-block-hr f-title">Даные платежа</div>
    <div class="f-block f-block-hr">
      <h5 class="f-block-title">{{ info.title }}</h5>
      <p>{{ info.desc }}</p>
      <p v-if="info.link"><a :href="info.link" target="_blank">{{ info.link }}</a></p>
    </div>
    <div v-if="info.commision" class="f-block f-block-hr">
      <div>Сумма платежа: {{info.amount}} {{info.currency}}</div>
      <div>Комиссия: {{info.commision}} {{info.currency}}</div>
    </div>
    <div class="f-security">
      <img src="../assets/security.svg" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    props: ['info'],
    data () {
      return {}
    }
  }
</script>

<style lang="less">
  .f-dates {
    color: #A9A9A9;
  }
  .f-block-title{
    opacity: 0.8;
    color: #3D3D3D;
    font-size: 14px;
    font-weight: 500;
    margin-top: 0;
  }
  .f-security{
    padding: 15px 5px;
  }
</style>
