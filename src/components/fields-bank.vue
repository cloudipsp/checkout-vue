<template>
  <f-form-fields v-bind="attrs" v-on="$listeners" />
</template>

<script>
import FFormFields from '@/components/form/fields'

export default {
  components: {
    FFormFields,
  },
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      model: {},
    }
  },
  computed: {
    attrs() {
      return {
        fields: this.parseFields(this.fields),
        ...this.$attrs,
      }
    },
  },
  methods: {
    parseFields(fields) {
      return fields.map(this.parseField)
    },
    parseField(attrs) {
      return {
        ...attrs,
        component: 'input-text',
        validate: this.parseValidate(attrs.validate),
        autocomplete: 'on',
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
