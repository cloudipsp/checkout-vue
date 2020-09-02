<template>
  <div v-if="show" class="f-fast-access">
    <f-icon
      v-for="item in list"
      :key="item.id"
      class="f-fast-access-icon"
      :name="item.bank_logo"
      type="banklinks_eu"
      @click.native="click(item)"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  data() {
    return {
      fast: [],
      count: 10,
    }
  },
  computed: {
    ...mapState('tabs', ['banklinks_eu']),
    // {147209: {country: 'PL', name: 'mBank', bank_logo: 'mbank'}}
    config() {
      return (this.banklinks_eu && this.banklinks_eu.payment_systems) || {}
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
    show() {
      return this.list.length
    },
    list() {
      return this.listFull
        .filter(this.listFilter)
        .sort(this.listSort)
        .slice(0, this.count)
    },
  },
  methods: {
    click(bank) {
      this.store.location('payment-method', 'banklinks_eu', bank.id)
    },
    listFilter(item) {
      return item.quick_method && item.bank_logo !== 'no_logo'
    },
    listSort(a, b) {
      return a.user_priority < b.user_priority ? 1 : -1
    },
  },
}
</script>
