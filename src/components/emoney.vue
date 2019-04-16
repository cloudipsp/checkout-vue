<script>
import PaymentSystems from '@/mixins/payment-systems'
import config from '@/config/payment-systems'

export default {
  mixins: [PaymentSystems],
  data() {
    return {
      config: config.emoney,
    }
  },
}
</script>
