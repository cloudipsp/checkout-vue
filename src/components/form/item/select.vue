<template>
  <ValidationProvider
    ref="validation"
    class="f-form-control-select-wrapper"
    v-bind="attrsValidation"
  >
    <f-form-select
      ref="input"
      v-model="innerValue"
      :class="['f-form-control-select', classInput]"
      v-bind="attrs"
      v-on="$listeners"
      @keyup.enter="onEnter"
    />
  </ValidationProvider>
</template>

<script>
import { FFormSelect } from '@/components/form/item/helpers/form-select'
import { itemMixin } from '@/mixins/item'

export default {
  components: {
    FFormSelect,
  },
  mixins: [itemMixin],
}
</script>
