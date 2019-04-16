<template>
  <div class="f-offer" :class="[hasError ? $css.he : '']">
   <input-checkbox
      name="offer"
      :validate="'required'"
    ><span v-html="$t('offer_t', [options.offerta_url])"></span></input-checkbox>
  </div>
</template>

<script>
import Tooltip from '@/components/tooltip'
import InputCheckbox from '@/components/input-checkbox'

export default {
  inject: ['$validator'],
  data() {
    return {}
  },
  components: {
    Tooltip,
    InputCheckbox,
  },
  computed: {
    hasError() {
      let flag = this.$validator.flags['f-offer']
      return (
        this.errors.has('f-offer') &&
        ((flag && flag.touched) || this.store.state.submit)
      )
    },
  },
}
</script>
