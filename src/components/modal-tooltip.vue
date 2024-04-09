<template>
  <keep-alive>
    <button v-if="disabled" :class="className" :disabled="disabled">
      <slot name="text" />
    </button>
    <button
      v-else-if="isPhone"
      key="modal"
      :class="className"
      type="button"
      @click="modal = true"
    >
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
    </button>
    <button v-else key="tooltip" ref="target" :class="className" type="button">
      <slot name="text" />
      <f-tooltip-select
        :show.sync="tooltip"
        :target="() => $refs.target"
        :custom-class="dropdownClass"
        :placement="dropdownPlacement"
        @shown="shown"
        @hide="hide"
      >
        <f-scrollbar-vertical :wrap-class="dropdownWrapperClass">
          <slot />
        </f-scrollbar-vertical>
      </f-tooltip-select>
    </button>
  </keep-alive>
</template>

<script>
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
    className() {
      return 'f-btn-unstyled'
    },
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
