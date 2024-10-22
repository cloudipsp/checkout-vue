<template>
  <f-row
    v-slot="{ invalid }"
    v-bind="attrs"
    @mouseenter.native="mouseenter"
    @mouseleave.native="mouseleave"
  >
    <div :class="$style.inner">
      <label :for="id" :class="$style.prepend" @click="emitFocus">
        <f-svg :name="prepend" fw />
      </label>
      <label v-if="label" :class="classLabel" :for="id" @click="emitFocus">
        {{ label }}
      </label>
      <slot :focus="focus" :blur="blur" :invalid="invalid" />
    </div>
  </f-row>
</template>

<script>
import FRow from '@/components/input/row'
import FSvg from '@/components/svg'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_ANY,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { isExist } from '@/utils/inspect'

export default {
  components: {
    FRow,
    FSvg,
  },
  inheritAttrs: false,
  props: {
    id: makeProp(PROP_TYPE_STRING),
    label: makeProp(PROP_TYPE_STRING),
    size: makeProp(PROP_TYPE_STRING, '56', value =>
      ['48', '56'].includes(value)
    ),
    prepend: makeProp(PROP_TYPE_STRING),
    disables: makeProp(PROP_TYPE_BOOLEAN),
    value: makeProp(PROP_TYPE_ANY),
  },
  data() {
    return {
      focused: false,
      hover: false,
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        focused: this.focused,
      }
    },
    isValue() {
      return isExist(this.value) && this.value !== ''
    },
    classLabel() {
      return [
        this.$style.label,
        this.$style[`label_${this.size}`],
        {
          [this.$style.label_active]: this.isValue || this.focused,
          [this.$style.label_hover]: this.hover,
          [this.$style.label_focus]: this.focused,
          [this.$style.label_disabled]: this.disabled,
          [this.$style.label_prepend]: this.prepend,
        },
      ]
    },
  },
  methods: {
    focus() {
      this.focused = true
    },
    blur() {
      this.focused = false
    },
    mouseenter() {
      this.hover = true
    },
    mouseleave() {
      this.hover = false
    },
    emitFocus() {
      this.$emit('focus')
    },
  },
}
</script>

<style lang="scss" module>
.inner {
  position: relative;
}

.prepend {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  color: $input_prepend_color;
}

.label {
  position: absolute;
  right: px-to-rem(28px);
  left: px-to-rem(12px);
  font-size: px-to-rem(16px);
  line-height: px-to-rem(24px);
  color: $label_color;
  transition: transform ease-in-out 0.15s;
  transform-origin: 0 0;
  @include text-truncate;
}

.label_56 {
  top: px-to-rem(17px);
}

.label_48 {
  top: px-to-rem(10px);
}

.label_active {
  transform: translateY(-8px) scale(0.75);
}

.label_hover {
  color: $label_hover_color;
}

.label_focus {
  color: $label_focus_color;
}

.label_disabled {
  color: $label_color;
}

.label_prepend {
  left: px-to-rem(40px);
}
</style>
