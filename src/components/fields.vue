<template>
  <div class="f-fields">
    <fields-button />
    <fields-user v-if="showUserFields" />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FieldsButton from '@/components/fields-button'

export default {
  components: {
    FieldsUser: {
      template: '#f-fields',
    },
    FieldsButton,
  },
  computed: {
    ...mapState(['fields']),
    ...mapState('options', {
      optionsFields: 'fields',
    }),
    showUserFields() {
      return !this.fields.length && this.optionsFields
    },
  },
}
</script>
