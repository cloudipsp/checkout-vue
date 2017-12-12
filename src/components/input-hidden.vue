<script>
  import Input from '@/mixins/input'

  export default {
    render: function (h) {
      return h()
    },
    mixins: [Input],
    props: {
      value: String
    },
    data () {
      return {}
    },
    created: function () {
      this.form[this.field_] = this.value
    }
  }
</script>
