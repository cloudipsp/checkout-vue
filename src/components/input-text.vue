<template>
  <div :class="['f-form-group', hasError ? css.he : '', hasDefaultSlot ? css.hf : '']">
    <label :class="[css.cl, hasError ? css.le : '']" :for="name_">{{ label_ }}</label>
    <div v-if="group && mask" :class="[css.ig]">
      <the-mask
        v-validate="validate"
        v-model="form[field_]"
        :data-vv-as="label_"
        :data-vv-name="name_"
        :type="type"
        :class="[css.fc, hasError ? css.ie : '']"
        :id="name_"
        :maxlength="maxlength"
        :placeholder="placeholder_"

        :mask="mask"
        :masked="masked"
        :tokens="tokens"
        @blur.native="blur()"
      ></the-mask>
      <tooltip v-if="options.tooltip" :text="errors.first(name_)" :enable="hasError" :placement="placement" :target="'#'+name_"></tooltip>
      <div v-if="!options.tooltip && hasError" class="f-error">{{ errors.first(name_) }}</div>
      <slot name="group"></slot>
    </div>
    <the-mask
      v-else-if="mask"
      v-validate="validate"
      v-model="form[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="[css.fc, hasError ? css.ie : '']"
      :id="name_"
      :maxlength="maxlength"
      :placeholder="placeholder_"

      :mask="mask"
      :masked="masked"
      :tokens="tokens"
      @blur.native="blur()"
    ></the-mask>
    <input
      v-else
      v-validate="validate"
      v-model="form[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="[css.fc, hasError ? css.ie : '']"
      :id="name_"
      :maxlength="maxlength"
      :placeholder="placeholder_"
    >
    <slot></slot>
    <tooltip v-if="!group && options.tooltip" :text="errors.first(name_)" :enable="hasError" :placement="placement" :target="'#'+name_"></tooltip>
    <div v-if="!group && !options.tooltip && hasError" class="f-error">{{ errors.first(name_) }}</div>
  </div>
</template>

<script>
  import store from '@/store'
  import Input from '@/mixins/input'

  export default {
    mixins: [Input],
    props: {
      type: {
        type: String,
        default: function () {
          return 'text'
        }
      },
      maxlength: Number,
      mask: [String, Object],
      masked: Boolean,
      tokens: Object,
      group: Boolean
    },
    computed: {
      hasDefaultSlot () {
        return !!this.$slots.default
      }
    },
    methods: {
      blur: function () {
        this.$validator.validate(this.name_)
        this.$validator.flags[this.name_].touched = true

      }
    }
  }
</script>
