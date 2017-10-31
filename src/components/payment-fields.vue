<script>
  import ValidateChild from './validate-child'

  export default {
    name: 'fields',
    template: '#f-fields',
    mixins: [ValidateChild],
    data () {
      return {
        model: {}
      }
    }
  }
</script>

<style lang="less">
  .payment-fields{

  }
</style>
