<template>
  <div class="f-offer text-center" :class="{'has-error': errors.has('offer') }">
    <input name="offer" v-validate="'required'" type="checkbox" class="f-checkbox" id="f-offer"/>
    <label for="f-offer">Я согласен с <a href="">условиями оферты</a></label>
  </div>
</template>

<script>
  import ValidateChild from './validate-child'

  export default {
    mixins: [ValidateChild],
    data () {
      return {}
    }
  }
</script>

<style lang="less">

</style>
