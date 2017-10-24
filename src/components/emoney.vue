<script>
  import PaymentSystems from './payment-systems'

  export default {
    mixins: [PaymentSystems],
    data () {
      return {
        name: 'f-emoney',
        title: 'Выебрите платежный сервис из списка:',
        active: '',
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
