<template>
  <keep-alive>
    <span v-if="disabled" :disabled="disabled">
      <slot name="text" />
    </span>
    <a v-else-if="isPhone" key="modal" href="#" @click="modal = true">
      <slot name="text" />
      <f-modal-base
        v-model="modal"
        header-class="f-p-0"
        body-class="f-p-0"
        :scrollable="scrollable"
        @shown="shown"
        @hide="hide"
      >
        <component :is="component" v-bind="attrs">
          <slot />
        </component>
      </f-modal-base>
    </a>
    <a v-else key="tooltip" ref="target" href="#">
      <slot name="text" />
      <f-tooltip-select
        class="asd"
        :show.sync="tooltip"
        :target="() => $refs.target"
        placement="bottomleft"
        @shown="shown"
        @hide="hide"
      >
        <component :is="component" v-bind="attrs">
          <slot />
        </component>
      </f-tooltip-select>
    </a>
  </keep-alive>
</template>

<script>
import FTooltipSelect from '@/components/tooltip/tooltip-select'
import { timeoutMixin } from '@/mixins/timeout'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import FScrollbarVertical from '@/components/scrollbar-vertical'

export default {
  components: {
    FTooltipSelect,
    FScrollbarVertical,
  },
  mixins: [timeoutMixin, resizeMixin],
  props: {
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    scrollable: makeProp(PROP_TYPE_BOOLEAN, false),
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
            'wrap-class': 'f-select-wrap',
          }
        : {
            class: 'f-select-wrap',
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
