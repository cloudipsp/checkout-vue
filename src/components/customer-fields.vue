<template>
  <div v-if="show" class="f-customer-fields">
    <div v-for="item in list" :key="item.name">
      <component :is="item.component" v-bind="item" />
    </div>
  </div>
</template>

<script>
import config from '@/config/customer-fields'
import countries from '@/config/countries'
import { sort } from '@/utils/sort'
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('options', ['email', 'customer_fields']),
    show() {
      return this.list.length
    },
    list() {
      return this.customer_fields
        .filter(name => name !== 'email' || !this.email)
        .filter(name => config[name])
        .reduce((result, field) => {
          let list = config[field].dictionary && this.country
          result.push({
            ...config[field],
            field,
            list,
            customer_data: true,
            component: list ? 'input-select' : 'input-text',
          })
          return result
        }, [])
    },
    country() {
      return countries.map(this.parseCountry).sort(sort('name'))
    },
    parseCountry() {
      return item => ({
        id: item,
        name: this.$t(item),
      })
    },
  },
}
</script>
