<template>
  <component :is="name" :class="className" v-bind="$attrs" v-on="$listeners">
    <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
  </component>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    component: {
      type: String,
      default: 'input',
      validator: value => ['input', 'date', 'checkbox'].includes(value),
    },
  },
  computed: {
    name() {
      return 'f-form-item-' + this.component
    },
    className() {
      return 'f-form-item-' + this.component
    },
  },
}
</script>
