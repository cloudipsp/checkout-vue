<template>
  <div class="f-form-fields">
    <component
      :is="field.component"
      v-for="field in fields"
      :key="field.name"
      v-bind="field"
    />
  </div>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
