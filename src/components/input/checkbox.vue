<template>
  <div :class="$style.wrapper">
    <checkbox v-bind="attrs" v-on="$listeners" @keyup.enter="onEnter" />
    <label :class="classLabel" :for="safeId()">
      <slot />
    </label>
  </div>
</template>

<script>
import Checkbox from '@/components/form/item/helpers/checkbox'
import { idMixin, idProps } from '@/mixins/id'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN, PROP_TYPE_STRING } from '@/constants/props'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    Checkbox,
  },
  mixins: [idMixin],
  inject: ['submit'],
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    ...idProps,
    invalid: makeProp(PROP_TYPE_BOOLEAN),
    value: makeProp(PROP_TYPE_BOOLEAN, false),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      ['default', 'secondary'].includes(value)
    ),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      ['sm'].includes(value)
    ),
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        ref: 'input',
        value: this.value,
        class: this.className,
      }
    },
    className() {
      return [
        this.$style.input,
        this.$style[this.variant],
        {
          [this.$style.error]: this.invalid,
        },
      ]
    },
    classLabel() {
      return [this.$style.label, this.$style[`label_${this.size}`]]
    },
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
    onEnter() {
      this.submit().catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" module>
@mixin checkbox-variant2(
  $bg,
  $border,
  $bg-hover,
  $border-hover,
  $color-hover,
  $bg-checked,
  $color-checked,
  $color-label
) {
  + .label {
    color: $color-label;

    &::before {
      background-color: $bg;
      border-color: $border;
    }

    &:hover {
      &::before {
        background-color: $bg-hover;
        border-color: $border-hover;
      }

      &::after {
        border-color: $color-hover;
      }
    }
  }

  &:checked + .label {
    &::before {
      background-color: $bg-checked;
    }

    &::after {
      border-color: $color-checked;
    }
  }

  &[disabled] + .label {
    cursor: default;

    &::before {
      background-color: $bg;
      border-color: $border;
    }

    &::after {
      opacity: 0;
    }
  }
}

.wrapper {
  position: relative;
}

.input {
  position: absolute;
  z-index: 1;
  width: px-to-rem(20px);
  opacity: 0;

  &:checked + .label {
    &::before {
      border: none;
    }

    &::after {
      opacity: 1;
    }
  }
}

.label {
  position: relative;
  display: block;
  padding: 0 0 0 px-to-rem(30px) + 0;
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  word-wrap: break-word;
  cursor: pointer;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: px-to-rem(20px);
    height: px-to-rem(20px);
    content: '';
    border-style: solid;
    border-width: px-to-rem(1.5px);
    border-radius: px-to-rem(4px);
    transition: background-color ease-in-out 0.15s;
  }

  &::after {
    position: absolute;
    top: px-to-rem(5px);
    left: px-to-rem(5px);
    width: px-to-rem(10px);
    height: px-to-rem(7px);
    content: '';
    background: transparent;
    border-style: solid;
    border-width: px-to-rem(2px);
    border-top: none;
    border-right: none;
    opacity: 0;
    transition: opacity ease-in-out 0.15s;
    transform: rotate(-45deg);
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}

.label_sm {
  font-size: px-to-rem(12px);
  line-height: px-to-rem(22px);
}

.default {
  @include checkbox-variant2(
    $input_bg,
    $checkbox_default_border,
    $checkbox_default_hover_bg,
    $checkbox_default_hover_border,
    $checkbox_default_hover_color,
    $checkbox_default_checked_bg,
    $checkbox_default_checked_color,
    $label_color
  );

  &:focus + .label {
    background: $outline_bg;
    border-radius: px-to-rem(1px);
    box-shadow:
      0 0 0 px-to-rem(2px) $container_bg,
      0 0 0 px-to-rem(3.5px) $outline_border;
  }
}

.secondary {
  @include checkbox-variant2(
    $input_bg,
    $checkbox_secondary_border,
    $checkbox_secondary_hover_bg,
    $checkbox_secondary_hover_border,
    $checkbox_secondary_hover_color,
    $checkbox_secondary_checked_bg,
    $checkbox_secondary_checked_color,
    $checkbox_secondary_label_color
  );
}

.error + .label::before {
  border-color: $error;
}
</style>
