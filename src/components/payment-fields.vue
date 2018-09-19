<script>
  import { sendRequest } from '@/utils/helpers'
  import InputText from '@/components/input-text'
  import InputAmount from '@/components/input-amount'
  import InputHidden from '@/components/input-hidden'

  export default {
    template: '#f-fields',
//    render: function (h) {
//      if (this.template) {
//        return this.template()
//      }
//    },
//    created: function () {
//      let el = document.querySelector('#f-fields')
//      this.html = el && el.innerHTML
//      this.template = Vue.compile('<div v-html="html"></div>').render;
//    },
    data () {
      return {
      }
    },
    watch: {
      'params.amount' () {
        this.store.getAmountWithFee()
      }
    },
    components: {
      InputText,
      InputAmount,
      InputHidden
    }
  }
</script>
