<template>
  <div :class="$style.wrapper">
    <div
      v-if="disable_request"
      :class="$style.title"
      v-text="$t('demo-title')"
    />
    <div v-if="mode_test" :class="$style.title" v-text="$t('mode-test')" />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState(['mode_test']),
    ...mapState('options', ['disable_request']),
  },
}
</script>

<style lang="scss" module>
.wrapper {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 1;
  display: block;
  height: px-to-rem(16px);
  content: '';
  border-top: 2px solid $main;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(xl) {
      border-radius: px-to-rem(16px) px-to-rem(16px) 0 0;
    }
  }
}

.title {
  position: absolute;
  left: 50%;
  padding: px-to-rem(1px) px-to-rem(16px);
  font-size: px-to-rem(14px);
  font-weight: 500;
  color: $white;
  background: $main;
  border-radius: 0 0 px-to-rem(8px) px-to-rem(8px);
  transform: translateX(-50%);
}
</style>
