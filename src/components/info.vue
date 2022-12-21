<template>
  <div v-if="verification_type">
    <div class="f-merchant-name" v-text="$t('verification_t')" />
    <div
      class="f-order-desc"
      v-text="$t('verification_' + verification_type + '_d')"
    />
  </div>
  <div v-else>
    <div v-if="showTitle" class="f-merchant-name" v-text="$t(title)" />
    <div v-if="link" class="f-merchant-url">
      <a :href="link" target="_blank">{{ link }}</a>
    </div>
    <f-preloader :condition="showOrderDesc" size="xs" class="f-order-desc">
      <div ref="wrapper" :class="classOrderDesc">
        <div ref="desc">{{ order_desc_translation }}</div>
      </div>
      <button
        v-if="showMore"
        class="f-order-desc-more f-btn-unstyled"
        type="button"
        @click="clickMore"
      >
        <span v-text="$t('see_more')" /> <f-svg name="angle-right" />
      </button>
    </f-preloader>
    <f-modal-base v-model="modalMore" :title="$t('order_details')" size="xl">
      <span v-text="$t(order_desc)" />
    </f-modal-base>
  </div>
</template>

<script>
import FPreloader from '@/components/preloader'
import FSvg from '@/components/svg'
import { mapState } from '@/utils/store'

export default {
  components: {
    FPreloader,
    FSvg,
  },
  data() {
    return {
      more: false,
      modalMore: false,
    }
  },
  computed: {
    ...mapState(['order']),
    ...mapState('options', ['title', 'link', 'hide_button_title']),
    ...mapState('params', ['order_desc', 'verification_type', 'button']),
    showTitle() {
      return this.title && (this.button ? !this.hide_button_title : true)
    },
    showOrderDesc() {
      return this.order_desc && this.order_desc !== ' '
    },
    order_desc_translation() {
      this.nextResize()
      return this.$t(this.order_desc)
    },
    showMore() {
      return this.more && !this.verification_type
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
