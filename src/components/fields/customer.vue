<template>
  <f-form-save v-if="show" name="params.customer_data" :includes="includes">
    <template #default="{ input }">
      <f-form-group
        v-for="field in list"
        :key="field.name"
        v-bind="field"
        v-model="params.customer_data[field.name]"
        @input="input(field.name, $event)"
      />
    </template>
  </f-form-save>
</template>

<script>
import config from '@/config/customer-fields'
import countries from '@umpirsky/country-list/data/en/country.json'
import { sort, parseSelect } from '@/utils/sort'
import { mapState } from '@/utils/store'
import FFormSave from '@/components/form/form/form-save'

export default {
  components: {
    FFormSave,
  },
  computed: {
    ...mapState('options', ['email']),
    ...mapState(['params', 'fields_customer']),
    show() {
      return this.list.length
    },
    list() {
      return this.fields_customer
        .filter(name => name !== 'email' || !this.email)
        .filter(name => config[name])
        .map(name => {
          let options = config[name].dictionary && this.country
          return {
            ...config[name],
            name,
            options,
            component: options ? 'select' : 'input',
          }
        })
    },
    includes() {
      return this.list.map(({ name }) => name)
    },
    country() {
      return Object.keys(countries).map(parseSelect).sort(sort('text'))
    },
  },
}
</script>
