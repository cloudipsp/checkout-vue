<template>
  <div v-if="show" :class="['f-offer', $style.wrapper]">
    <f-form-group
      v-model="offer"
      name="offer"
      component="checkbox"
      :rules="rules"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span v-html="html" />
    </f-form-group>
  </div>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  computed: {
    ...mapStateGetSet('params', ['offer', 'lang']),
    ...mapState('options', ['offerta_url']),
    show() {
      return this.url
    },
    rules() {
      return { required: true }
    },
    html() {
      return this.$t('offer_t', [this.url])
    },
    url() {
      return this.$te('offerta_url')
        ? this.$t('offerta_url')
        : (this.offerta_url || '').replace(/{lang}/g, this.lang)
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(20px);
}
</style>
