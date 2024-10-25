<template>
  <f-row v-slot="{ invalid }" v-bind="$attrs">
    <label v-if="label" :class="$style.label" :for="id" @click="emitFocus">
      {{ label }}
    </label>
    <div :class="$style.inner">
      <label :for="id" :class="$style.prepend" @click="emitFocus">
        <f-svg :name="prepend" fw />
      </label>
      <slot :invalid="invalid" />
    </div>
  </f-row>
</template>

<script>
import FRow from '@/components/input/row'
import FSvg from '@/components/svg'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FRow,
    FSvg,
  },
  inheritAttrs: false,
  props: {
    id: makeProp(PROP_TYPE_STRING),
    label: makeProp(PROP_TYPE_STRING),
    prepend: makeProp(PROP_TYPE_STRING),
  },
  methods: {
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
  display: block;
  margin-bottom: px-to-rem(8px);
  font-size: px-to-rem(14px);
  word-wrap: break-word;
}
</style>
