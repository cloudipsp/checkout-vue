<template>
  <div class="f-info">
    <div v-if="title" class="f-merchant-name" v-text="$t(title)" />
    <div v-if="link" class="f-merchant-url">
      <a :href="link" target="_blank">{{ link }}</a>
    </div>
    <f-preloader :condition="showOrderDesc" size="xs" class="f-order-desc">
      <div ref="wrapper" :class="classOrderDesc">
        <span ref="desc">{{ order_desc_translation }}</span>
      </div>
      <a
        v-if="showMore"
        class="f-order-desc-more"
        href="#"
        @click.prevent="clickMore"
      >
        <span v-text="$t('see_more')" /> <f-svg name="angle-right" />
      </a>
    </f-preloader>
    <f-modal-base v-model="modalMore" :title="$t('order_details')" size="xl">
      <span v-text="$t(order_desc)" />
    </f-modal-base>
    <f-price v-if="showPrice" :readonly="readonly" />
  </div>
</template>

<script>
import FPreloader from '@/components/preloader'
import FSvg from '@/components/svg'
import FPrice from '@/components/price'
import { mapState } from '@/utils/store'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FPreloader,
    FSvg,
    FPrice,
  },
  props: {
    readonly: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      more: false,
      modalMore: false,
    }
  },
  computed: {
    ...mapState(['order']),
    ...mapState('options', ['title', 'link']),
    ...mapState('params', ['order_desc']),
    showOrderDesc() {
      return this.order_desc && this.order_desc !== ' '
    },
    order_desc_translation() {
      this.nextResize()
      return this.$t(this.order_desc)
    },
    verification_type() {
      return this.order.verification_type
    },
    showMore() {
      return this.more && !this.verification_type
    },
    showPrice() {
      return this.verification_type !== 'amount'
    },
    classOrderDesc() {
      return {
        'f-order-desc-text': !this.verification_type,
      }
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
      this.more = false

      if (!this.$refs.wrapper) return
      if (!this.$refs.desc) return
      if (this.$refs.wrapper.offsetHeight >= this.$refs.desc.offsetHeight)
        return

      this.more = true
    },
  },
}
</script>
