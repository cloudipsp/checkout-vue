<template>
  <div class="f-offer" :class="{'has-error': errors.has('offer')}">
    <input name="offer" v-validate="'required'" type="checkbox" class="f-checkbox" id="f-offer"/>
    <label for="f-offer">Я согласен с <a href="">условиями оферты</a></label>
    <div v-if="errors.has('offer')" class="f-error">{{ errors.first('offer') }}</div>
  </div>
</template>

<script>
  export default {
    inject: ['$validator'],
    data () {
      return {}
    }
  }
</script>

<style lang="less">
  .f-offer {
    position: relative;
    text-align: center;
  }
</style>
