<template>
  <div :class="$style.wrapper">
    <div :class="$style.col">
      <f-monobank :class="$style.logo" />
      <!--eslint-disable vue/no-v-html-->
      <h2 :class="$style.h2">
        {{ useAfterT }}
        <span :class="$style.monobank">monobank</span>
        {{ useBeforeT }}
        <f-svg :class="$style.arrow" name="arrow-right" />
      </h2>
      <div :class="$style.spinner">
        <f-loading :class="$style.spin" />
      </div>
    </div>
    <div :class="$style.mobile">
      <f-mobile-light />
    </div>
  </div>
</template>

<script>
import FLoading from '@/svg/loading.svg'
import FMonobank from '@/svg/monobank.svg'
import FMobileLight from '@/svg/mobile.svg'
import FSvg from '@/components/svg'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FLoading,
    FMonobank,
    FMobileLight,
    FSvg,
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
.wrapper {
  display: flex;
  align-items: center;
  padding: 0 px-to-rem(80px);
}

.col {
  flex: 0 0 auto;
  width: 60%;
  max-width: 100%;
}

.logo {
  margin-bottom: px-to-rem(32px);

  :global(.f-theme-light) & {
    color: #000;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}

.spinner {
  text-align: center;
}

.spin {
  animation: f-svg-spin 2s infinite linear;
}

.h2 {
  font-weight: 800;
  font-size: px-to-rem(32px);
  line-height: px-to-rem(39px);
  text-align: left;
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

.arrow {
  :global(.f-theme-light) & {
    color: #000;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}

.mobile {
  text-align: center;
  flex: 0 0 auto;
  width: 40%;
  max-width: 100%;
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
