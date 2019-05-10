<template>
  <div class="f-offer" :class="[hasError ? $css.he : '']">
    <input-checkbox name="offer" :validate="'required'">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="$t('offer_t', [options.offerta_url])" />
    </input-checkbox>
  </div>
</template>

<script>
import InputCheckbox from '@/components/input-checkbox'

export default {
  inject: ['$validator'],
  components: {
    InputCheckbox,
  },
  data() {
    return {}
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
