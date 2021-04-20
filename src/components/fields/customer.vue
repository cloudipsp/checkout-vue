<template>
  <div v-if="show">
    <f-form-group
      v-for="field in list"
      :key="field.name"
      v-bind="field"
      v-model="params.customer_data[field.name]"
    />
  </div>
</template>

<script>
import config from '@/config/customer-fields'
import countries from '@umpirsky/country-list/data/en/country.json'
import { sort, parseSelect } from '@/utils/sort'
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('options', ['email', 'customer_fields']),
    ...mapState(['params']),
    show() {
      return this.list.length
    },
    list() {
      return this.customer_fields
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
    country() {
      return Object.keys(countries).map(parseSelect).sort(sort('text'))
    },
  },
}
</script>
