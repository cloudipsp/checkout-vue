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
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('options', ['offerta_url']),
    show() {
      return this.offerta_url
    },
    html() {
      return this.$t('offer_t', [this.offerta_url])
    },
  },
}
</script>
