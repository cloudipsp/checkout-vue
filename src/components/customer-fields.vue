<template>
  <div v-if="show" class="f-customer-fields">
    <f-form-group
      v-for="field in list"
      :key="field.name"
      v-model="params.customer_data[field.name]"
      v-bind="field"
    />
  </div>
</template>

<script>
import config from '@/config/customer-fields'
import countries from '@/config/countries'
import { sort } from '@/utils/sort'
import { mapState } from '@/utils/store'
import { parseSelect } from '@/utils/sort'

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
      return countries.map(parseSelect).sort(sort('text'))
    },
  },
}
</script>
