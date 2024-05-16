<template>
  <button v-bind="$attrs" :class="className" type="button" v-on="$listeners">
    <slot />
  </button>
</template>

<script>
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  props: {
    block: makeProp(PROP_TYPE_BOOLEAN, false),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(['default', 'secondary'], value)
    ),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['56'], value)
    ),
  },
  computed: {
    className() {
      return [
        this.$style.style,
        this.$style[this.variant],
        this.$style[`s_${this.size}`],
        {
          [this.$style.block]: this.block,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
@mixin button-link-variant($color, $color-hover, $color-active) {
  color: $color;

  &:hover,
  &:focus {
    color: $color-hover;
  }

  &:active {
    color: $color-active;
  }
}

.style {
  position: relative;
  display: inline-block;
  height: px-to-rem(44px);
  min-height: px-to-rem(44px);
  padding: px-to-rem(10px) px-to-rem(32px);
  font-size: px-to-rem(16px);
  font-weight: 500;
  line-height: px-to-rem(24px);
  text-align: center;
  background: none;
  border: none;
  border-radius: px-to-rem(8px);
  transition: all ease-in-out 0.15s;
  white-space: nowrap;

  &:hover,
  &:focus {
    text-decoration: none;
    transform: translateY(px-to-rem(-2px));
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 px-to-rem(2px) $outline_border;
  }

  &:active {
    transform: translateY(0);
  }

  :not(:disabled, .disabled) {
    cursor: pointer;
  }
}

.default {
  @include button-link-variant(
    $btn_link_default_color,
    $btn_link_default_hover_color,
    $btn_link_default_active_color
  );
}

.secondary {
  @include button-link-variant(
    $btn_link_secondary_color,
    $btn_link_secondary_hover_color,
    $btn_link_secondary_active_color
  );
}

.s_56 {
  height: px-to-rem(56px);
  min-height: px-to-rem(56px);
  padding: px-to-rem(16px) px-to-rem(32px);
}

.block {
  display: block;
  width: 100%;
}
</style>
