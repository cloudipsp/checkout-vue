<template>
  <div class="container">
    <checkout-header></checkout-header>
    <div class="container-fluid">
      <div class="row main">
        <div class="payment-dates col-md-3 col-md-push-9">
          <payment-dates></payment-dates>
        </div>
        <div class="payment-methods col-sm-4 col-md-3 col-md-pull-3">
          <payment-methods></payment-methods>
        </div>
        <div class="payment-form col-sm-8 col-md-6 col-md-pull-3">
          <payment-fields></payment-fields>
          <payment-form></payment-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CheckoutHeader from './checkout-header'
  import PaymentDates from './payment-dates'
  import PaymentMethods from './payment-methods'
  import PaymentForm from './payment-form'
  import PaymentFields from './payment-fields'

  export default {
    name: 'index',
    data () {
      return {}
    },
    components: {
      CheckoutHeader,
      PaymentDates,
      PaymentMethods,
      PaymentForm,
      PaymentFields
    }
  }
</script>

<style lang="less">
  .main{
    border: 1px solid #E0E8EF;
    border-radius: 8px;
    background-color: #FCFEFF;
    box-shadow: 0 16px 16px 0 rgba(0,0,0,0.04);
    min-height: 402px;
  }
  .payment-methods{

  }
  .payment-form {
    min-height: 400px;
    background: #fff;
    border-right: 2px solid rgba(61,61,61,0.06);
    border-left: 2px solid rgba(61,61,61,0.06);
  }
  .payment-dates{

  }
  .title{
    height: 66px;
    line-height: 64px;
    padding: 0 5px;
    opacity: 0.8;
    color: #3D3D3D;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 2px solid rgba(61,61,61,0.06);
  }
</style>
