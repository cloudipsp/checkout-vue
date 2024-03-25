<template>
  <f-form-save name="params.form" :includes="includes">
    <template #default="{ input }">
      <f-form-group
        v-for="field in list"
        :key="field.name"
        v-bind="field"
        v-model="params.form[field.name]"
        @input="input(field.name, $event)"
      />
    </template>
  </f-form-save>
</template>

<script>
import FFormSave from '@/components/form/form/form-save'
import { mapState } from '@/utils/store'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FFormSave,
  },
  props: {
    fields: makeProp(PROP_TYPE_ARRAY, []),
  },
  computed: {
    ...mapState(['params']),
    list() {
      return this.fields.map(this.parseField)
    },
    includes() {
      return this.list.map(({ name }) => name)
    },
  },
  methods: {
    parseField({ label, placeholder, name, type, validate, mask = '' }) {
      const format = (value = '') => value.toLowerCase().replace(/[. ]/g, '_')
      label = format(label)
      placeholder = format(placeholder)

      let noLabelFloating = Boolean(
        (label && placeholder) || (!label && !placeholder)
      )
      let prependText

      if (!label && placeholder) {
        label = placeholder
        placeholder = ''
      }

      if (mask) {
        let lastNumberIndex = mask.search(/(\d+)(?!.*\d)/) + 1
        prependText = mask.slice(0, lastNumberIndex)
        mask = mask.slice(lastNumberIndex)
        noLabelFloating = true
        label = label || placeholder
        placeholder = ''
      }

      return {
        name,
        noLabelFloating,
        label,
        placeholder,
        component: type === 'date' ? 'date' : 'input',
        rules: this.parseValidate(validate),
        autocomplete: 'on',
        type,
        mask,
        prependText,
      }
    },
    parseValidate(validate) {
      if (!validate) return ''

      const map = {
        min_length: 'min',
        max_length: 'max',
      }
      return validate
        .split(';')
        .map(item => {
          let [name] = item.split(':')

          return item.replace(name, map[name] || name)
        })
        .join('|')
    },
  },
}
</script>
