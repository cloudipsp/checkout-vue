<template>
  <div :class="classGroupName">
    <input
      :id="name_"
      v-model="value_"
      v-validate="validate"
      :data-vv-as="label_"
      :data-vv-name="name_"
      type="checkbox"
      :class="className"
      @focus="focus"
      @blur="blur"
    />
    <label class="f-checkbox-label" :for="name_"><slot /></label>
    <transition name="slide-fade">
      <div v-if="showError" class="f-error">
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
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'secondary'].includes(value),
    },
  },
  computed: {
    className() {
      return [
        'f-checkbox',
        `f-checkbox-${this.variant}`,
        this.classReadonly,
        this.classError,
        this.inputClass,
      ]
    },
  },
}
</script>
