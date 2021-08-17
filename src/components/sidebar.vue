<template>
  <div v-if="show" class="f-sidebar">
    <f-scrollbar-vertical wrap-class="f-sidebar-wrap">
      <f-sidebar-inner />
    </f-scrollbar-vertical>
  </div>
</template>

<script>
import FScrollbarVertical from '@/components/scrollbar-vertical'
import { FSidebarInner } from '@/import'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FScrollbarVertical,
    FSidebarInner,
  },
  mixins: [resizeMixin],
  computed: {
    show() {
      return !this.isBreakpointMd
    },
  },
}
</script>
