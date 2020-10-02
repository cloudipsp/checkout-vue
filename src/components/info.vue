<template>
  <div class="f-info">
    <div v-if="title" v-t="title" class="f-merchant-name" />
    <div v-if="link" class="f-merchant-url">
      <a :href="link" target="_blank">{{ link }}</a>
    </div>
    <div v-if="order_desc" class="f-order-desc">
      <div ref="wrapper" class="f-order-desc-text">
        <span ref="desc">{{ order_desc_translation }}</span>
      </div>
      <a
        v-if="showMore"
        class="f-order-desc-more"
        href="#"
        @click.prevent="clickMore"
      >
        <span v-t="'see_more'" /> <f-svg name="angle-right" />
      </a>
    </div>
    <f-modal-base v-model="modalMore" :title="$t('order_details')" size="xl">
      <span v-t="order_desc" />
    </f-modal-base>
    <f-price />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FPrice from '@/components/price'

export default {
  components: {
    FPrice,
  },
  data() {
    return {
      showMore: false,
      modalMore: false,
    }
  },
  computed: {
    ...mapState('options', ['title', 'link']),
    ...mapState('params', ['order_desc']),
    order_desc_translation() {
      this.nextResize()
      return this.$t(this.order_desc)
    },
  },
  methods: {
    clickMore() {
      this.modalMore = true
    },
    nextResize() {
      this.$nextTick().then(this.resize)
    },
    resize() {
      this.showMore = false

      if (!this.$refs.wrapper) return
      if (!this.$refs.desc) return
      if (this.$refs.wrapper.offsetHeight >= this.$refs.desc.offsetHeight)
        return

      this.showMore = true
    },
  },
}
</script>
