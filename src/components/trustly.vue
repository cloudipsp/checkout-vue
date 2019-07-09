<script>
import PaymentSystems from '@/mixins/payment-systems'
import { sortBanks } from '@/config/trustly'
import { sort } from '@/utils/helpers'

export default {
  mixins: [PaymentSystems],
  computed: {
    // {147209: {country: 'PL', name: 'mBank', bank_logo: 'mbank'}}
    config() {
      return (
        (this.state.tabs.trustly && this.state.tabs.trustly.payment_systems) ||
        {}
      )
    },
    // [147209]
    keys() {
      return Object.keys(this.config)
    },
    // [{country: 'PL', name: 'mBank', bank_logo: 'mbank'}]
    values() {
      return Object.values(this.config)
    },
    // [{id: 147209, country: 'PL', name: 'mBank', bank_logo: 'mbank'}]
    listFull() {
      return this.values.map((item, i) => ({
        ...item,
        id: this.keys[i],
        bank_logo: item.bank_logo || 'no_logo',
        iban: this.keys[i].split('|')[1] || '',
      }))
    },
    // [{id: 'PL', name: 'Poland'}]
    country() {
      let result =
        this.options.countries && this.options.countries.length
          ? this.options.countries
          : this.values
              .map(item => item.country)
              .filter((item, key, self) => self.indexOf(item) === key)
      result = result.map(item => ({
        id: item,
        name: this.$t(item),
      }))
      return sort(result, 'name')
    },
    // [{id: 147209, country: 'PL', name: 'mBank', bank_logo: 'mbank'}]
    listSelect() {
      return this.listFull.filter(
        item => item.country === this.options.default_country
      )
    },
    // {mbank: {id: 147209, country: 'PL', name: 'mBank', bank_logo: 'mbank'}}
    mapper() {
      let result = {}
      this.listSelect.forEach(function(item) {
        if (item.bank_logo === 'no_logo') return
        result[item.bank_logo] = item
      })
      return result
    },
    // [{id: 147209, country: 'PL', name: 'mBank', bank_logo: 'mbank'}]
    listSort() {
      return sortBanks.map(item => this.mapper[item]).filter(item => item)
    },
    // [{id: 147209, country: 'PL', name: 'mBank', bank_logo: 'mbank'}]
    listFilter() {
      return this.listSort
        .concat(this.listSelect)
        .filter((item, key, self) => self.indexOf(item) === key)
    },
  },
}
</script>
