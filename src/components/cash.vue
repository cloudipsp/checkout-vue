<script>
  import PaymentSystems from '@/components/payment-systems'

  export default {
    mixins: [PaymentSystems],
    data () {
      return {
        name: 'f-cash',
        title: 'Чем платить будете?',
        active: '',
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
