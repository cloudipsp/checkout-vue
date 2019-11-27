<template>
  <div
    :class="[
      'f-form-group',
      hasError ? $css.he : '',
      hasDefaultSlot ? $css.hf : '',
    ]"
  >
    <label :class="[$css.cl, hasError ? $css.le : '']" :for="name_">{{
      label_
    }}</label>
    <input
      v-if="readonly"
      :id="name_"
      v-model="params[field_]"
      :type="type"
      :class="[$css.fc, classReadonly]"
      :readonly="readonly"
      :disabled="readonly"
    />
    <f-mask
      v-else-if="readonly && mask"
      :id="name_"
      v-model="params[field_]"
      :type="type"
      :class="[$css.fc, classReadonly]"
      :mask="mask"
      :masked="masked"
      :readonly="readonly"
      :disabled="readonly"
    />
    <div v-else-if="group && mask" :class="[$css.ig]">
      <f-mask
        :id="name_"
        ref="input"
        v-model="params[field_]"
        v-validate="validate"
        :data-vv-as="label_"
        :data-vv-name="name_"
        :type="type"
        :class="[$css.fc, hasError ? $css.ie : '']"
        :maxlength="maxlength"
        :placeholder="placeholder_"
        :inputmode="inputmode"
        :mask="mask"
        :masked="masked"
        @blur.native="blur"
        @keyup.native.enter="onEnter"
      />
      <f-tooltip
        v-if="options.tooltip"
        :text="errors.first(name_)"
        :enable="hasError"
        :placement="placement"
        :target="'#' + name_"
      />
      <div v-if="!options.tooltip && hasError" class="f-error">
        {{ errors.first(name_) }}
      </div>
      <slot name="group" />
    </div>
    <f-mask
      v-else-if="mask"
      :id="name_"
      ref="input"
      v-model="params[field_]"
      v-validate="validate"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="[$css.fc, hasError ? $css.ie : '']"
      :maxlength="maxlength"
      :placeholder="placeholder_"
      :inputmode="inputmode"
      :mask="mask"
      :masked="masked"
      @blur.native="blur"
      @keyup.native.enter="onEnter"
    />
    <input
      v-else
      :id="name_"
      v-model="params[field_]"
      v-validate="validate"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="[$css.fc, hasError ? $css.ie : '']"
      :maxlength="maxlength"
      :placeholder="placeholder_"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      @keyup.enter="onEnter"
    />
    <slot />
    <f-tooltip
      v-if="!group && options.tooltip"
      :text="errors.first(name_)"
      :enable="hasError"
      :placement="placement"
      :target="'#' + name_"
    />
    <div v-if="!group && !options.tooltip && hasError" class="f-error">
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
    group: Boolean,
  },
  computed: {
    hasDefaultSlot() {
      return !!this.$slots.default
    },
  },
  methods: {
    blur() {
      this.$refs.input.$emit('blur')
    },
  },
}
</script>
