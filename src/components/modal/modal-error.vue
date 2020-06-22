<template>
  <f-modal-base v-model="error.show" v-bind="attrs" v-on="$listeners">
    <template #modal-title>
      <svg-decline />
      <h5 class="f-modal-title">{{ error.code }}</h5>
    </template>
    {{ error.message }}
  </f-modal-base>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState(['error']),
    attrs() {
      return {
        titleTag: 'div',
        ...this.$attrs,
      }
    },
  },
}
</script>
