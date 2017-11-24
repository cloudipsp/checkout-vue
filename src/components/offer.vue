<template>
  <div class="f-offer" :class="{'f-has-error': errors.has('offer')}">
    <tooltip :text="errors.first('offer')" :enable="errors.has('offer')" target="#f-offer">
      <input
        name="offer"
        v-model="form.offer"
        v-validate="'required'"
        data-vv-as="оферта"
        type="checkbox"
        class="f-checkbox"
        id="f-offer"
      />
      <label for="f-offer">Я согласен с <a href="">условиями оферты</a></label>
    </tooltip>
  </div>
</template>

<script>
  import store from '@/store'
  import Tooltip from '@/components/tooltip'

  export default {
    inject: ['$validator'],
    data () {
      return {
        form: store.state.form
      }
    },
    components: {
      Tooltip
    }
  }
</script>
