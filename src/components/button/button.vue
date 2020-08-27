<template>
  <component
    :is="tag"
    v-bind="$attrs"
    :class="className"
    :type="type"
    v-on="$listeners"
  >
    <slot>
      <span v-t="text" />
    </slot>
  </component>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  props: {
    block: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'success',
      validator: value => ['success', 'secondary'].includes(value),
    },
    size: {
      type: String,
      default: '',
      validator: value => ['sm', '', 'lg'].includes(value),
    },
    tag: {
      type: String,
      default: 'button',
    },
    text: {
      type: [String, Object],
      default: '',
    },
    type: {
      type: String,
      default() {
        return this.tag === 'button' ? 'button' : null
      },
    },
  },
  computed: {
    ...mapState('css_variable', [
      'btn_success_gradient_enable',
      'btn_success_gradient_custom',
      'btn_success_bg_lighten',
    ]),
    className() {
      return [
        'f-btn',
        `f-btn-${this.variant}`,
        {
          'f-btn-block': this.block,
          [`f-btn-${this.size}`]: this.size,
          'f-btn-success-gradient':
            this.variant === 'success' &&
            this.btn_success_gradient_enable &&
            !this.btn_success_gradient_custom,
          'f-btn-success-gradient-custom':
            this.variant === 'success' &&
            this.btn_success_gradient_custom &&
            !this.btn_success_gradient_enable,
          'f-btn-success-bg-lighten':
            this.variant === 'success' && this.btn_success_bg_lighten,
        },
      ]
    },
  },
}
</script>
