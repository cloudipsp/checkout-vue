<template>
  <div :class="$style.style">
    <div :class="$style.mb_48" v-text="$t('c2p_card_add_loading_top')" />
    <f-loading-default :class="$style.mb_48" />
    <div v-text="$t('c2p_card_add_loading_bottom')" />
  </div>
</template>

<script>
import { FLoadingDefault } from '@/import'

export default {
  components: {
    FLoadingDefault,
  },
}
</script>

<style lang="scss" module>
.style {
  font-size: px-to-rem(14px);
  font-weight: 400;
  line-height: px-to-rem(20px);
  text-align: center;

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.mb_48 {
  margin-bottom: px-to-rem(48px);
}
</style>
