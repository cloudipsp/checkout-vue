<template>
  <div v-if="show" class="f-offer">
    <div class="f-block-sm">
      <input-checkbox name="offer" :validate="'required'">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="html" />
      </input-checkbox>
    </div>
  </div>
</template>

<script>
import InputCheckbox from '@/components/input-checkbox'

export default {
  components: {
    InputCheckbox,
  },
  computed: {
    show() {
      return this.store.state.options.offerta_url
    },
    html() {
      return this.$t('offer_t', [this.store.state.options.offerta_url])
    },
  },
}
</script>
