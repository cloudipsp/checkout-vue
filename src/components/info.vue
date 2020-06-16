<template>
  <div class="f-info">
    <div v-if="show">
      <div v-if="title" v-t="title" class="f-merchant-name" />
      <div v-if="link" class="f-merchant-url">
        <a :href="link" target="_blank">{{ link }}</a>
      </div>
      <div v-if="order_desc" v-t="order_desc" class="f-order-desc" />
    </div>
    <f-fee />
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
