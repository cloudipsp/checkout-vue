<script>
  import store from '@/store'
  import { sendRequest } from '@/helpers'

  export default {
    template: '#f-fields',
    inject: ['$validator'],
    data () {
      return {
        form: store.state.form
      }
    },
    computed: {
      amount: {
        get: function () {
          let amount = parseInt(this.form.amount)
          return amount ? amount / 100 : ''
        },
        set: function (v) {
          if (v.slice(-1) === '.') {
            return false
          }
          this.form.amount = Math.round(parseFloat(v).toFixed(2) * 100) || 0
          this.$validator.validate('amount', v)
          let self = this
          if (v && this.form.fee) {
            sendRequest('api.checkout.fee', 'get', self.form, String(self.form.amount) + String(self.form.fee)).then(
              function (model) {
                self.form.amount_with_fee = parseInt(model.data.amount_with_fee)
              },
              function (model) {})
          }
        }
      }
    }
  }
</script>
