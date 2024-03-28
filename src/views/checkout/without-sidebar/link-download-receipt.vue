<template>
  <div :class="$style.wrapper">
    <a :class="$style.link" :href="receipt_url" target="_blank" download>
      <span v-text="$t('download_receipt')" />
      <f-svg :class="$style.ml_4" name="download" :size="24" />
    </a>
  </div>
</template>

<script>
import FSvg from '@/components/svg'
import { mapState } from '@/utils/store'

export default {
  components: {
    FSvg,
  },
  computed: {
    ...mapState('order', ['receipt_url']),
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  margin-bottom: px-to-rem(24px);
}

.link {
  display: inline-flex;
  align-items: center;
}

.ml_4 {
  margin-left: px-to-rem(4px);
}
</style>
