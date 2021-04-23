<template>
  <div v-if="show">
    <component
      :is="field.componentName"
      v-for="field in list"
      :key="field.name"
      v-bind="field"
      v-model="params.custom[field.name]"
    />
  </div>
</template>

<script>
import { InputHidden } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    InputHidden,
  },
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
