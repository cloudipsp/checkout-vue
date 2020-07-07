<template>
  <div :class="classGroupName">
    <label v-if="prepend" :for="name_" class="f-form-control-prepend">
      <f-svg :name="prepend" fw />
    </label>
    <f-mask
      v-if="mask"
      :id="name_"
      ref="input"
      v-model="params[field_]"
      v-validate="validate"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="className"
      :maxlength="maxlength"
      :placeholder="placeholder_"
      :inputmode="inputmode"
      :mask="mask"
      :masked="masked"
      :readonly="readonly"
      :disabled="readonly"
      @blur.native="blurNative"
      @keyup.native.enter="onEnter"
      v-on="$listeners"
    />
    <input
      v-else
      :id="name_"
      ref="input"
      v-model="params[field_]"
      v-validate="validate"
      :value="params[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="className"
      :maxlength="maxlength"
      :placeholder="placeholder_"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :readonly="readonly"
      :disabled="readonly"
      @keyup.enter="onEnter"
      v-on="$listeners"
      @focus="focus"
      @blur="blur"
    />
    <slot name="label" :classLabel="classLabel" :name_="name_" :label_="label_">
      <label :class="classLabel" :for="name_">{{ label_ }}</label>
    </slot>
    <slot />
    <f-tooltip-error
      v-if="tooltip"
      :title="errors.first(name_)"
      :show="hasError"
      :target="'#' + name_"
      under-sticky
    />
    <transition name="slide-fade">
      <div v-if="!tooltip && hasError && focused" class="f-error">
        {{ errors.first(name_) }}
      </div>
    </transition>
  </div>
</template>

<script>
import Input from '@/mixins/input'

export default {
  mixins: [Input],
  props: {
    type: {
      type: String,
      default: 'text',
    },
    maxlength: {
      type: Number,
      default: null,
    },
    mask: {
      type: [String, Object],
      default: null,
    },
    masked: Boolean,
  },
  methods: {
    blurNative() {
      this.$refs.input.$emit('blur')
    },
  },
}
</script>
