<template>
  <div class="f-info">
    <div v-t="'info'" class="f-block-hr f-title f-visible-desktop" />
    <div v-if="show" class="f-block f-block-hr">
      <div v-if="title" v-t="title" class="f-block-title" />
      <div v-if="order_desc" v-t="order_desc" />
      <div v-if="link">
        <a :href="link" target="_blank">{{ link }}</a>
      </div>
    </div>
    <f-fee class="f-block f-block-hr" />
    <div class="f-visible-desktop">
      <i class="f-icon f-icon-block f-i-security" />
    </div>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FFee from '@/components/fee'

export default {
  components: {
    FFee,
  },
  computed: {
    ...mapState('options', ['title', 'link']),
    ...mapState('params', ['order_desc']),
    show() {
      return !!(this.title || this.order_desc || this.link)
    },
  },
}
</script>
