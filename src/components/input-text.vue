<template>
  <div :class="['f-form-group', errors.has(name_) ? css.he : '', hasDefaultSlot ? css.hf : '']">
    <label :class="[css.cl, errors.has(name_) ? css.le : '']" :for="name_">{{ label_ }}</label>
    <div v-if="group && mask" :class="[css.ig]">
      <the-mask
        v-validate="validate"
        v-model="form[field_]"
        :data-vv-as="label_"
        :data-vv-name="name_"
        :type="type"
        :class="[css.fc, errors.has(name_) ? css.ie : '']"
        :id="name_"
        :maxlength="maxlength"
        :placeholder="placeholder"

        :mask="mask"
        :masked="masked"
        @blur.native="$validator.validate(name_)"
      ></the-mask>
      <tooltip v-if="options.tooltip" :text="errors.first(name_)" :enable="errors.has(name_)" :placement="placement" :target="'#'+name_"></tooltip>
      <div v-if="!options.tooltip && errors.has(name_)" class="f-error">{{ errors.first(name_) }}</div>
      <slot name="group"></slot>
    </div>
    <the-mask
      v-else-if="mask"
      v-validate="validate"
      v-model="form[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="[css.fc, errors.has(name_) ? css.ie : '']"
      :id="name_"
      :maxlength="maxlength"
      :placeholder="placeholder"

      :mask="mask"
      :masked="masked"
      @blur.native="$validator.validate(name_)"
    ></the-mask>
    <input
      v-else
      v-validate="validate"
      v-model="form[field_]"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :type="type"
      :class="[css.fc, errors.has(name_) ? css.ie : '']"
      :id="name_"
      :maxlength="maxlength"
      :placeholder="placeholder"
    >
    <slot></slot>
    <tooltip v-if="!group && options.tooltip" :text="errors.first(name_)" :enable="errors.has(name_)" :placement="placement" :target="'#'+name_"></tooltip>
    <div v-if="!group && !options.tooltip && errors.has(name_)" class="f-error">{{ errors.first(name_) }}</div>
  </div>
</template>

<script>
  import store from '@/store'
  import Input from '@/mixins/input'

  export default {
    mixins: [Input],
    inject: ['$validator'],
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
      group: Boolean
    },
    data () {
      return {}
    },
    computed: {
      hasDefaultSlot () {
        return !!this.$slots.default
      }
    }
  }
</script>
