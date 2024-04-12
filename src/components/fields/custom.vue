<template>
  <f-form-save v-if="show" name="params.custom" :includes="includes">
    <template #default="{ input }">
      <component
        :is="field.componentName"
        v-for="field in list"
        :key="field.name"
        v-bind="field"
        v-model="params.custom[field.name]"
        @input="input(field.name, $event)"
      />
    </template>
  </f-form-save>
</template>

<script>
import FFormGroup from '@/components/form/group.vue'
import { InputHidden } from '@/import'
import { mapState } from '@/utils/store'
import FFormSave from '@/components/form/form/form-save'

export default {
  components: {
    FFormGroup,
    InputHidden,
    FFormSave,
  },
  computed: {
    ...mapState(['params', 'fields_custom']),
    show() {
      return this.fields_custom.length
    },
    list() {
      return this.fields_custom
    },
    includes() {
      return this.list.map(({ name }) => name)
    },
  },
  created() {
    this.list.forEach(({ name, value }) => {
      this.$set(this.params.custom, name, value)
    })
  },
}
</script>
