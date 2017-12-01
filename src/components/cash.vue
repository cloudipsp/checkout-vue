<script>
  import PaymentSystems from '@/mixins/payment-systems'

  export default {
    mixins: [PaymentSystems],
    data () {
      return {
        config: {
          liqpay: {
            icon: 'liqpay',
            name: 'LiqPay'
          }
        }
      }
    }
  }
</script>
