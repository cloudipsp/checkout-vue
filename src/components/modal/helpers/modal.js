import Vue from 'vue'
import { BModal, BButton } from 'bootstrap-vue'
import FButtonClose from '../../button/button-close'
import { htmlOrText } from 'bootstrap-vue/src/utils/html'
import BVTransition from 'bootstrap-vue/src/utils/bv-transition'

export default Vue.extend({
  extends: BModal,
  computed: {
    dialogClasses() {
      return [
        {
          [`f-modal-${this.size}`]: this.size,
          'f-modal-dialog-centered': this.centered,
          'f-modal-dialog-scrollable': this.scrollable,
        },
        this.dialogClass,
      ]
    },
  },
  methods: {
    checkModalOverflow() {},
    makeModal(h) {
      // Modal header
      let $header = h()
      if (!this.hideHeader) {
        // TODO: Rename slot to `header` and deprecate `modal-header`
        let $modalHeader = this.normalizeSlot('modal-header', this.slotScope)
        if (!$modalHeader) {
          let $closeButton = h()
          if (!this.hideHeaderClose) {
            $closeButton = h(
              FButtonClose,
              {
                props: {
                  content: this.headerCloseContent,
                  disabled: this.isTransitioning,
                  ariaLabel: this.headerCloseLabel,
                  textVariant:
                    this.headerCloseVariant || this.headerTextVariant,
                },
                on: { click: this.onClose },
                ref: 'close-button',
              },
              // TODO: Rename slot to `header-close` and deprecate `modal-header-close`
              [this.normalizeSlot('modal-header-close')]
            )
          }

          $modalHeader = [
            h(
              this.titleTag,
              {
                staticClass: 'f-modal-title',
                class: this.titleClasses,
                attrs: { id: this.modalTitleId },
                // TODO: Rename slot to `title` and deprecate `modal-title`
                domProps: this.hasNormalizedSlot('modal-title')
                  ? {}
                  : htmlOrText(this.titleHtml, this.title),
              },
              // TODO: Rename slot to `title` and deprecate `modal-title`
              [this.normalizeSlot('modal-title', this.slotScope)]
            ),
            $closeButton,
          ]
        }

        $header = h(
          'header',
          {
            staticClass: 'f-modal-header',
            class: this.headerClasses,
            attrs: { id: this.modalHeaderId },
            ref: 'header',
          },
          [$modalHeader]
        )
      }

      // Modal body
      const $body = h(
        'div',
        {
          staticClass: 'f-modal-body',
          class: this.bodyClasses,
          attrs: { id: this.modalBodyId },
          ref: 'body',
        },
        this.normalizeSlot('default', this.slotScope)
      )

      // Modal footer
      let $footer = h()
      if (!this.hideFooter) {
        // TODO: Rename slot to `footer` and deprecate `modal-footer`
        let $modalFooter = this.normalizeSlot('modal-footer', this.slotScope)
        if (!$modalFooter) {
          let $cancelButton = h()
          if (!this.okOnly) {
            $cancelButton = h(
              BButton,
              {
                props: {
                  variant: this.cancelVariant,
                  size: this.buttonSize,
                  disabled:
                    this.cancelDisabled || this.busy || this.isTransitioning,
                },
                // TODO: Rename slot to `cancel-button` and deprecate `modal-cancel`
                domProps: this.hasNormalizedSlot('modal-cancel')
                  ? {}
                  : htmlOrText(this.cancelTitleHtml, this.cancelTitle),
                on: { click: this.onCancel },
                ref: 'cancel-button',
              },
              // TODO: Rename slot to `cancel-button` and deprecate `modal-cancel`
              this.normalizeSlot('modal-cancel')
            )
          }

          const $okButton = h(
            BButton,
            {
              props: {
                variant: this.okVariant,
                size: this.buttonSize,
                disabled: this.okDisabled || this.busy || this.isTransitioning,
              },
              // TODO: Rename slot to `ok-button` and deprecate `modal-ok`
              domProps: this.hasNormalizedSlot('modal-ok')
                ? {}
                : htmlOrText(this.okTitleHtml, this.okTitle),
              on: { click: this.onOk },
              ref: 'ok-button',
            },
            // TODO: Rename slot to `ok-button` and deprecate `modal-ok`
            this.normalizeSlot('modal-ok')
          )

          $modalFooter = [$cancelButton, $okButton]
        }

        $footer = h(
          'footer',
          {
            staticClass: 'f-modal-footer',
            class: this.footerClasses,
            attrs: { id: this.modalFooterId },
            ref: 'footer',
          },
          [$modalFooter]
        )
      }

      // Assemble modal content
      const $modalContent = h(
        'div',
        {
          staticClass: 'f-modal-content',
          class: this.contentClass,
          attrs: {
            id: this.modalContentId,
            tabindex: '-1',
          },
          ref: 'content',
        },
        [$header, $body, $footer]
      )

      // Tab traps to prevent page from scrolling to next element in
      // tab index during enforce-focus tab cycle
      let $tabTrapTop = h()
      let $tabTrapBottom = h()
      if (this.isVisible && !this.noEnforceFocus) {
        $tabTrapTop = h('span', { ref: 'topTrap', attrs: { tabindex: '0' } })
        $tabTrapBottom = h('span', {
          ref: 'bottomTrap',
          attrs: { tabindex: '0' },
        })
      }

      // Modal dialog wrapper
      const $modalDialog = h(
        'div',
        {
          staticClass: 'f-modal-dialog',
          class: this.dialogClasses,
          on: { mousedown: this.onDialogMousedown },
          ref: 'dialog',
        },
        [$tabTrapTop, $modalContent, $tabTrapBottom]
      )

      // Modal
      let $modal = h(
        'div',
        {
          staticClass: 'f-modal',
          class: this.modalClasses,
          style: this.modalStyles,
          attrs: this.computedModalAttrs,
          on: { keydown: this.onEsc, click: this.onClickOut },
          directives: [{ name: 'show', value: this.isVisible }],
          ref: 'modal',
        },
        [$modalDialog]
      )

      // Wrap modal in transition
      // Sadly, we can't use `BVTransition` here due to the differences in
      // transition durations for `.modal` and `.modal-dialog`
      // At least until https://github.com/vuejs/vue/issues/9986 is resolved
      $modal = h(
        'transition',
        {
          props: {
            enterClass: '',
            enterToClass: '',
            enterActiveClass: '',
            leaveClass: '',
            leaveActiveClass: '',
            leaveToClass: '',
          },
          on: {
            beforeEnter: this.onBeforeEnter,
            enter: this.onEnter,
            afterEnter: this.onAfterEnter,
            beforeLeave: this.onBeforeLeave,
            leave: this.onLeave,
            afterLeave: this.onAfterLeave,
          },
        },
        [$modal]
      )

      // Modal backdrop
      let $backdrop = h()
      if (!this.hideBackdrop && this.isVisible) {
        $backdrop = h(
          'div',
          {
            staticClass: 'f-modal-backdrop',
            attrs: { id: this.modalBackdropId },
          },
          // TODO: Rename slot to `backdrop` and deprecate `modal-backdrop`
          this.normalizeSlot('modal-backdrop')
        )
      }
      $backdrop = h(BVTransition, { props: { noFade: this.noFade } }, [
        $backdrop,
      ])

      // Assemble modal and backdrop in an outer <div>
      return h(
        'div',
        {
          style: this.modalOuterStyle,
          attrs: this.computedAttrs,
          key: `modal-outer-${this._uid}`,
        },
        [$modal, $backdrop]
      )
    },
  },
})
