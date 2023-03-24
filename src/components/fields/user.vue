<template>
  <f-fields v-if="show" />
</template>

<script>
import { InputText, InputHidden, InputAmount } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFields: {
      template: '#f-fields',
      components: {
        InputText,
        InputHidden,
        InputAmount,
      },
    },
  },
  computed: {
    ...mapState(['fields_custom']),
    ...mapState('options', {
      optionsFields: 'fields',
    }),
    show() {
      return !this.fields_custom.length && this.optionsFields
    },
  },
}
</script>
