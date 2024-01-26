<template>
  <div v-if="isBreakpointDownLg">
    <div :class="$style.spinner">
      <f-loading :class="$style.spin" />
    </div>
    <h2 :class="$style.h2">
      {{ useAfterT }}
      <span :class="$style.monobank">monobank</span>
      {{ useBeforeT }}
    </h2>
    <div :class="$style.mobile">
      <f-mobile-light />
    </div>
  </div>
  <f-loading-monobank-lg v-else />
</template>

<script>
import FLoading from '@/svg/loading.svg'
import FMobileLight from '@/svg/mobile.svg'
import FLoadingMonobankLg from '@/views/checkout/loading-monobank-lg'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FLoading,
    FMobileLight,
    FLoadingMonobankLg,
  },
  mixins: [resizeMixin],
  computed: {
    useSplit() {
      return this.$t('use_monobank_application').split('monobank')
    },
    useAfterT() {
      return this.useSplit[0]
    },
    useBeforeT() {
      return this.useSplit[1]
    },
  },
}
</script>

<style lang="scss" module>
.spinner {
  text-align: center;
  margin-bottom: px-to-rem(40px);
}

.spin {
  animation: f-svg-spin 2s infinite linear;
}

.h2 {
  font-weight: 800;
  font-size: px-to-rem(28px);
  line-height: px-to-rem(34px);
  text-align: center;
  margin-top: 0;
  margin-bottom: px-to-rem(40px);

  :global(.f-theme-light) & {
    color: #9ca7b3;
  }

  :global(.f-theme-dark) & {
    color: #838688;
  }
}

.monobank {
  :global(.f-theme-light) & {
    color: #3d3d3d;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}

.mobile {
  text-align: center;
  margin-bottom: px-to-rem(48px);
}

@keyframes f-svg-spin {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(1turn);
  }
}
</style>
