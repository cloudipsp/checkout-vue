<template>
  <div
    tabindex="-1"
    role="dialog"
    class="f-modal"
    :class="{ fade: transitionDuration > 0 }"
    @click.self="backdropClicked"
  >
    <div
      ref="dialog"
      class="f-modal-dialog"
      :class="modalSizeClass"
      role="document"
    >
      <div class="f-modal-content">
        <div v-if="header" class="f-modal-header">
          <slot name="header">
            <button
              v-if="dismissBtn"
              type="button"
              class="f-close"
              aria-label="Close"
              style="position: relative;z-index: 1060"
              @click="toggle(false)"
            >
              <!-- 1060 is bigger than dialog z-index 1050 because it got cover by title sometimes -->
              <span aria-hidden="true">×</span>
            </button>
            <slot name="icon" />
            <h4 class="f-modal-title">
              <slot name="title">
                {{ title }}
              </slot>
            </h4>
          </slot>
        </div>
        <div class="f-modal-body">
          <slot />
        </div>
        <div v-if="footer" class="f-modal-footer">
          <slot name="footer" :toggle="toggle">
            <!--<btn :type="cancelType" @click="toggle(false,'cancel')">-->
            <!--<span>{{cancelText || t('uiv.modal.cancel')}}</span>-->
            <!--</btn>-->
            <!--<btn :type="okType" @click="toggle(false,'ok')" data-action="auto-focus">-->
            <!--<span>{{okText || t('uiv.modal.ok')}}</span>-->
            <!--</btn>-->
          </slot>
        </div>
      </div>
    </div>
    <div
      ref="backdrop"
      class="f-modal-backdrop"
      :class="{ fade: transitionDuration > 0 }"
    />
  </div>
</template>

<script>
import {
  EVENTS,
  on,
  off,
  removeFromDom,
  toggleBodyOverflow,
  addClass,
  removeClass,
  getComputedStyle,
} from '@/utils/dom'
import { isFunction } from '@/utils/typeof'

const MODAL_BACKDROP = 'f-modal-backdrop'
const IN = 'in'
const getOpenModals = () => document.querySelectorAll(`.${MODAL_BACKDROP}`)
const getOpenModalNum = () => getOpenModals().length

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    backdrop: {
      type: Boolean,
      default: true,
    },
    footer: {
      type: Boolean,
      default: true,
    },
    header: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      default: '',
    },
    cancelType: {
      type: String,
      default: 'default',
    },
    okText: {
      type: String,
      default: '',
    },
    okType: {
      type: String,
      default: 'primary',
    },
    dismissBtn: {
      type: Boolean,
      default: true,
    },
    transitionDuration: {
      type: Number,
      default: 150,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    keyboard: {
      type: Boolean,
      default: true,
    },
    beforeClose: {
      type: Function,
      default: null,
    },
    zOffset: {
      type: Number,
      default: 20,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    displayStyle: {
      type: String,
      default: 'block',
    },
  },
  data() {
    return {
      msg: '',
      timeoutId: 0,
    }
  },
  computed: {
    modalSizeClass() {
      return {
        [`f-modal-${this.size}`]: Boolean(this.size),
      }
    },
  },
  watch: {
    value(v) {
      this.$toggle(v)
    },
  },
  mounted() {
    removeFromDom(this.$refs.backdrop)
    on(window, EVENTS.KEY_UP, this.onKeyPress)
    if (this.value) {
      this.$toggle(true)
    } else {
      this.$el.style.display = 'none'
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
    removeFromDom(this.$refs.backdrop)
    removeFromDom(this.$el)
    if (getOpenModalNum() === 0) {
      toggleBodyOverflow(true)
    }
    off(window, EVENTS.KEY_UP, this.onKeyPress)
  },
  methods: {
    onKeyPress(event) {
      if (this.keyboard && this.value && event.keyCode === 27) {
        const thisModal = this.$refs.backdrop
        let thisZIndex = thisModal.style.zIndex
        thisZIndex =
          thisZIndex && thisZIndex !== 'auto' ? parseInt(thisZIndex) : 0
        // Find out if this modal is the top most one.
        const modals = getOpenModals()
        const modalsLength = modals.length
        for (let i = 0; i < modalsLength; i++) {
          if (modals[i] !== thisModal) {
            let zIndex = modals[i].style.zIndex
            zIndex = zIndex && zIndex !== 'auto' ? parseInt(zIndex) : 0
            // if any existing modal has higher zIndex, ignore
            if (zIndex > thisZIndex) {
              return
            }
          }
        }
        this.toggle(false)
      }
    },
    toggle(show, msg) {
      // skip the hiding while show===false & beforeClose returning falsely value
      if (!show && isFunction(this.beforeClose) && !this.beforeClose(msg)) {
        return
      }
      this.msg = msg
      this.$emit('input', show)
    },
    $toggle(show) {
      const modal = this.$el
      const backdrop = this.$refs.backdrop
      clearTimeout(this.timeoutId)
      if (show) {
        const alreadyOpenModalNum = getOpenModalNum()
        document.body.appendChild(backdrop)
        if (this.appendToBody) {
          document.body.appendChild(modal)
        }
        modal.style.display = this.displayStyle
        modal.scrollTop = 0
        // eslint-disable-next-line no-unused-expressions
        backdrop.offsetHeight // force repaint
        toggleBodyOverflow(false)
        addClass(backdrop, IN)
        addClass(modal, IN)
        // fix z-index for nested modals
        // no need to calculate if no modal is already open
        if (alreadyOpenModalNum > 0) {
          const modalBaseZ = parseInt(getComputedStyle(modal).zIndex) || 1050 // 1050 is default modal z-Index
          const backdropBaseZ =
            parseInt(getComputedStyle(backdrop).zIndex) || 1040 // 1040 is default backdrop z-Index
          const offset = alreadyOpenModalNum * this.zOffset
          modal.style.zIndex = `${modalBaseZ + offset}`
          backdrop.style.zIndex = `${backdropBaseZ + offset}`
        }
        // z-index fix end
        this.timeoutId = setTimeout(() => {
          if (this.autoFocus) {
            let btn = this.$el.querySelector('[data-action="auto-focus"]')
            if (btn) {
              btn.focus()
            }
          }
          this.$emit('show')
          this.timeoutId = 0
        }, this.transitionDuration)
      } else {
        removeClass(backdrop, IN)
        removeClass(modal, IN)
        this.timeoutId = setTimeout(() => {
          modal.style.display = 'none'
          removeFromDom(backdrop)
          if (this.appendToBody) {
            removeFromDom(modal)
          }
          if (getOpenModalNum() === 0) {
            toggleBodyOverflow(true)
          }
          this.$emit('hide', this.msg || 'dismiss')
          this.msg = ''
          this.timeoutId = 0
          // restore z-index for nested modals
          modal.style.zIndex = ''
          backdrop.style.zIndex = ''
          // z-index fix end
        }, this.transitionDuration)
      }
    },
    backdropClicked() {
      if (this.backdrop) {
        this.toggle(false)
      }
    },
  },
}
</script>
