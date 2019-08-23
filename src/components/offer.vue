<template>
  <div v-if="show" class="f-offer">
    <div class="f-block-sm">
      <input-checkbox name="offer" :validate="'required'">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="$t('offer_t', [options.offerta_url])" />
      </input-checkbox>
    </div>
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
    show() {
      return this.options.offerta_url
    },
  },
}
</script>
