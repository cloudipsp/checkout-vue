<template>
  <ValidationProvider
    ref="validation"
    class="f-form-control-select-wrapper"
    v-bind="attrsValidation"
  >
    <form-select
      ref="input"
      v-model="innerValue"
      :class="['f-form-control-select', classInput]"
      v-bind="attrs"
      v-on="$listeners"
      @keyup.enter="onEnter"
    />
    <f-svg name="angle-down" />
  </ValidationProvider>
</template>

<script>
import item from '@/mixins/item'
import FormSelect from './helpers/form-select'

export default {
  components: {
    FormSelect,
  },
  mixins: [item],
}
</script>
