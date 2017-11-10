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
    watch: {
      'form.amount': function (v) {
        let self = this
        if (v && this.form.fee) {
          sendRequest('api.checkout.fee', 'get', self.form).then(
            function (model) {
              self.form.amount_with_fee = model.data.amount_with_fee
            },
            function (model) {})
        }
      }
    }
  }
</script>
