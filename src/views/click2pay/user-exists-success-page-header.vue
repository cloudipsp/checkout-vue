<template>
  <click2pay-header v-if="show" :class="$style.mb_16" :email-short="email" />
</template>

<script>
import Click2payHeader from '@/views/click2pay/header'
import { profiles } from '@/click2pay'

export default {
  components: {
    Click2payHeader,
  },
  data() {
    return {
      show: false,
      email: '',
    }
  },
  created() {
    profiles()
      .then(({ profiles }) => {
        this.show = true
        this.email = profiles[0].maskedConsumer.maskedEmailAddress
      })
      .catch(() => {})
  },
}
</script>

<style lang="scss" module>
.mb_16 {
  margin-bottom: px-to-rem(16px);
}
</style>
