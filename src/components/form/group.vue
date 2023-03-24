<template>
  <div :class="classGroup" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <slot v-if="noLabelFloating" :id="safeId()" name="label" :label="$t(label)">
      <label
        v-if="showLabel"
        :class="classLabel"
        :for="safeId()"
        @click="focused"
        v-text="$t(label)"
      />
    </slot>
    <div :class="classGroupInner">
      <label
        v-if="prependText"
        :for="safeId()"
        class="f-form-control-prepend-text"
      >
        {{ prependText }}
      </label>
      <label v-if="prepend" :for="safeId()" class="f-form-control-prepend">
        <f-svg :name="prepend" fw />
      </label>
      <label
        v-if="!noLabelFloating && showLabel"
        :class="classLabelFloating"
        :for="safeId()"
        @click="focused"
        v-text="$t(label)"
      />
      <f-form-item
        ref="item"
        v-bind="attrs"
        v-on="$listeners"
        @focus="onFocus"
        @blur="blur"
      >
        <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
        <template
          v-for="slot in Object.keys($scopedSlots)"
          :slot="slot"
          slot-scope="slotData"
        >
          <slot :name="slot" v-bind="slotData" />
        </template>
      </f-form-item>
      <f-placeholder v-if="showPlaceholder" v-bind="attrs" />
    </div>
    <f-tooltip-error
      v-if="showErrorTooltip"
      :show.sync="showErrorTooltipFlag"
      :target="() => $refs.item && $refs.item.$el"
    >
      <f-svg class="f-mr-8" name="warning" size="md" />
      {{ error }}
    </f-tooltip-error>
    <transition name="f-slide-fade">
      <div v-if="showError" class="f-error">{{ error }}</div>
    </transition>
  </div>
</template>

<script>
import FSvg from '@/components/svg'
import FFormItem from '@/components/form/item'
import FPlaceholder from '@/components/base/placeholder'
import FTooltipError from '@/components/tooltip/tooltip-error'
import { mapState } from '@/utils/store'
import { isExist } from '@/utils/inspect'
import { idMixin, props as idProps } from '@/mixins/id'
import { isMountedMixin } from '@/mixins/is-mounted'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { timeoutMixin } from '@/mixins/timeout'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FSvg,
    FFormItem,
    FPlaceholder,
    FTooltipError,
  },
  mixins: [idMixin, isMountedMixin, timeoutMixin],
  inheritAttrs: false,
  props: {
    ...idProps,
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    label: makeProp(PROP_TYPE_STRING, function () {
      return this.name
    }),
    labelClass: makeProp(PROP_TYPE_STRING),
    noLabelFloating: makeProp(PROP_TYPE_BOOLEAN, false),
    tooltip: makeProp(PROP_TYPE_BOOLEAN, false),
    hideError: makeProp(PROP_TYPE_BOOLEAN, false),
    prepend: makeProp(PROP_TYPE_STRING),
    prependText: makeProp(PROP_TYPE_STRING),
    dynamicPlaceholder: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      focus: false,
      hover: false,
      value: null,
      showErrorTooltipFlag: false,
    }
  },
  computed: {
    ...mapState(['isSubmit']),
    validation() {
      if (!this.isMounted) return
      return this.$refs.item.$children[0].$refs.validation
    },
    touched() {
      if (!this.isMounted) return
      return this.validation.flags.touched
    },
    error() {
      if (!this.isMounted) return
      return this.validation.errors[0]
    },
    attrs() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        name: `f-${this.name}`,
        noLabelFloating: this.noLabelFloating,
        label: this.label,
      }
    },
    classGroup() {
      return ['f-form-group', this.$style.wrapper]
    },
    classGroupInner() {
      return [
        'f-form-group-inner',
        {
          'f-readonly': this.$attrs.readonly,
          'f-disabled': this.$attrs.disabled,
          ['f-form-group-inner-' + this.$attrs.component]:
            this.$attrs.component,
        },
      ]
    },
    classLabel() {
      return [this.$style['label-no-floating'], this.labelClass]
    },
    classLabelFloating() {
      return [
        'f-control-label',
        'f-control-label-floating',
        {
          [`f-control-label-floating-${this.$attrs.size}`]: this.$attrs.size,
          'f-control-label-active':
            (isExist(this.$attrs.value) && this.$attrs.value !== '') ||
            this.focus,
          'f-control-label-hover': this.hover,
          'f-control-label-focused': this.focus,
        },
      ]
    },
    hasError() {
      return this.error && (this.touched || this.isSubmit)
    },
    showError() {
      let showError = !this.tooltip && this.hasError && this.focus
      this.$emit('show-error', showError, this.error)
      return showError && !this.hideError
    },
    showErrorTooltip() {
      return this.tooltip && this.hasError && this.focus
    },
    showPlaceholder() {
      return this.dynamicPlaceholder && this.noLabelFloating && this.safeId()
    },
    showLabel() {
      return !arrayIncludes(['checkbox'], this.$attrs.component) && this.label
    },
  },
  watch: {
    showErrorTooltip: 'watchShowErrorTooltip',
  },
  methods: {
    onFocus() {
      this.focus = true
    },
    blur() {
      this.focus = false
    },
    mouseenter() {
      this.hover = true
    },
    mouseleave() {
      this.hover = false
    },
    watchShowErrorTooltip(value) {
      this.timeout(() => {
        this.showErrorTooltipFlag = value
      })
    },
    focused() {
      this.$refs.item.focused()
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  position: relative;
  margin-bottom: px-to-rem(16px);
}

.label-no-floating {
  margin-bottom: px-to-rem(8px);
  font-size: px-to-rem(14px);
}
</style>
