<template>
  <div v-if="show" class="f-offer">
    <f-form-group v-model="offer" component="checkbox" rules="required:true">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="html" />
    </f-form-group>
  </div>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  computed: {
    ...mapStateGetSet('params', ['offer']),
    ...mapState('options', ['offerta_url']),
    show() {
      return this.url
    },
    html() {
      return this.$t('offer_t', [this.url])
    },
    url() {
      return this.$te('offerta_url') ? this.$t('offerta_url') : this.offerta_url
    },
  },
}
</script>
