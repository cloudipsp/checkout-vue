/**
 * Private ModalManager helper
 * Handles controlling modal stacking zIndexes and body adjustments/classes
 */

import Vue from 'vue'
import {
  addClass,
  getAttr,
  getBCR,
  getCS,
  getStyle,
  hasAttr,
  removeAttr,
  removeClass,
  requestAF,
  selectAll,
  setAttr,
  setStyle,
} from '@/utils/dom'
import { isBrowser } from '@/utils/env'
import { isNull } from '@/utils/inspect'
import { toFloat, toInteger } from '@/utils/number'
import { windowWidth } from '@/utils/helpers'

// --- Constants ---

// Default modal backdrop z-index
const DEFAULT_ZINDEX = 1040

// Selectors for padding/margin adjustments
const Selector = {
  FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
  STICKY_CONTENT: '.sticky-top',
  NAVBAR_TOGGLER: '.navbar-toggler',
}

// @vue/component
const ModalManager = Vue.extend({
  data() {
    return {
      modals: [],
      baseZIndex: null,
      scrollbarWidth: null,
      isBodyOverflowing: false,
    }
  },
  computed: {
    modalCount() {
      return this.modals.length
    },
    modalsAreOpen() {
      return this.modalCount > 0
    },
  },
  watch: {
    modalCount(newCount, oldCount) {
      if (isBrowser) {
        this.getScrollbarWidth()
        if (newCount > 0 && oldCount === 0) {
          // Transitioning to modal(s) open
          this.checkScrollbar()
          this.setScrollbar()
          addClass(document.body, 'f-modal-open')
        } else if (newCount === 0 && oldCount > 0) {
          // Transitioning to modal(s) closed
          this.resetScrollbar()
          removeClass(document.body, 'f-modal-open')
        }
        setAttr(document.body, 'data-modal-open-count', String(newCount))
      }
    },
    modals(newVal) {
      this.checkScrollbar()
      requestAF(() => {
        this.updateModals(newVal || [])
      })
    },
  },
  methods: {
    // Public methods
    registerModal(modal) {
      // Register the modal if not already registered
      if (modal && this.modals.indexOf(modal) === -1) {
        // Add modal to modals array
        this.modals.push(modal)
        modal.$once('hook:beforeDestroy', () => {
          this.unregisterModal(modal)
        })
      }
    },
    unregisterModal(modal) {
      const index = this.modals.indexOf(modal)
      if (index > -1) {
        // Remove modal from modals array
        this.modals.splice(index, 1)
        // Reset the modal's data
        if (!(modal._isBeingDestroyed || modal._isDestroyed)) {
          this.resetModal(modal)
        }
      }
    },
    getBaseZIndex() {
      if (isNull(this.baseZIndex) && isBrowser) {
        // Create a temporary `div.modal-backdrop` to get computed z-index
        const div = document.createElement('div')
        addClass(div, 'f-modal-backdrop')
        setStyle(div, 'display', 'none')
        document.body.appendChild(div)
        this.baseZIndex = toInteger(getCS(div).zIndex, DEFAULT_ZINDEX)
        document.body.removeChild(div)
      }
      return this.baseZIndex || DEFAULT_ZINDEX
    },
    getScrollbarWidth() {
      if (isNull(this.scrollbarWidth) && isBrowser) {
        // Create a temporary `div.measure-scrollbar` to get computed z-index
        const div = document.createElement('div')
        addClass(div, 'f-modal-scrollbar-measure')
        document.body.appendChild(div)
        this.scrollbarWidth = getBCR(div).width - div.clientWidth
        document.body.removeChild(div)
      }
      return this.scrollbarWidth || 0
    },
    // Private methods
    updateModals(modals) {
      const baseZIndex = this.getBaseZIndex()
      const scrollbarWidth = this.getScrollbarWidth()
      modals.forEach((modal, index) => {
        // We update data values on each modal
        modal.zIndex = baseZIndex + index
        modal.scrollbarWidth = scrollbarWidth
        modal.isTop = index === this.modals.length - 1
        modal.isBodyOverflowing = this.isBodyOverflowing
      })
    },
    resetModal(modal) {
      if (modal) {
        modal.zIndex = this.getBaseZIndex()
        modal.isTop = true
        modal.isBodyOverflowing = false
      }
    },
    checkScrollbar() {
      // Determine if the body element is overflowing
      const { left, right } = getBCR(document.body)
      this.isBodyOverflowing = left + right < windowWidth()
    },
    setScrollbar() {
      const body = document.body
      // Storage place to cache changes to margins and padding
      // Note: This assumes the following element types are not added to the
      // document after the modal has opened.
      body._paddingChangedForModal = body._paddingChangedForModal || []
      body._marginChangedForModal = body._marginChangedForModal || []
      if (this.isBodyOverflowing) {
        const scrollbarWidth = this.scrollbarWidth
        // Adjust fixed content padding
        selectAll(Selector.FIXED_CONTENT).forEach(el => {
          const actualPadding = getStyle(el, 'paddingRight') || ''
          setAttr(el, 'data-padding-right', actualPadding)
          setStyle(
            el,
            'paddingRight',
            `${toFloat(getCS(el).paddingRight, 0) + scrollbarWidth}px`
          )
          body._paddingChangedForModal.push(el)
        })
        // Adjust sticky content margin
        selectAll(Selector.STICKY_CONTENT).forEach(el => {
          const actualMargin = getStyle(el, 'marginRight') || ''
          setAttr(el, 'data-margin-right', actualMargin)
          setStyle(
            el,
            'marginRight',
            `${toFloat(getCS(el).marginRight, 0) - scrollbarWidth}px`
          )
          body._marginChangedForModal.push(el)
        })
        // Adjust <b-navbar-toggler> margin
        selectAll(Selector.NAVBAR_TOGGLER).forEach(el => {
          const actualMargin = getStyle(el, 'marginRight') || ''
          setAttr(el, 'data-margin-right', actualMargin)
          setStyle(
            el,
            'marginRight',
            `${toFloat(getCS(el).marginRight, 0) + scrollbarWidth}px`
          )
          body._marginChangedForModal.push(el)
        })
        // Adjust body padding
        const actualPadding = getStyle(body, 'paddingRight') || ''
        setAttr(body, 'data-padding-right', actualPadding)
        setStyle(
          body,
          'paddingRight',
          `${toFloat(getCS(body).paddingRight, 0) + scrollbarWidth}px`
        )
      }
    },
    resetScrollbar() {
      const body = document.body
      if (body._paddingChangedForModal) {
        // Restore fixed content padding
        body._paddingChangedForModal.forEach(el => {
          if (hasAttr(el, 'data-padding-right')) {
            setStyle(
              el,
              'paddingRight',
              getAttr(el, 'data-padding-right') || ''
            )
            removeAttr(el, 'data-padding-right')
          }
        })
      }
      if (body._marginChangedForModal) {
        // Restore sticky content and navbar-toggler margin
        body._marginChangedForModal.forEach(el => {
          if (hasAttr(el, 'data-margin-right')) {
            setStyle(el, 'marginRight', getAttr(el, 'data-margin-right') || '')
            removeAttr(el, 'data-margin-right')
          }
        })
      }
      body._paddingChangedForModal = null
      body._marginChangedForModal = null
      // Restore body padding
      if (hasAttr(body, 'data-padding-right')) {
        setStyle(
          body,
          'paddingRight',
          getAttr(body, 'data-padding-right') || ''
        )
        removeAttr(body, 'data-padding-right')
      }
    },
  },
})

// Create and export our modal manager instance
export const modalManager = new ModalManager()
