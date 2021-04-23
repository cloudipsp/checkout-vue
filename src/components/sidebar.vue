<template>
  <div v-if="show" class="f-sidebar">
    <f-scrollbar-vertical wrap-class="f-sidebar-wrap">
      <f-menu />
    </f-scrollbar-vertical>
  </div>
</template>

<script>
import FScrollbarVertical from '@/components/scrollbar-vertical'
import { FMenu } from '@/import'
import Resize from '@/mixins/resize'

export default {
  components: {
    FScrollbarVertical,
    FMenu,
  },
  mixins: [Resize],
  computed: {
    show() {
      return !this.isBreakpointMd
    },
  },
}
</script>
