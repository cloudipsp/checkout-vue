<template>
  <div v-if="show">
    <component
      :is="field.componentName"
      v-for="field in list"
      :key="field.name"
      v-model="params.custom[field.name]"
      v-bind="field"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState(['params', 'fields']),
    show() {
      return this.fields.length
    },
    list() {
      return this.fields
    },
  },
  created() {
    this.list.forEach(({ name, value }) => {
      this.params.custom[name] = value
    })
  },
}
</script>
