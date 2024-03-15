<template>
  <keep-alive>
    <f-button-unstyled v-if="disabled" :disabled="disabled">
      <slot name="text" />
    </f-button-unstyled>
    <f-button-unstyled v-else-if="isPhone" key="modal" @click="modal = true">
      <slot name="text" />
      <f-modal-base
        v-model="modal"
        content-class="f-p-0"
        header-class="f-p-0"
        :body-class="modalBodyClass"
        :scrollable="scrollable"
        @shown="shown"
        @hide="hide"
      >
        <component :is="component" v-bind="attrs">
          <slot />
        </component>
      </f-modal-base>
    </f-button-unstyled>
    <f-button-unstyled v-else key="tooltip" ref="target">
      <slot name="text" />
      <f-tooltip-select
        :show.sync="tooltip"
        :target="() => $refs.target?.$el"
        :custom-class="dropdownClass"
        :placement="dropdownPlacement"
        @shown="shown"
        @hide="hide"
      >
        <f-scrollbar-vertical :wrap-class="dropdownWrapperClass">
          <slot />
        </f-scrollbar-vertical>
      </f-tooltip-select>
    </f-button-unstyled>
  </keep-alive>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FTooltipSelect from '@/components/tooltip/tooltip-select'
import FModalBase from '@/components/modal/modal-base'
import { timeoutMixin } from '@/mixins/timeout'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import FScrollbarVertical from '@/components/scrollbar-vertical'

export default {
  components: {
    FButtonUnstyled,
    FTooltipSelect,
    FModalBase,
    FScrollbarVertical,
  },
  mixins: [timeoutMixin, resizeMixin],
  props: {
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    scrollable: makeProp(PROP_TYPE_BOOLEAN, false),
    modalBodyClass: makeProp(PROP_TYPE_STRING, 'f-p-0'),
    modalWrapperClass: makeProp(PROP_TYPE_STRING, 'f-p-20'),
    dropdownClass: makeProp(PROP_TYPE_STRING, 'f-tooltip-select'),
    dropdownWrapperClass: makeProp(PROP_TYPE_STRING, 'f-p-4'),
    dropdownPlacement: makeProp(PROP_TYPE_STRING, 'bottomleft'),
  },
  data() {
    return {
      modal: false,
      tooltip: false,
    }
  },
  computed: {
    isPhone() {
      return isPhone || this.isWidthSm
    },
    component() {
      return this.scrollable ? 'f-scrollbar-vertical' : 'div'
    },
    attrs() {
      return this.scrollable
        ? {
            'wrap-class': this.modalWrapperClass,
          }
        : {
            class: this.modalWrapperClass,
          }
    },
  },
  created() {
    this.$on('hide', this.onHide)
  },
  methods: {
    onHide() {
      this.modal = false
      this.tooltip = false
    },
    shown() {
      this.$emit('shown')
    },
    hide() {
      this.$emit('hide')
    },
  },
}
</script>
