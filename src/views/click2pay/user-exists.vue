<template>
  <div v-if="show">user exists</div>
</template>

<script>
import { getSrcProfile } from '@/click2pay'

export default {
  data() {
    return {
      show: false,
    }
  },
  created() {
    getSrcProfile()
      .then(() => {
        this.show = true
      })
      .catch(() => {})
  },
}
</script>
