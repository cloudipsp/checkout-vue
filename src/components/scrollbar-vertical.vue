<template>
  <div class="f-scrollbar" :style="style">
    <div
      ref="wrap"
      class="f-scrollbar-wrap"
      :class="wrapClass"
      :style="styleWrap"
      @scroll="scroll"
    >
      <slot />
    </div>
    <div class="f-scrollbar-track">
      <div
        ref="thumb"
        class="f-scrollbar-thumb"
        :style="styleThumb"
        @mousedown="dragstart"
      />
    </div>
  </div>
</template>

<script>
import getScrollbarWidth from '@/utils/scrollbar-width'
import { resizeMixin } from '@/mixins/resize'
import { isMobileFirefox, isDesktop } from '@/utils/mobile'
import { contains } from '@/utils/dom'

export default {
  mixins: [resizeMixin],
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
    document.addEventListener('mouseup', this.dragend)
  },
  beforeDestroy() {
    document.addEventListener('mouseup', this.dragend)
  },
  mounted() {
    this.$nextTick().then(this.getThumbSize)
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
    scroll(evt) {
      this.hideAutocomplete()
      this.getThumbSize()
      const el = evt.currentTarget
      const { scrollHeight, scrollTop } = el
      this.thumbTop = `${(scrollTop * 100) / scrollHeight}%`
    },
    dragstart(evt) {
      evt.stopImmediatePropagation()
      this._draggable = true
      const { offsetTop } = this.$refs.thumb
      this._prevY = evt.clientY - offsetTop
      document.addEventListener('mousemove', this.draging)
    },
    draging(evt) {
      if (!this._draggable) return

      const { clientY } = evt
      const { wrap } = this.$refs
      const { scrollHeight, clientHeight } = wrap
      const offsetY = clientY - this._prevY
      const top = (offsetY * scrollHeight) / clientHeight
      wrap.scrollTop = top
    },
    dragend() {
      if (!this._draggable) return

      this._draggable = false
      document.removeEventListener('mousemove', this.draging)
    },
    hideAutocomplete() {
      if (isMobileFirefox) return

      let activeElement = document.activeElement

      if (activeElement.tagName !== 'INPUT') return

      if (!contains(this.$refs.wrap, activeElement)) return

      activeElement.blur()

      if (isDesktop) {
        let rectWrapper = this.$refs.wrap.getBoundingClientRect()
        let rectActiveElement = activeElement.getBoundingClientRect()

        if (rectActiveElement.top < rectWrapper.top) return
        if (rectActiveElement.bottom > rectWrapper.bottom) return
      }

      activeElement.focus()
    },
  },
}
</script>
