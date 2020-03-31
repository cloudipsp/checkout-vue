<template>
  <div v-if="show" class="f-block f-block-hr">
    <div class="f-block-sm">
      <template v-for="field in fields">
        <component :is="field.component" :key="field.name" v-bind="field" />
      </template>
    </div>
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
