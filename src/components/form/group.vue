<template>
  <div :class="classGroup" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div
      v-if="description"
      v-t="description"
      class="f-form-control-description"
    />
    <div :class="classGroupInner">
      <label v-if="prepend" :for="_id" class="f-form-control-prepend">
        <f-svg :name="prepend" fw />
      </label>
      <f-form-item
        ref="item"
        v-bind="attrs"
        v-on="$listeners"
        @focus="focus"
        @blur="blur"
        @input="input"
      >
        <slot />
      </f-form-item>
      <label v-if="label" v-t="label" :class="classLabel" :for="_id" />
    </div>
    <transition name="slide-fade">
      <div v-if="showError" class="f-error">{{ error }}</div>
    </transition>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import { isExist } from '@/utils/typeof'
import id from '@/mixins/id'
import isMounted from '@/mixins/is_mounted'

export default {
  mixins: [id, isMounted],
  inheritAttrs: false,
  props: {
    description: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    labelClass: {
      type: String,
      default: 'f-control-label-p',
    },
    tooltip: {
      type: Boolean,
      default: false,
    },
    hideError: {
      type: Boolean,
      default: false,
    },
    prepend: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      focused: false,
      hover: false,
      value: null,
    }
  },
  computed: {
    ...mapState(['css', 'isSubmit']),
    _id() {
      return 'f-' + (this.$attrs.id || this.$attrs.name || this.id)
    },
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
      return this.validation.messages[0]
    },
    attrs() {
      return {
        ...this.$attrs,
        id: this._id,
      }
    },
    classGroup() {
      return ['f-form-group', this.hasError ? this.css.he : '']
    },
    classGroupInner() {
      return [
        'f-form-group-inner',
        {
          'f-readonly': this.$attrs.readonly,
          'f-disabled': this.$attrs.disabled,
          ['f-form-group-inner-' + this.$attrs.component]: this.$attrs
            .component,
        },
      ]
    },
    classLabel() {
      return [
        this.css.cl,
        this.labelClass,
        this.hasError ? this.css.le : '',
        {
          'f-control-label-active':
            (isExist(this.value) && this.value !== '') || this.focused,
        },
        { 'f-control-label-hover': this.hover },
        { 'f-control-label-focused': this.focused },
      ]
    },
    hasError() {
      return this.error && (this.touched || this.isSubmit)
    },
    showError() {
      let showError = !this.tooltip && this.hasError && this.focused
      this.$emit('show-error', showError, this.error)
      return showError && !this.hideError
    },
  },
  methods: {
    focus() {
      this.focused = true
    },
    blur() {
      this.focused = false
    },
    input(value) {
      this.value = value
    },
    mouseenter() {
      this.hover = true
    },
    mouseleave() {
      this.hover = false
    },
  },
}
</script>
