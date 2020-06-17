<template>
  <div :class="classGroupName">
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
    <label :class="classLabel" :for="name_">{{ label_ }}</label>
    <slot />
    <f-tooltip-error
      v-if="tooltip"
      :title="errors.first(name_)"
      :show="hasError"
      :target="'#' + name_"
    />
    <div v-if="!tooltip && hasError" class="f-error">
      {{ errors.first(name_) }}
    </div>
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
