<template>
  <div id="app">
    <div class="container">
      <checkout-header></checkout-header>
      <div class="container-fluid">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
  import CheckoutHeader from './components/checkout-header'

  export default {
    data () {
      return {}
    },
    components: {
      CheckoutHeader
    }
  }
</script>

<style lang="less">
  @import './less/style.less';
</style>
