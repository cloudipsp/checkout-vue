<template>
  <div class="f-customer-fields">
    <div v-for="item in getFields" :key="item.name">
      <input-select v-if="item.list" v-bind="item" />
      <input-text v-else v-bind="item" />
    </div>
  </div>
</template>

<script>
import config from '@/config/customer-fields'
import countries from '@/config/countries'
import { sort } from '@/utils/helpers'

export default {
  computed: {
    countries: function() {
      let result = countries.map(item => ({
        id: item,
        name: this.$t(item),
      }))
      return sort(result, 'name')
    },
    getFields: function() {
      return this.options.customer_fields
        .filter(name => config[name])
        .reduce((result, field) => {
          result.push({
            ...config[field],
            field,
            list: config[field].dictionary && this.countries,
            customer_data: true,
          })
          return result
        }, [])
    },
  },
  created: function() {
    let index = this.options.customer_fields.indexOf('email')
    if (this.options.email && index > -1) {
      this.options.customer_fields.splice(index, 1)
    }
  },
}
</script>
