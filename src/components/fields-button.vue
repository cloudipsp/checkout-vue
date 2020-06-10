<template>
  <div v-if="show">
    <template v-for="field in fields">
      <component :is="field.component" :key="field.name" v-bind="field" />
    </template>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState(['fields']),
    show() {
      return this.fields.length
    },
  },
}
</script>
