<template>
  <div :class="['f-form-group', errors.has(name_) ? css.he : '', hasDefaultSlot ? css.hf : '']">
    <label :class="[css.cl, errors.has(name_) ? css.le : '']" :for="name_">{{ label_ }}</label>
    <div v-if="group && mask" :class="[css.ig]">
      <the-mask
        :name="name_"
        v-validate="validate"
        v-model="form[field_]"
        :data-vv-as="label_"
        :type="type"
        :class="[css.fc, errors.has(name_) ? css.ie : '']"
        :id="name_"
        :maxlength="maxlength"
        :placeholder="placeholder"

        :mask="mask"
        :masked="true"
        @blur.native="$validator.validate(name_)"
      ></the-mask>
      <slot name="group"></slot>
    </div>
    <the-mask
      v-else-if="mask"
      :name="name_"
      v-validate="validate"
      v-model="form[field_]"
      :data-vv-as="label_"
      :type="type"
      :class="[css.fc, errors.has(name_) ? css.ie : '']"
      :id="name_"
      :maxlength="maxlength"
      :placeholder="placeholder"

      :mask="mask"
      :masked="true"
      @blur.native="$validator.validate(name_)"
    ></the-mask>
    <input
      v-else
      :name="name_"
      v-validate="validate"
      v-model="form[field_]"
      :data-vv-as="label_"
      :type="type"
      :class="[css.fc, errors.has(name_) ? css.ie : '']"
      :id="name_"
      :maxlength="maxlength"
      :placeholder="placeholder"
    >
    <slot></slot>
    <div v-if="false && errors.has(name_)" class="f-error">{{ errors.first(name_) }}</div>
    <tooltip :text="errors.first(name_)" :enable="errors.has(name_)" :placement="placement" :target="'#'+name_"></tooltip>
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
      return {
        css: store.state.css
      }
    },
    computed: {
      hasDefaultSlot () {
        return !!this.$slots.default
      }
    }
  }
</script>
