<template>
  <f-modal-base visible no-close-on-esc no-close-on-backdrop hide-header-close>
    <template #title>
      <svg-decline />
      <h5 class="f-modal-title" v-text="$t(`${$route.query.error}_title`)" />
    </template>

    <p class="f-text-center" v-text="$t(`${$route.query.error}_text`)" />
  </f-modal-base>
</template>

<script>
import SvgDecline from '@/svg/decline'

export default {
  components: {
    SvgDecline,
  },
}
</script>
