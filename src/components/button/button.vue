<template>
  <component
    :is="tag"
    v-bind="attrs"
    :class="className"
    :type="type"
    v-on="$listeners"
  >
    <slot>
      <span v-text="$t(text)" />
    </slot>
  </component>
</template>

<script>
import { mapState } from '@/utils/store'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  props: {
    block: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(
        ['success', 'default', 'secondary', 'outline', 'light', 'dark'],
        value
      )
    ),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['sm', 'lg'], value)
    ),
    tag: makeProp(PROP_TYPE_STRING, 'button'),
    text: makeProp(PROP_TYPE_STRING),
    type: makeProp(PROP_TYPE_STRING, function () {
      return this.tag === 'button' ? 'button' : undefined
    }),
  },
  computed: {
    ...mapState('css_variable', [
      'btn_success_gradient_enable',
      'btn_success_gradient_custom',
      'btn_success_bg_lighten',
    ]),
    attrs() {
      return {
        ...this.$attrs,
        disabled: this.disabled,
      }
    },
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
