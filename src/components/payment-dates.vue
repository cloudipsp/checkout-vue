<template>
  <div>
    <div class="title">Даные платежа</div>
    <div class="block">
      <h5 class="block-title">Назначение платежа</h5>
      <p>Благотворительная помощь (ребенку или отделению гематологии, или отделению плановой хирургии с онкологическими койками днепропетровской областной детской клинической больницы)</p>
    </div>
    <div class="block">
      <div>Сумма платежа: 500 UAH</div>
      <div>Комиссия: 10 UAH</div>
      <div><b>Всего: 510 UAH</b></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'payment-dates',
    data () {
      return {}
    }
  }
</script>

<style lang="less">
  .block{
    padding: 10px 5px;
    border-bottom: 2px solid rgba(61,61,61,0.06);
    color: #A9A9A9;
  }
  .block-title{
    opacity: 0.8;
    color: #3D3D3D;
    font-size: 14px;
    font-weight: 500;
  }
</style>
