<template>
  <f-popover
    :title="error.code"
    :content="error.message"
    trigger="manual"
    :value="value"
  >
    <div class="f-center-error" />
  </f-popover>
</template>

<script>
import Resize from '@/mixins/resize'
import { mapState } from '@/utils/store'

export default {
  mixins: [Resize],
  data() {
    return {
      show: true,
    }
  },
  computed: {
    ...mapState(['error']),
    value() {
      return this.error.show && this.show
    },
  },
  methods: {
    resize() {
      if (!this.error.show) return
      this.show = false

      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        this.show = true
      }, 150)
    },
  },
}
</script>
