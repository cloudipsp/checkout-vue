<template>
  <f-modal-form v-bind="$attrs" :title="title" :list="list" v-on="$listeners">
    <template #icon>
      <f-icon size="lg" :name="logo" />
    </template>
  </f-modal-form>
</template>

<script>
import FModalForm from '@/components/modal-form'

export default {
  components: {
    FModalForm,
  },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      model: {},
    }
  },
  computed: {
    title() {
      return this.config.form.name
    },
    logo() {
      return this.config.bank_logo
    },
    list() {
      return this.parseFields(this.config.form.fields)
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
        reqired: 'required',
        min_length: 'min',
        max_length: 'max',
      }
      return validate
        .split(';')
        .map(item => {
          let [name] = item.split(':')

          return item.replace(new RegExp(name), map[name])
        })
        .join('|')
    },
  },
}
</script>
