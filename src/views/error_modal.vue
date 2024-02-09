<template>
  <f-modal-base visible no-close-on-esc no-close-on-backdrop hide-header-close>
    <template #title>
      <svg-decline :slass="$style.svg" />
      <h5 class="f-modal-title" v-text="$t(`${$route.query.error}_title`)" />
    </template>

    <p class="f-text-center" v-text="$t(`${$route.query.error}_text`)" />
  </f-modal-base>
</template>

<script>
import SvgDecline from '@/svg/decline.svg'

export default {
  components: {
    SvgDecline,
  },
}
</script>

<style lang="scss" module>
.svg {
  margin: px-to-rem(-16px) 0;
}
</style>
