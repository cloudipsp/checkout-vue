<script>
  import PaymentSystems from '@/mixins/payment-systems'

  export default {
    mixins: [PaymentSystems],
    data () {
      return {
        name: 'f-ibank',
        title: 'Выберите ваш банк:',
        active: '',
        config: {
          p24: {
            icon: 'p24',
            name: 'Приват 24'
          },
          platba24: {
            icon: 'platba24',
            name: 'Платба 24'
          },
          raiffeisen: {
            icon: 'raiffeisen',
            name: 'Райффайзен Банк Аваль'
          }
        }
      }
    }
  }
</script>
