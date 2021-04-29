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
import FormSelect from '@/components/form/item/helpers/form-select'
import FSvg from '@/components/svg'
import { itemMixin } from '@/mixins/item'

export default {
  components: {
    FormSelect,
    FSvg,
  },
  mixins: [itemMixin],
}
</script>
