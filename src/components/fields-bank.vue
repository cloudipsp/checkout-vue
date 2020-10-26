<template>
  <div class="f-form-fields">
    <f-form-group
      v-for="field in list"
      :key="field.name"
      v-model="params.form[field.name]"
      v-bind="field"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(['params']),
    list() {
      return this.fields.map(this.parseField)
    },
  },
  methods: {
    parseField(attrs) {
      return {
        ...attrs,
        description: attrs.label,
        label: attrs.placeholder,
        placeholder: '',
        component: attrs.type === 'date' ? 'date' : 'input',
        rules: this.parseValidate(attrs.validate),
        autocomplete: 'on',
        message: null,
        validate: null,
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
