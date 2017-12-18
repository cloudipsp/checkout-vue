<template>
  <div class="f-offer" :class="{'f-has-error': errors.has('offer')}">
    <tooltip :text="errors.first('offer')" :enable="errors.has('offer')" target="#f-offer">
      <input
        v-model="form.offer"
        v-validate="'required'"
        :data-vv-as="$t('offer')"
        data-vv-name="offer"
        type="checkbox"
        class="f-checkbox"
        id="f-offer"
      />
      <label :class="[css.cl]" for="f-offer" v-html="$t('offer_t', [options.offer])"></label>
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
        form: store.state.form,
        css: store.state.css,
        options: store.state.options,
      }
    },
    components: {
      Tooltip
    }
  }
</script>
