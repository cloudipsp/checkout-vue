<template>
  <div :class="classGroup" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div v-if="description" class="f-form-control-description">
      {{ description }}
    </div>
    <div class="f-form-group-inner">
      <f-form-item
        v-bind="$attrs"
        v-on="$listeners"
        @error="onError"
        @focus="focus"
        @blur="blur"
        @input="input"
      />
      <label v-if="label" :class="classLabel" :for="_id">
        {{ $t(label) }}
      </label>
    </div>
    <transition name="slide-fade">
      <div v-if="showError" class="f-error">{{ error }}</div>
    </transition>
    <slot />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import { isExist } from '@/utils/typeof'

export default {
  inheritAttrs: false,
  props: {
    description: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default() {
        return this.$attrs.name
      },
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
  },
  data() {
    return {
      focused: false,
      touched: false,
      hover: false,
      error: '',
      value: null,
    }
  },
  computed: {
    ...mapState(['css', 'isSubmit']),
    _name() {
      return 'f-' + this.$attrs.name
    },
    _id() {
      return this.$attrs.id || this._name
    },
    classGroup() {
      return ['f-form-group', this.hasError ? this.css.he : '']
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
    onError(error) {
      this.error = error
    },
    focus() {
      this.focused = true
    },
    blur() {
      this.focused = false
      this.touched = true
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
