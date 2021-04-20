<template>
  <f-fields v-if="show" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  components: {
    FFields: {
      template: '#f-fields',
    },
  },
  computed: {
    ...mapState(['fields']),
    ...mapState('options', {
      optionsFields: 'fields',
    }),
    show() {
      return !this.fields.length && this.optionsFields
    },
  },
}
</script>
