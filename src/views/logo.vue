<template>
  <div :class="$style.style">
    <svg-logo :class="$style.svg" />
  </div>
</template>

<script>
import SvgLogo from '@/svg/logo.svg'

export default {
  components: {
    SvgLogo,
  },
}
</script>

<style lang="scss" module>
.style {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 0 50%;
  background-size: contain;

  :global(.f-theme-light) & {
    color: #000;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}

.svg {
  height: px-to-rem(24px);
}
</style>
