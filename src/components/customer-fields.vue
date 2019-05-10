<template>
  <div class="f-customer-fields">
    <div v-for="item in getFields" :key="item.name">
      <input-select
        v-if="item.list"
        :list="item.list"
        :name="item.name"
        :field="item.field"
        :validate="item.valid"
        customer_data
      />
      <input-text
        v-else
        :name="item.name"
        :field="item.field"
        :validate="item.valid"
        customer_data
      />
    </div>
  </div>
</template>

<script>
import config from '@/config/customer-fields'
import countries from '@/config/countries'
import InputText from '@/components/input-text'
import InputSelect from '@/components/input-select'
import { sort } from '@/utils/helpers'

export default {
  components: {
    InputText,
    InputSelect,
  },
  data() {
    return {}
  },
  computed: {
    countries: function() {
      let result = countries.map(item => ({
        id: item,
        name: this.$t(item),
      }))
      return sort(result, 'name')
    },
    getFields: function() {
      let result = []
      this.options.customer_fields.forEach(name => {
        let item = { field: name }
        if (config[name].dictionary) {
          item.list = this.countries
        }
        config[name] && result.push(Object.assign(item, config[name]))
      })
      return result
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
