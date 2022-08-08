<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <f-select
      v-model="innerValue"
      :class="['f-select-text', classInput]"
      v-bind="attrs"
      v-on="$listeners"
    >
      <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
      <template
        v-for="slot in Object.keys($scopedSlots)"
        :slot="slot"
        slot-scope="slotData"
      >
        <slot :name="slot" v-bind="slotData" />
      </template>
    </f-select>
  </ValidationProvider>
</template>

<script>
import FSelect from '@/components/form/item/helpers/select'
import { itemMixin } from '@/mixins/item'

export default {
  components: {
    FSelect,
  },
  mixins: [itemMixin],
}
</script>
