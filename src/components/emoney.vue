<script>
  import PaymentSystems from '@/mixins/payment-systems'

  export default {
    mixins: [PaymentSystems],
    data () {
      return {
        config: {
          paypal: {
            icon: 'paypal',
            name: 'PayPal'
          },
          qiwi: {
            icon: 'qiwi',
            name: 'QIWI'
          },
          webmoney: {
            icon: 'webmoney',
            name: 'WebMoney WebMoney WebMoney'
          },
          yamoney: {
            icon: 'yamoney',
            name: 'Яндекс.Деньги'
          }
        }
      }
    }
  }
</script>
