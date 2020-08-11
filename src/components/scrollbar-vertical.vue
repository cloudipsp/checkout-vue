<template>
  <div class="f-scrollbar" :style="style">
    <div
      ref="wrap"
      class="f-scrollbar-wrap"
      :class="wrapClass"
      :style="styleWrap"
      @scroll="handleScroll"
    >
      <slot />
    </div>
    <div class="f-scrollbar-track">
      <div
        ref="thumb"
        class="f-scrollbar-thumb"
        :style="styleThumb"
        @mousedown="handleDragstart"
      />
    </div>
  </div>
</template>

<script>
import getScrollbarWidth from '@/utils/scrollbar-width'
import Resize from '@/mixins/resize'

export default {
  mixins: [Resize],
  props: {
    wrapClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      scrollbarWidth: 0,
      thumbTop: '',
      thumbHeight: '',
    }
  },
  computed: {
    style() {
      return {
        position: 'relative',
        overflow: 'hidden',
      }
    },
    styleWrap() {
      return { marginRight: `-${this.scrollbarWidth}px` }
    },
    styleThumb() {
      return { height: this.thumbHeight, top: this.thumbTop }
    },
  },
  created() {
    this.scrollbarWidth = getScrollbarWidth()
    document.addEventListener('mouseup', this.handleDragend)
  },
  beforeDestroy() {
    document.addEventListener('mouseup', this.handleDragend)
  },
  mounted() {
    this.$nextTick(this.getThumbSize)
  },
  methods: {
    resize() {
      this.getThumbSize()
    },
    getThumbSize() {
      const { wrap } = this.$refs
      if (!wrap) return
      const { scrollHeight, clientHeight } = wrap
      const heightPercentage = (clientHeight * 100) / scrollHeight
      this.thumbHeight = heightPercentage < 100 ? `${heightPercentage}%` : ''
    },
    handleScroll(evt) {
      this.$emit('scroll')
      this.getThumbSize()
      const el = evt.currentTarget
      const { scrollHeight, scrollTop } = el
      this.thumbTop = `${(scrollTop * 100) / scrollHeight}%`
    },
    handleDragstart(evt) {
      evt.stopImmediatePropagation()
      this._draggable = true
      const { offsetTop } = this.$refs.thumb
      this._prevY = evt.clientY - offsetTop
      document.addEventListener('mousemove', this.handleDraging)
    },
    handleDraging(evt) {
      if (!this._draggable) return

      const { clientY } = evt
      const { wrap } = this.$refs
      const { scrollHeight, clientHeight } = wrap
      const offsetY = clientY - this._prevY
      const top = (offsetY * scrollHeight) / clientHeight
      wrap.scrollTop = top
    },
    handleDragend() {
      if (!this._draggable) return

      this._draggable = false
      document.removeEventListener('mousemove', this.handleDraging)
    },
  },
}
</script>
