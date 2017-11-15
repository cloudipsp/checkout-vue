<script>
  import store from '@/store'
  import { sendRequest } from '@/helpers'

  export default {
    template: '#f-fields',
    data () {
      return {
        form: store.state.form
      }
    },
    methods: {
      onInput: function (v) {
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
</script>
