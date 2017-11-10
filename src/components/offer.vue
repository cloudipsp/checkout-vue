<template>
  <div class="f-offer" :class="{'has-error': errors.has('offer')}">
    <tooltip :text="errors.first('offer')" :enable="errors.has('offer')" target="#f-offer">
      <input name="offer" v-model="form.offer" v-validate="'required'" type="checkbox" class="f-checkbox" id="f-offer"/>
      <label for="f-offer">Я согласен с <a href="">условиями оферты</a></label>
      <!--<div v-if="errors.has('offer')" class="f-error">{{ errors.first('offer') }}</div>-->
    </tooltip>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    inject: ['$validator'],
    data () {
      return {
        form: store.state.form
      }
    }
  }
</script>
