<template>
  <div :class="['f-form-group', hasError ? $css.he : '', hasDefaultSlot ? $css.hf : '']">
    <label :class="[$css.cl, hasError ? $css.le : '']" :for="name_">{{ label_ }}</label>
    <input
      v-if="readonly"
      v-model="params[field_]"
      :type="type"
      :class="[$css.fc, classReadonly]"
      :readonly="readonly"
      :disabled="readonly"
      :id="name_"
    >
    <the-mask
        v-else-if="readonly && mask"
        v-model="params[field_]"
        :type="type"
        :class="[$css.fc, classReadonly]"
        :mask="mask"
        :masked="masked"
        :readonly="readonly"
        :disabled="readonly"
        :id="name_"
      >
    </the-mask>
    <div v-else-if="group && mask" :class="[$css.ig]">
      <the-mask
        v-validate="validate"
        v-model="params[field_]"
        :data-vv-as="label_"
        :data-vv-name="name_"
        :type="type"
        :class="[$css.fc, hasError ? $css.ie : '']"
        :id="name_"
        :maxlength="maxlength"
        :placeholder="placeholder_"
        :inputmode="inputmode"

        :mask="mask"
        :masked="masked"
        @blur.native="blur"
        @input="valid"
        @keyup.native.enter="onEnter"
      ></the-mask>
      <tooltip v-if="options.tooltip" :text="errors.first(name_)" :enable="hasError" :placement="placement" :target="'#'+name_"></tooltip>
      <div v-if="!options.tooltip && hasError" class="f-error">{{ errors.first(name_) }}</div>
      <slot name="group"></slot>
    </div>
    <the-mask
      v-else-if="mask"
      v-validate="validate"
      v-model="params[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="[$css.fc, hasError ? $css.ie : '']"
      :id="name_"
      :maxlength="maxlength"
      :placeholder="placeholder_"
      :inputmode="inputmode"

      :mask="mask"
      :masked="masked"
      @blur.native="blur"
      @input="valid"
      @keyup.native.enter="onEnter"
    ></the-mask>
    <input
      v-else
      v-validate="validate"
      v-model="params[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="[$css.fc, hasError ? $css.ie : '']"
      :id="name_"
      :maxlength="maxlength"
      :placeholder="placeholder_"
      :inputmode="inputmode"
      @keyup.enter="onEnter"
    >
    <slot></slot>
    <tooltip v-if="!group && options.tooltip" :text="errors.first(name_)" :enable="hasError" :placement="placement" :target="'#'+name_"></tooltip>
    <div v-if="!group && !options.tooltip && hasError" class="f-error">{{ errors.first(name_) }}</div>
  </div>
</template>

<script>
import Input from '@/mixins/input'

export default {
  mixins: [Input],
  props: {
    type: {
      type: String,
      default: function() {
        return 'text'
      },
    },
    maxlength: Number,
    mask: [String, Object],
    masked: Boolean,
    group: Boolean,
  },
  data() {
    return {
      tokens: {
        X: {
          pattern: /[\dX]/,
        },
      },
    }
  },
  computed: {
    hasDefaultSlot() {
      return !!this.$slots.default
    },
  },
  methods: {
    blur: function() {
      if ('touched' in this.flag) {
        this.$validator.validate(this.name_)
        this.flag.touched = true
      }
    },
    valid: function() {
      this.$nextTick(() => {
        this.$validator.validate(this.name_)
      })
    },
  },
}
</script>
